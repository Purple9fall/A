import React, { useState } from "react";
import "./LoginPage.css";
import { FaUserCircle } from "react-icons/fa";

function LoginPage(props) {
  const [username, setUsername] = useState(""); // đổi từ email
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      // Gọi API backend login
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      // Lưu token, role, fullname vào localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      localStorage.setItem("fullname", data.fullname);

      alert(`Đăng nhập thành công! Role: ${data.role}`);

      // Gọi callback về App.js nếu có
      if (props.onLoginSuccess) {
        props.onLoginSuccess({
          fullname: data.fullname,
          username,
          role: data.role,
        });
      }

      // Chuyển hướng theo role (cần props.navigate hoặc react-router)
      if (props.navigate) {
        if (data.role === "admin") props.navigate("/admin");
        else if (data.role === "teacher") props.navigate("/teacher");
        else props.navigate("/student");
      }

    } catch (err) {
      console.error(err);
      alert("Lỗi server, vui lòng thử lại");
    }
  };

  return (
    <div className="login-wrapper">
      <h1 className="main-title">HỆ THỐNG THI TRẮC NGHIỆM TRỰC TUYẾN</h1>

      <div className="login-card">
        <div className="card-icon">
          <FaUserCircle />
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Username</label>
            <input
              type="text"
              placeholder="Nhập username..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label>Mật khẩu</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập mật khẩu..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span
                className="toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "👁️" : "🙈"}
              </span>
            </div>
          </div>

          <button type="submit" className="login-btn">
            Đăng nhập
          </button>

          <p className="note">
            Quên mật khẩu?
            <button className="link-btn">Khôi phục tại đây</button>
          </p>

          <p className="signup-note">
            Chưa có tài khoản?{" "}
            <button className="link-btn" onClick={props.onSwitch}>
              Đăng ký tại đây
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;