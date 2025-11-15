// import React from 'react';
// import './Navbar.css';
// import { FaChevronDown } from "react-icons/fa";

// // ✅ Thêm prop onShowExamBank
// const Navbar = ({ onLogout, user, onShowTeachers, onShowStudents, onShowExamBank, onNavigateHome }) => {
//     const navItems = [
//         { name: 'Trang chủ', link: '#', active: true, action: onNavigateHome },
//         { name: 'Ngân hàng đề', link: '#', hasDropdown: true },
//         { name: 'Tạo bài thi', link: '#', hasDropdown: true },
//         { name: 'Danh sách', link: '#', hasDropdown: true },
//         { name: 'Tài liệu', link: '#', hasDropdown: true },
//     ];

//     return (
//         <nav className="navbar-container system-navbar">
//             <div className="navbar-content">

//                 {/* Logo */}
//                 <div className="navbar-logo" onClick={onNavigateHome}>
//                     <span className="logo-color">HEART</span>
//                     <span className="logo-secondary">STEEL</span>
//                 </div>

//                 {/* Menu */}
//                 <div className="navbar-menu">
//                     {navItems.map((item) => (
//                         <div key={item.name} className="navbar-item-wrapper">
//                             <a
//                                 href={item.link}
//                                 className={`navbar-item ${item.active ? 'active' : ''}`}
//                                 onClick={(e) => {
//                                     if (item.action) {
//                                         e.preventDefault();
//                                         item.action();
//                                     }
//                                 }}
//                             >
//                                 {item.name}
//                                 {item.hasDropdown && <FaChevronDown className="dropdown-arrow" />}
//                             </a>

//                             {/* Dropdown Danh sách */}
//                             {item.name === "Danh sách" && (
//                                 <div className="dropdown-menu">
//                                     <a href="#" className="dropdown-item" onClick={onShowTeachers}>
//                                         Giáo viên
//                                     </a>
//                                     <a href="#" className="dropdown-item" onClick={onShowStudents}>
//                                         Học sinh
//                                     </a>
//                                 </div>
//                             )}

//                             {/* ✅ Dropdown Ngân hàng đề */}
//                             {item.name === "Ngân hàng đề" && (
//                                 <div className="dropdown-menu">
//                                     <a
//                                         href="#"
//                                         className="dropdown-item"
//                                         onClick={() => onShowExamBank("tracnghiem")}
//                                     >
//                                         Trắc nghiệm
//                                     </a>
//                                     <a
//                                         href="#"
//                                         className="dropdown-item"
//                                         onClick={() => onShowExamBank("tuluan")}
//                                     >
//                                         Trả lời ngắn
//                                     </a>
//                                 </div>
//                             )}
//                         </div>
//                     ))}
//                 </div>

//                 {/* Nút logout */}
//                 <div className="navbar-actions">
//                     <button className="btn-start-study btn-system-login" onClick={onLogout}>
//                         Đăng xuất
//                     </button>
//                     <div className="user-icon system-icon">⚙️</div>
//                 </div>
//             </div>
//         </nav>
//     );
// };

// export default Navbar;

import React from 'react';
import './Navbar.css';
import { FaChevronDown } from "react-icons/fa";

// ✅ Thêm prop onShowCreateExam
const Navbar = ({
    onLogout,
    user,
    onShowTeachers,
    onShowStudents,
    onShowExamBank,
    onNavigateHome,
    onShowCreateExam,
}) => {
    const navItems = [
        { name: 'Trang chủ', link: '#', active: true, action: onNavigateHome },
        { name: 'Ngân hàng đề', link: '#', hasDropdown: true },
        { name: 'Tạo bài thi', link: '#', hasDropdown: true },
        { name: 'Danh sách', link: '#', hasDropdown: true },
        { name: 'Tài liệu', link: '#', hasDropdown: true },
    ];

    return (
        <nav className="navbar-container system-navbar">
            <div className="navbar-content">

                {/* Logo */}
                <div className="navbar-logo" onClick={onNavigateHome}>
                    <span className="logo-color">HEART</span>
                    <span className="logo-secondary">STEEL</span>
                </div>

                {/* Menu */}
                <div className="navbar-menu">
                    {navItems.map((item) => (
                        <div key={item.name} className="navbar-item-wrapper">
                            <a
                                href={item.link}
                                className={`navbar-item ${item.active ? 'active' : ''}`}
                                onClick={(e) => {
                                    if (item.action) {
                                        e.preventDefault();
                                        item.action();
                                    }
                                }}
                            >
                                {item.name}
                                {item.hasDropdown && <FaChevronDown className="dropdown-arrow" />}
                            </a>

                            {/* Dropdown Danh sách */}
                            {item.name === "Danh sách" && (
                                <div className="dropdown-menu">
                                    <a href="#" className="dropdown-item" onClick={onShowTeachers}>
                                        Giảng viên
                                    </a>
                                    <a href="#" className="dropdown-item" onClick={onShowStudents}>
                                        Sinh viên
                                    </a>
                                </div>
                            )}

                            {/* Dropdown Ngân hàng đề */}
                            {item.name === "Ngân hàng đề" && (
                                <div className="dropdown-menu">
                                    <a
                                        href="#"
                                        className="dropdown-item"
                                        onClick={() => onShowExamBank("tracnghiem")}
                                    >
                                        Trắc nghiệm
                                    </a>
                                    <a
                                        href="#"
                                        className="dropdown-item"
                                        onClick={() => onShowExamBank("tuluan")}
                                    >
                                        Tự luận
                                    </a>
                                </div>
                            )}

                            {/* ✅ Dropdown Tạo bài thi */}
                            {item.name === "Tạo bài thi" && (
                                <div className="dropdown-menu">
                                    <a
                                        href="#"
                                        className="dropdown-item"
                                        onClick={() => onShowCreateExam("tracnghiem")}
                                    >
                                        Trắc nghiệm
                                    </a>
                                    <a
                                        href="#"
                                        className="dropdown-item"
                                        onClick={() => onShowCreateExam("tuluan")}
                                    >
                                        Tự luận
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Nút logout */}
                <div className="navbar-actions">
                    <button className="btn-start-study btn-system-login" onClick={onLogout}>
                        Đăng xuất
                    </button>
                    <div className="user-icon system-icon">⚙️</div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;

