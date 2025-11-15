// const express = require("express");
// const cors = require("cors");
// const db = require("./db"); // <-- lấy kết nối MySQL từ db.js

// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());

// // ========================
// // 📝 API: Lưu đề thi
// // ========================
// app.post("/api/exams", (req, res) => {
//     const { title, duration, parts, questions, tags } = req.body;

//     if (!title) {
//         return res.status(400).json({ message: "Thiếu tiêu đề đề thi" });
//     }

//     const sql = `
//         INSERT INTO exams (title, duration, parts, questions, tags)
//         VALUES (?, ?, ?, ?, ?)
//     `;

//     db.query(
//         sql,
//         [title, duration, parts, questions, JSON.stringify(tags)],
//         (err, result) => {
//             if (err) {
//                 console.error("❌ Lỗi khi lưu đề:", err);
//                 return res.status(500).json({ message: "Lỗi server" });
//             }
//             res.json({ message: "Lưu đề thành công!", examId: result.insertId });
//         }
//     );
// });

// // ========================
// // 📌 API: Lấy danh sách đề
// // ========================
// app.get("/api/exams", (req, res) => {
//     const sql = "SELECT * FROM exams ORDER BY id DESC";

//     db.query(sql, (err, results) => {
//         if (err) {
//             console.error("❌ Lỗi khi lấy đề:", err);
//             return res.status(500).json({ message: "Lỗi server" });
//         }

//         results.forEach(e => {
//             if (e.tags) e.tags = JSON.parse(e.tags);
//         });

//         res.json(results);
//     });
// });

// // ========================
// // 🚀 RUN SERVER
// // ========================
// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
// });


// import express from "express";
// import cors from "cors";
// import db from "./db.js"; // lưu ý có .js

// const app = express();

// // Middleware
// app.use(cors());

// // app.use(cors({
// //     origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // port của React
// //     methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //     credentials: true
// // }));
// app.use(express.json());

// // ========================
// // 📝 API: Lưu đề thi
// // ========================
// app.post("/api/exams", (req, res) => {
//     const { title, duration, parts, questions, tags, description } = req.body;

//     if (!title || !questions) {
//         return res.status(400).json({ message: "Thiếu dữ liệu" });
//     }

//     // Bước 1: Insert exam
//     const sqlExam = `INSERT INTO exams (title, description, duration, parts, tags) VALUES (?, ?, ?, ?, ?)`;
    
//     db.query(sqlExam, [title, description, duration, parts, tags], (err, result) => {
//         if (err) {
//             console.error("❌ Lỗi insert exam:", err);
//             return res.status(500).json({ message: "Lỗi server" });
//         }

//         const examId = result.insertId;
//         const parsedQuestions = JSON.parse(questions);

//         // Bước 2: Insert questions và answers
//         parsedQuestions.forEach((q, index) => {
//             const sqlQuestion = `INSERT INTO questions (exam_id, question_text) VALUES (?, ?)`;
            
//             db.query(sqlQuestion, [examId, q.text], (err2, result2) => {
//                 if (err2) {
//                     console.error("❌ Lỗi insert question:", err2);
//                     return;
//                 }

//                 const questionId = result2.insertId;

//                 // Insert answers
//                 q.answers.forEach(a => {
//                     const sqlAnswer = `INSERT INTO answers (question_id, answer_text, is_correct) VALUES (?, ?, ?)`;
//                     db.query(sqlAnswer, [questionId, a.text, a.isCorrect || false], (err3) => {
//                         if (err3) console.error("❌ Lỗi insert answer:", err3);
//                     });
//                 });
//             });
//         });

//         res.status(201).json({ message: "Lưu đề thành công!", examId, title });
//     });
// });

// // ========================
// // 📌 API: Lấy danh sách đề
// // ========================
// app.get("/api/exams", (req, res) => {
//     const sql = "SELECT * FROM exams ORDER BY id DESC";

//     db.query(sql, (err, results) => {
//         if (err) {
//             console.error("❌ Lỗi khi lấy đề:", err);
//             return res.status(500).json({ message: "Lỗi server" });
//         }

//         results.forEach(e => {
//             if (e.tags) e.tags = JSON.parse(e.tags);
//         });

//         res.json(results);
//     });
// });

// // ========================
// // 🚀 RUN SERVER
// // ========================
// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
// });


// import express from "express";
// import cors from "cors";
// import db from "./db.js";

// const app = express();

// // Middleware
// app.use(cors({
//     origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
//     methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//     credentials: true
// }));

// app.use(express.json());

// // Log requests
// app.use((req, res, next) => {
//     console.log(`📨 ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
//     next();
// });

// // ========================
// // 🧪 API: Test endpoint
// // ========================
// app.get("/api/test", (req, res) => {
//     res.json({ 
//         message: "Backend hoạt động!", 
//         time: new Date().toISOString() 
//     });
// });

// // ========================
// // 📝 API: Lưu đề thi (POST)
// // ========================
// app.post("/api/exams", (req, res) => {
//     console.log("🎯 POST /api/exams - Body:", req.body);
    
