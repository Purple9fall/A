import express from "express";
import db from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

// ========================
// REGISTER
// ========================
router.post("/register", async (req, res) => {
  try {
    const { fullname, username, password, role_name, invite_code_input } = req.body;

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

    // Hash password với bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Lưu user vào database
    await db.promise().query(
      "INSERT INTO users (username, password, full_name, role_id) VALUES (?, ?, ?, ?)",
      [username, hashedPassword, fullname, role.id]
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
      role: user.role_name,
      fullname: user.full_name,
      username: user.username
    });

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ 
      message: "Lỗi server, vui lòng thử lại!" 
    });
  }
});

// ========================
// VERIFY TOKEN (Optional - để kiểm tra token còn hợp lệ không)
// ========================
router.get("/verify", (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại!" });
    }

    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || "SECRET_KEY_CHANGE_IN_PRODUCTION"
    );

    res.json({ 
      message: "Token hợp lệ!", 
      user: decoded 
    });

  } catch (err) {
    res.status(401).json({ 
      message: "Token không hợp lệ hoặc đã hết hạn!" 
    });
  }
});

export default router;