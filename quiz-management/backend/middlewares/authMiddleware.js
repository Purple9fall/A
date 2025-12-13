// import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//     const header = req.headers.authorization;
//     if (!header) return res.status(401).json({ message: "Thiếu token" });

//     const token = header.split(" ")[1];

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         req.user = decoded; 
//         next();
//     } catch (err) {
//         return res.status(403).json({ message: "Token không hợp lệ" });
//     }
// };

// export const allowTeacherOrAdmin = (req, res, next) => {
//     if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });

//     if (req.user.role !== "admin" && req.user.role !== "teacher") {
//         return res.status(403).json({ message: "Bạn không có quyền tạo đề thi" });
//     }

//     next();
// };


import jwt from "jsonwebtoken";

// ========================
// Middleware: Xác thực token
// ========================
export const verifyToken = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "Thiếu token" });

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(
            token, 
            process.env.JWT_SECRET || "SECRET_KEY_CHANGE_IN_PRODUCTION"
        );
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }
};

// ========================
// Middleware: Chỉ cho phép Teacher và Admin
// ========================
export const allowTeacherOrAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });

    if (req.user.role !== "admin" && req.user.role !== "teacher") {
        return res.status(403).json({ message: "Bạn không có quyền truy cập chức năng này" });
    }

    next();
};

// ========================
// Middleware: Chỉ cho phép Admin
// ========================
export const allowAdminOnly = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });

    if (req.user.role !== "admin") {
        return res.status(403).json({ message: "Chỉ admin mới có quyền truy cập" });
    }

    next();
};

// ========================
// Middleware: Chỉ cho phép Student
// ========================
export const allowStudentOnly = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });

    if (req.user.role !== "student") {
        return res.status(403).json({ message: "Chỉ sinh viên mới có quyền truy cập" });
    }

    next();
};