//     const { title, duration, parts, questions, tags, description } = req.body;

//     if (!title || !questions) {
//         return res.status(400).json({ message: "Thiếu dữ liệu: title hoặc questions" });
//     }

//     // Insert exam
//     const sqlExam = `INSERT INTO exams (title, description, duration, parts, tags) VALUES (?, ?, ?, ?, ?)`;
    
//     db.query(sqlExam, [title, description || null, duration, parts, tags || null], (err, result) => {
//         if (err) {
//             console.error("❌ Lỗi insert exam:", err);
//             return res.status(500).json({ message: "Lỗi server", error: err.message });
//         }

//         const examId = result.insertId;
//         console.log("✅ Exam inserted, ID:", examId);

//         let parsedQuestions;
//         try {
//             parsedQuestions = JSON.parse(questions);
//         } catch (parseErr) {
//             console.error("❌ Lỗi parse questions:", parseErr);
//             return res.status(400).json({ message: "questions phải là JSON hợp lệ" });
//         }

//         if (parsedQuestions.length === 0) {
//             return res.status(201).json({ 
//                 message: "Lưu đề thành công (không có câu hỏi)", 
//                 examId, 
//                 title 
//             });
//         }

//         // Insert questions và answers
//         let completed = 0;
//         const total = parsedQuestions.length;

//         parsedQuestions.forEach((q, index) => {
//             const sqlQuestion = `INSERT INTO questions (exam_id, question_text, order_index) VALUES (?, ?, ?)`;
            
//             db.query(sqlQuestion, [examId, q.text, index], (err2, result2) => {
//                 if (err2) {
//                     console.error("❌ Lỗi insert question:", err2);
//                     return;
//                 }

//                 const questionId = result2.insertId;
//                 console.log(`✅ Question ${index + 1} inserted, ID:`, questionId);

//                 // Insert answers
//                 if (q.answers && q.answers.length > 0) {
//                     q.answers.forEach((a, aIndex) => {
//                         const sqlAnswer = `INSERT INTO answers (question_id, answer_text, is_correct, order_index) VALUES (?, ?, ?, ?)`;
//                         db.query(sqlAnswer, [questionId, a.text, a.isCorrect || false, aIndex], (err3) => {
//                             if (err3) {
//                                 console.error("❌ Lỗi insert answer:", err3);
//                             }
//                         });
//                     });
//                 }

//                 completed++;
//                 if (completed === total) {
//                     console.log("✅ Tất cả questions/answers đã insert xong");
//                 }
//             });
//         });

//         res.status(201).json({ 
//             message: "Lưu đề thành công!", 
//             examId, 
//             title,
//             totalQuestions: parsedQuestions.length
//         });
//     });
// });

// // ========================
// // 📌 API: Lấy danh sách đề (GET)
// // ========================
// app.get("/api/exams", (req, res) => {
//     console.log("📋 GET /api/exams");
    
//     const sql = `
//         SELECT 
//             e.*,
//             COUNT(DISTINCT q.id) as total_questions
//         FROM exams e
//         LEFT JOIN questions q ON e.id = q.exam_id
//         GROUP BY e.id
//         ORDER BY e.id DESC
//     `;

//     db.query(sql, (err, results) => {
//         if (err) {
//             console.error("❌ Lỗi khi lấy đề:", err);
//             return res.status(500).json({ message: "Lỗi server", error: err.message });
//         }

//         console.log(`✅ Tìm thấy ${results.length} đề thi`);
        
//         res.json({
//             message: "Lấy danh sách thành công",
//             total: results.length,
//             data: results
//         });
//     });
// });

// // ========================
// // 📖 API: Lấy chi tiết 1 đề thi
// // ========================
// app.get("/api/exams/:id", (req, res) => {
//     const examId = req.params.id;
//     console.log(`📖 GET /api/exams/${examId}`);

//     // Lấy thông tin exam
//     const sqlExam = "SELECT * FROM exams WHERE id = ?";
    
//     db.query(sqlExam, [examId], (err, examResults) => {
//         if (err) {
//             console.error("❌ Lỗi:", err);
//             return res.status(500).json({ message: "Lỗi server" });
//         }

//         if (examResults.length === 0) {
//             return res.status(404).json({ message: "Không tìm thấy đề thi" });
//         }

//         const exam = examResults[0];

//         // Lấy questions
//         const sqlQuestions = `
//             SELECT q.*, 
//                    GROUP_CONCAT(
//                        JSON_OBJECT(
//                            'id', a.id,
//                            'text', a.answer_text,
//                            'isCorrect', a.is_correct
//                        ) ORDER BY a.order_index
//                    ) as answers
//             FROM questions q
//             LEFT JOIN answers a ON q.id = a.question_id
//             WHERE q.exam_id = ?
//             GROUP BY q.id
//             ORDER BY q.order_index
//         `;

//         db.query(sqlQuestions, [examId], (err2, questionResults) => {
//             if (err2) {
//                 console.error("❌ Lỗi:", err2);
//                 return res.status(500).json({ message: "Lỗi server" });
//             }

