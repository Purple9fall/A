// import React from "react";
// import './IntroducePage.css'; // File CSS cơ bản

// const IntroducePage = ({ onBack }) => {
//   return (
//     <div className="introduce-wrapper">
//       <h1>GIỚI THIỆU BÀI THI</h1>
//       <p>Đây là trang khung. Nội dung sẽ thêm sau.</p>
//       <button onClick={onBack}>Quay lại trang chủ</button>
//     </div>
//   );
// };

// export default IntroducePage;

import React from "react";
import './IntroducePage.css'; // File CSS cơ bản

const FeatureCard = ({ title, description, colorClass }) => {
    return (
        <div className={`card-item ${colorClass}`}>
            <h3 className="card-title">{title}</h3>
            <p className="card-description">{description}</p>
            <div className="card-arrow-icon">
                {/* Sử dụng ký tự mũi tên lên */}
                <span className="arrow">^</span>
            </div>
        </div>
    );
};

const IntroducePage = ({ onBack }) => {
    const features = [
        {
            title: "IELTS",
            description: "Học toàn diện 4 kỹ năng, chấm chữa cặn kẽ cùng giáo viên, luyện tập thông minh với phòng ảo Prep AI.",
            colorClass: "blue-gradient"
        },
        {
            title: "TOEIC",
            description: "Lộ trình học tinh gọn, bật mí bí kíp về đích nhanh chóng, dễ dàng đạt mục tiêu khi luyện đề cùng phòng ảo Prep AI.",
            colorClass: "dark-blue-gradient"
        },
        {
            title: "HSK",
            description: "Xây nền chắc chắn, chuẩn chỉnh từ sơ cấp. Luyện tập khẩu ngữ cùng AI, tiến bộ rõ nét qua từng bài.",
            colorClass: "green-gradient"
        },
        {
            title: "PrepTalk English",
            description: "Giao tiếp linh hoạt với bộ chủ đề có tính ứng dụng cao, thực hành và chấm chữa liên tục trong đa hoạt cảnh cùng phòng ảo nhập vai Prep AI.",
            colorClass: "yellow-gradient"
        }
    ];

    return (
        <section className="introduce-section">
            <div className="content-container">
                
                {/* Tiêu đề chính và mô tả */}
                <div className="header-content">
                    <h1 className="main-title slide-in-top">
                        Tinh thông mọi ngôn ngữ 
                        <br />
                        với bộ chương trình đào 
                        <br />
                        tạo chất lượng cao
                    </h1>
                    <p className="subtitle fade-in">
                        Học ngoại ngữ thật dễ dàng với lộ trình Học & luyện Thi toàn diện, được cá nhân hóa riêng biệt.
                    </p>
                </div>
                
                {/* Container chứa 4 khối tính năng */}
                <div className="cards-container">
                    {features.map((feature, index) => (
                        // Áp dụng animation delay để các thẻ hiện ra lần lượt
                        <div key={index} className={`card-wrapper slide-up-animation delay-${index}`}>
                            <FeatureCard {...feature} />
                        </div>
                    ))}
                </div>

                {/* Nút quay lại của bạn */}
                <div className="back-button-container">
                    <button className="btn-back" onClick={onBack}>
                        ← Quay lại trang chủ
                    </button>
                </div>

            </div>
            
            {/* Robot nhỏ ở góc dưới bên phải */}
            <div className="corner-robot-small">
                [Image of Small Corner Robot]
            </div>
        </section>
    );
};

export default IntroducePage;