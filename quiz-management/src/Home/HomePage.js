import React from 'react';
import './HomePage.css';
import Navbar from '../Navbar/Navbar';
import illustrationHomeIntro from '../assets/HomeIntro1.png';

const HeroSection = ({ onStart }) => {
    return (
        <div className="hero-container system-hero">
            <div className="background-effects system-bg-effects"></div>

            <div className="hero-content">
                <div className="hero-main-content">
                    {/* Cột 1: Hình ảnh */}
                    <div className="hero-illustration">
                        <img src={illustrationHomeIntro} alt="Online Testing Illustration" />
                    </div>

                    {/* Cột 2: Tiêu đề và nút */}
                    <div className="hero-text-and-action">
                        <h1 className="hero-title system-title">
                            <span className="title-line">Tạo đề nhanh,</span>
                            <br />
                            chấm điểm tự động,
                            <br />
                            quản lý dễ dàng.
                        </h1>
                        <button
                            className="btn-discover-now btn-system-action"
                            onClick={onStart}
                        >
                            KHÁM PHÁ NGAY
                        </button>
                    </div>
                </div>
            </div>

            <div className="corner-robot system-corner-icon">📊</div>
        </div>
    );
};

// const HomePage = ({ email, onLogout, onStartIntroduce }) => {
//     return (
//         <div className="home-page-wrapper">
//             <Navbar onLogout={onLogout} user={email} />
//             <HeroSection onStart={onStartIntroduce} />
//         </div>
//     );
// };

const HomePage = ({ email, onLogout, onStartIntroduce, onShowTeachers, onShowStudents, onShowExamBank, onShowCreateExam }) => {
    return (
        <div className="home-page-wrapper">
            {/* Truyền prop onShowTeachers xuống Navbar */}
            <Navbar 
                onLogout={onLogout} 
                user={email} 
                onShowTeachers={onShowTeachers}
                onShowStudents={onShowStudents} 
                onShowExamBank={onShowExamBank}
                onShowCreateExam={onShowCreateExam}
            />
            <HeroSection onStart={onStartIntroduce} />
        </div>
    );
};

export default HomePage;