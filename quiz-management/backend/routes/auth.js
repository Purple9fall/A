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

    if (!fullname || !username || !password || !role_name) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin!" });
    }

    // Kiểm tra role
    const [roleRows] = await db.promise().query(
      "SELECT id, invite_code FROM roles WHERE role_name = ?",
      [role_name]
    );

    if (roleRows.length === 0) {
      return res.status(400).json({ message: "Vai trò không hợp lệ!" });
    }

    const role = roleRows[0];

    // Nếu role là teacher, bắt buộc nhập invite_code
    if (role_name === "teacher") {
      if (!invite_code_input || invite_code_input !== role.invite_code) {
        return res.status(400).json({ message: "Mã vai trò giảng viên không hợp lệ!" });
      }
    }

    // Kiểm tra username đã tồn tại chưa
    const [existing] = await db.promise().query(
      "SELECT id FROM users WHERE username = ?",
      [username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: "Username đã được sử dụng!" });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Lưu user vào DB
    await db.promise().query(
      "INSERT INTO users (username, password, full_name, role_id) VALUES (?, ?, ?, ?)",
      [username, hashed, fullname, role.id]
    );

    res.json({ message: "Đăng ký thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

// ========================
// LOGIN
// ========================
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Vui lòng nhập đủ thông tin!" });
    }

    // Lấy user kèm role_name
    const [userRows] = await db.promise().query(
      `SELECT users.id, users.username, users.password, users.full_name, roles.role_name
       FROM users
       INNER JOIN roles ON users.role_id = roles.id
       WHERE users.username = ?`,
      [username]
    );

    if (userRows.length === 0) {
      return res.status(400).json({ message: "Username không tồn tại!" });
    }

    const user = userRows[0];

    // So sánh password
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: "Mật khẩu không đúng!" });
    }

    // Tạo token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role_name },
      "SECRET_KEY",        // ⚠️ Thay bằng secret thực tế khi deploy
      { expiresIn: "1d" }
    );

    res.json({
      message: "Đăng nhập thành công!",
      token,
      role: user.role_name,
      fullname: user.full_name
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi server!" });
  }
});

export default router;

