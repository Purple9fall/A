import React, { useState } from "react";
// import { Link } from "react-router-dom";
import "./RegisterPage.css";
import { FaUserCircle } from "react-icons/fa";

function RegisterPage(props) {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    if (!fullname || !email || !password || !confirmPassword)
      alert("Vui lòng nhập đầy đủ thông tin!");
    else if (password !== confirmPassword)
      alert("Mật khẩu và nhập lại mật khẩu không khớp!");
    else{ 
        alert(`Đăng ký thành công: ${fullname}`);
        if (props.onSwitch) props.onSwitch();
    } // 🔹 Chuyển về trang đăng nhập
  };

  return (
    <div className="register-wrapper">
      {/* Tiêu đề chính */}
      <h1 className="main-title">HỆ THỐNG THI TRẮC NGHIỆM TRỰC TUYẾN</h1>

      <div className="register-card">
        <div className="card-icon">
          <FaUserCircle />
        </div>

        <form onSubmit={handleRegister} className="register-form">
          <div className="input-group">
            <label>Họ và tên</label>
            <input
              type="text"
              placeholder="Nhập họ và tên..."
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
            />
          </div>

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

          <div className="input-group">
            <label>Nhập lại mật khẩu</label>
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Nhập lại mật khẩu..."
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="register-btn">
            Đăng ký
          </button>

          {/* <p className="note">
            Bạn đã có tài khoản?{" "}
            <Link to="/" className="link-btn">
                Đăng nhập tại đây
            </Link>
          </p> */}

          <p className="note">
            Bạn đã có tài khoản?{" "}
            <button className="link-btn" onClick={props.onSwitch}>
            {/* <button onClick={props.onSwitch}>Đăng nhập tại đây</button> */}
              Đăng nhập tại đây
            </button>
          </p>

        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
