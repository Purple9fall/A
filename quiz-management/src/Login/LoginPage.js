import React, { useState } from "react";
import "./LoginPage.css";
// import { Link } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // icon user, cài react-icons nếu chưa có
// npm install react-icons

function LoginPage(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // const handleLogin = (e) => {
  //   e.preventDefault();
  //   if (!email || !password) alert("Vui lòng nhập đầy đủ thông tin!");
  //   else alert(`Đăng nhập thành công với tài khoản: ${email}`);
  // };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    // ✅ Kiểm tra tài khoản mẫu
    if (email === "admin@gmail.com" && password === "123456") {
      alert(`Đăng nhập thành công với tài khoản: ${email}`);
      const userData = { name: "Admin", email };
      if (props.onLoginSuccess) props.onLoginSuccess(userData); // Gọi callback về App.js
    } else {
      alert("Sai email hoặc mật khẩu!");
    }
  };



  return (
    <div className="login-wrapper">
      {/* Tiêu đề chính nằm ngoài card */}
      <h1 className="main-title">
        HỆ THỐNG THI TRẮC NGHIỆM TRỰC TUYẾN
      </h1>

      <div className="login-card">
        {/* Icon thay cho chữ trên card */}
        <div className="card-icon">
          <FaUserCircle />
        </div>

        <form onSubmit={handleLogin} className="login-form">
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
            {/* Quên mật khẩu? <a href="#">Khôi phục tại đây</a> */}
            Quên mật khẩu?<button className="link-btn">Khôi phục tại đây</button>
          </p>

          {/* <p className="signup-note">
            Chưa có tài khoản?{" "}
            <Link to="/register" className="link-btn">
                Đăng ký tại đây
            </Link>
          </p> */}

          <p className="signup-note">
            Chưa có tài khoản?{" "}
            <button className="link-btn" onClick={props.onSwitch}>
            {/* <button onClick={props.onSwitch}>Đăng ký tại đây</button> */}
              Đăng ký tại đây
            </button>
          </p>

        </form>
      </div>
    </div>
  );
}

export default LoginPage;