//             // Parse answers JSON
//             questionResults.forEach(q => {
//                 if (q.answers) {
//                     q.answers = JSON.parse(`[${q.answers}]`);
//                 } else {
//                     q.answers = [];
//                 }
//             });

//             res.json({
//                 ...exam,
//                 questions: questionResults
//             });
//         });
//     });
// });

// // ========================
// // 404 Handler
// // ========================
// app.use((req, res) => {
//     console.log(`❌ 404 - ${req.method} ${req.url}`);
//     res.status(404).json({ message: "Route không tồn tại" });
// });

// // ========================
// // 🚀 RUN SERVER
// // ========================
// const PORT = 5000;
// app.listen(PORT, (err) => {
//     if (err) {
//         console.error("❌ Không thể khởi động server:", err);
//         process.exit(1);
//     }
//     console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
//     console.log(`📍 Test: http://localhost:${PORT}/api/test`);
//     console.log(`📋 Danh sách đề: http://localhost:${PORT}/api/exams`);
// });


import express from "express";
import cors from "cors";
import db from "./db.js";

const app = express();

// CORS
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.use(express.json());

// Log requests
app.use((req, res, next) => {
    console.log(`📨 ${new Date().toLocaleTimeString()} - ${req.method} ${req.url}`);
    console.log("Body:", req.body);
    next();
});

// ========================
// 🧪 Test endpoint
// ========================
app.get("/api/test", (req, res) => {
    res.json({ message: "Backend hoạt động!", time: new Date().toISOString() });
});

// ========================
// 📝 POST: Lưu đề thi
// ========================
app.post("/api/exams", (req, res) => {
    console.log("🎯 POST /api/exams");
    
    const { title, duration, parts, questions, tags, description } = req.body;

    if (!title || !questions) {
        return res.status(400).json({ message: "Thiếu title hoặc questions" });
    }

    // Insert exam (tags đã là string "toán,lý")
    const sqlExam = `INSERT INTO exams (title, description, duration, parts, tags) VALUES (?, ?, ?, ?, ?)`;
    
    db.query(sqlExam, [title, description || null, duration, parts, tags || null], (err, result) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ message: "Lỗi server", error: err.message });
        }

        const examId = result.insertId;
        console.log("✅ Exam inserted, ID:", examId);

        let parsedQuestions;
        try {
            parsedQuestions = JSON.parse(questions);
        } catch (parseErr) {
            return res.status(400).json({ message: "questions không phải JSON hợp lệ" });
        }

        if (parsedQuestions.length === 0) {
            return res.status(201).json({ 
                message: "Lưu thành công (không có câu hỏi)", 
                examId, 
                title 
            });
        }

        // Insert questions và answers
        parsedQuestions.forEach((q, index) => {
            const sqlQuestion = `INSERT INTO questions (exam_id, question_text, order_index) VALUES (?, ?, ?)`;
            
            db.query(sqlQuestion, [examId, q.text, index], (err2, result2) => {
                if (err2) {
                    console.error("❌ Insert question error:", err2);
                    return;
                }

                const questionId = result2.insertId;

                if (q.answers && q.answers.length > 0) {
                    q.answers.forEach((a, aIndex) => {
                        const sqlAnswer = `INSERT INTO answers (question_id, answer_text, is_correct, order_index) VALUES (?, ?, ?, ?)`;
                        db.query(sqlAnswer, [questionId, a.text, a.isCorrect || false, aIndex], (err3) => {
                            if (err3) console.error("❌ Insert answer error:", err3);
                        });
                    });
                }
            });
        });

        res.status(201).json({ 
            message: "Lưu đề thành công!", 
            examId, 
            title,
            totalQuestions: parsedQuestions.length
        });
    });
});

// ========================
// 📌 GET: Lấy danh sách đề
// ========================
app.get("/api/exams", (req, res) => {
    console.log("📋 GET /api/exams");
    
    const sql = `
        SELECT 
            e.id,
            e.title,
            e.description,
            e.duration,
            e.parts,
            e.tags,
            e.created_at,
            COUNT(DISTINCT q.id) as questions
        FROM exams e
        LEFT JOIN questions q ON e.id = q.exam_id
        GROUP BY e.id
        ORDER BY e.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("❌ Database error:", err);
            return res.status(500).json({ message: "Lỗi server", error: err.message });
        }

        console.log(`✅ Found ${results.length} exams`);
        
        res.json({
            message: "Lấy danh sách thành công",
            total: results.length,
            data: results  // ✅ Trả về trong object data
        });
    });
});

// 404 Handler
app.use((req, res) => {
    console.log(`❌ 404 - ${req.method} ${req.url}`);
    res.status(404).json({ message: "Route không tồn tại" });
});

// ========================
// 🚀 START SERVER
// ========================
const PORT = 5000;
app.listen(PORT, (err) => {
    if (err) {
        console.error("❌ Server start failed:", err);
        process.exit(1);
    }
    console.log(`🚀 Server running at http://localhost:${PORT}`);
    console.log(`📍 Test: http://localhost:${PORT}/api/test`);
});