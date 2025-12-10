import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ message: "Thiếu token" });

    const token = header.split(" ")[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; 
        next();
    } catch (err) {
        return res.status(403).json({ message: "Token không hợp lệ" });
    }
};

export const allowTeacherOrAdmin = (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Chưa đăng nhập" });

    if (req.user.role !== "admin" && req.user.role !== "teacher") {
        return res.status(403).json({ message: "Bạn không có quyền tạo đề thi" });
    }

    next();
};
