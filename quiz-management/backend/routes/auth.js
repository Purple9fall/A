import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

// ========================
// REGISTER
// ========================
router.post("/register", async (req, res) => {
  try {
    const { fullname, username, password, role_name, invite_code_input, email, phone, department } = req.body;

    // Validate input
    if (!fullname || !username || !password || !role_name) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin!" });
    }

    // Kiểm tra role có tồn tại không
    const [roleRows] = await db.promise().query(
      "SELECT id, invite_code FROM roles WHERE role_name = ?",
      [role_name]
    );

    if (roleRows.length === 0) {
      return res.status(400).json({ message: "Vai trò không hợp lệ!" });
    }

    const role = roleRows[0];

    // Nếu role là teacher, bắt buộc phải có mã invite_code đúng
    if (role_name === "teacher") {
      if (!invite_code_input || invite_code_input !== role.invite_code) {
        return res.status(400).json({ 
          message: "Mã vai trò giảng viên không hợp lệ!" 
        });
      }
    }

    // Kiểm tra username đã tồn tại chưa
    const [existingUsers] = await db.promise().query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ 
        message: "Username đã được sử dụng!" 
      });
    }

    // Kiểm tra email đã tồn tại chưa
    if (email) {
      const [existingEmails] = await db.promise().query(
        "SELECT id FROM users WHERE email = ?",
        [email]
      );

      if (existingEmails.length > 0) {
        return res.status(400).json({ 
          message: "Email đã được sử dụng!" 
        });
      }
    }

    // Hash password với bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu user vào database
    await db.promise().query(
      "INSERT INTO users (username, password, full_name, email, phone, department, role_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [username, hashedPassword, fullname, email || null, phone || null, department || null, role.id]
    );

    res.status(201).json({ 
      message: "Đăng ký thành công!" 
    });

  } catch (err) {
    console.error("❌ Register error:", err);
    res.status(500).json({ 
      message: "Lỗi server, vui lòng thử lại!" 
    });
  }
});

// ========================
// LOGIN
// ========================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({ 
        message: "Vui lòng nhập đủ thông tin!" 
      });
    }

    // Lấy thông tin user kèm role_name từ database
    const [userRows] = await db.promise().query(
      `SELECT 
        users.id, 
        users.username, 
        users.password, 
        users.full_name,
        users.email,
        users.phone,
        users.department,
        roles.role_name
       FROM users
       INNER JOIN roles ON users.role_id = roles.id
       WHERE users.username = ?`,
      [username]
    );

    // Kiểm tra username có tồn tại không
    if (userRows.length === 0) {
      return res.status(400).json({ 
        message: "Username không tồn tại!" 
      });
    }

    const user = userRows[0];

    // So sánh password với bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ 
        message: "Mật khẩu không đúng!" 
      });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role_name 
      },
      process.env.JWT_SECRET || "SECRET_KEY_CHANGE_IN_PRODUCTION",
      { expiresIn: "1d" }
    );

    // Trả về thông tin đăng nhập thành công
    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role_name
      }
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ 
      message: "Lỗi server, vui lòng thử lại!" 
    });
  }
});

// ========================
// VERIFY TOKEN - Sử dụng middleware từ authMiddleware.js
// ========================
router.get("/verify", verifyToken, async (req, res) => {
  try {
    // Lấy thông tin user mới nhất từ database
    const [userRows] = await db.promise().query(
      `SELECT 
        users.id, 
        users.username, 
        users.full_name,
        users.email,
        users.phone,
        users.department,
        roles.role_name
       FROM users
       INNER JOIN roles ON users.role_id = roles.id
       WHERE users.id = ?`,
      [req.user.id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    const user = userRows[0];

    res.json({ 
      message: "Token hợp lệ!", 
      user: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role_name
      }
    });

  } catch (err) {
    console.error("❌ Verify error:", err);
    res.status(500).json({ 
      message: "Lỗi server!" 
    });
  }
});

// ========================
// GET: Lấy thông tin profile user
// ========================
router.get("/profile", verifyToken, async (req, res) => {
  try {
    const [userRows] = await db.promise().query(
      `SELECT 
        users.id, 
        users.username, 
        users.full_name,
        users.email,
        users.phone,
        users.department,
        roles.role_name,
        users.created_at,
        users.updated_at
       FROM users
       INNER JOIN roles ON users.role_id = roles.id
       WHERE users.id = ?`,
      [req.user.id]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    const user = userRows[0];

    res.json({
      message: "Lấy thông tin thành công!",
      user: {
        id: user.id,
        username: user.username,
        name: user.full_name,
        email: user.email,
        phone: user.phone,
        department: user.department,
        role: user.role_name,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    });

  } catch (err) {
    console.error("❌ Get profile error:", err);
    res.status(500).json({ 
      message: "Lỗi server!" 
    });
  }
});

// ========================
// PUT: Cập nhật thông tin profile
// ========================
router.put("/profile", verifyToken, async (req, res) => {
  try {
    const { name, email, phone, department } = req.body;
    const userId = req.user.id;

    console.log(`✏️ PUT /api/auth/profile - User ID: ${userId}`);

    // Validate input
    if (!name || !email) {
      return res.status(400).json({ 
        message: "Họ tên và email là bắt buộc!" 
      });
    }

    // Kiểm tra email đã được sử dụng bởi user khác chưa
    const [existingEmails] = await db.promise().query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, userId]
    );

    if (existingEmails.length > 0) {
      return res.status(400).json({ 
        message: "Email đã được sử dụng bởi tài khoản khác!" 
      });
    }

    // Cập nhật thông tin user
    await db.promise().query(
      `UPDATE users 
       SET full_name = ?, 
           email = ?, 
           phone = ?, 
           department = ?,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [name, email, phone || null, department || null, userId]
    );

    // Lấy thông tin user sau khi cập nhật
    const [updatedUserRows] = await db.promise().query(
      `SELECT 
        users.id, 
        users.username, 
        users.full_name,
        users.email,
        users.phone,
        users.department,
        roles.role_name,
        users.updated_at
       FROM users
       INNER JOIN roles ON users.role_id = roles.id
       WHERE users.id = ?`,
      [userId]
    );

    const updatedUser = updatedUserRows[0];

    console.log(`✅ Cập nhật thành công user ID: ${userId}`);

    res.json({
      message: "Cập nhật thông tin thành công!",
      user: {
        id: updatedUser.id,
        username: updatedUser.username,
        name: updatedUser.full_name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        department: updatedUser.department,
        role: updatedUser.role_name,
        updated_at: updatedUser.updated_at
      }
    });

  } catch (err) {
    console.error("❌ Update profile error:", err);
    res.status(500).json({ 
      message: "Lỗi server, vui lòng thử lại!" 
    });
  }
});

// ========================
// PUT: Đổi mật khẩu
// ========================
router.put("/change-password", verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    console.log(`🔐 PUT /api/auth/change-password - User ID: ${userId}`);

    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        message: "Vui lòng nhập đầy đủ thông tin!" 
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: "Mật khẩu mới phải có ít nhất 6 ký tự!" 
      });
    }

    // Lấy password hiện tại từ database
    const [userRows] = await db.promise().query(
      "SELECT password FROM users WHERE id = ?",
      [userId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User không tồn tại!" });
    }

    const user = userRows[0];

    // Kiểm tra mật khẩu hiện tại có đúng không
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ 
        message: "Mật khẩu hiện tại không đúng!" 
      });
    }

    // Hash mật khẩu mới
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Cập nhật mật khẩu
    await db.promise().query(
      "UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      [hashedPassword, userId]
    );

    console.log(`✅ Đổi mật khẩu thành công user ID: ${userId}`);

    res.json({
      message: "Đổi mật khẩu thành công!"
    });

  } catch (err) {
    console.error("❌ Change password error:", err);
    res.status(500).json({ 
      message: "Lỗi server, vui lòng thử lại!" 
    });
  }
});

export default router;