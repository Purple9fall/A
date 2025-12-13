import express from "express";
import db from "../db.js";

const router = express.Router();

// ========================
// 🚀 START SESSION - Bắt đầu phiên thi
// ========================
router.post("/start", (req, res) => {
    const {
        userId,
        examId,
        deviceInfo,
        settings = {}
    } = req.body;

    if (!userId || !examId) {
        return res.status(400).json({ 
            success: false, 
            message: "Thiếu userId hoặc examId" 
        });
    }

    // Tạo session ID unique
    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Kiểm tra xem user có session active không
    const checkSql = `
        SELECT id, start_time 
        FROM exam_sessions 
        WHERE user_id = ? AND exam_id = ? AND is_active = TRUE
    `;

    db.query(checkSql, [userId, examId], (err, existingSessions) => {
        if (err) {
            console.error("❌ Check session error:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Lỗi kiểm tra session" 
            });
        }

        // Nếu có session cũ đang active
        if (existingSessions.length > 0) {
            console.log("⚠️ User có session active, kick session cũ");
            
            // Gọi stored procedure kick session cũ
            db.query(
                "CALL KickOldSession(?, ?, ?)",
                [userId, examId, sessionId],
                (err2) => {
                    if (err2) {
                        console.error("❌ Kick session error:", err2);
                    }
                }
            );
        }

        // Tạo session mới
        const insertSql = `
            INSERT INTO exam_sessions (
                id, user_id, exam_id,
                device_fingerprint, user_agent, ip_address,
                screen_resolution, timezone, platform,
                require_fullscreen, max_violations
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            sessionId,
            userId,
            examId,
            JSON.stringify(deviceInfo || {}),
            deviceInfo?.userAgent || null,
            deviceInfo?.ipAddress || null,
            deviceInfo?.screenResolution || null,
            deviceInfo?.timezone || null,
            deviceInfo?.platform || null,
            settings.requireFullscreen !== false, // Default true
            settings.maxViolations || 3
        ];

        db.query(insertSql, values, (err3, result) => {
            if (err3) {
                console.error("❌ Create session error:", err3);
                return res.status(500).json({ 
                    success: false, 
                    message: "Không thể tạo session" 
                });
            }

            console.log("✅ Session created:", sessionId);

            res.json({
                success: true,
                sessionId,
                message: "Bắt đầu phiên thi thành công",
                kicked: existingSessions.length > 0
            });
        });
    });
});

// ========================
// 💓 HEARTBEAT - Kiểm tra session còn hoạt động
// ========================
router.post("/heartbeat", (req, res) => {
    const { sessionId } = req.body;

    if (!sessionId) {
        return res.status(400).json({ 
            success: false, 
            message: "Thiếu sessionId" 
        });
    }

    const sql = `
        SELECT id, is_active, is_forced_end 
        FROM exam_sessions 
        WHERE id = ?
    `;

    db.query(sql, [sessionId], (err, results) => {
        if (err) {
            console.error("❌ Heartbeat error:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Lỗi kiểm tra session" 
            });
        }

        if (results.length === 0) {
            return res.json({ 
                success: false, 
                valid: false, 
                message: "Session không tồn tại" 
            });
        }

        const session = results[0];

        // Cập nhật last_heartbeat
        db.query(
            "UPDATE exam_sessions SET last_heartbeat = NOW() WHERE id = ?",
            [sessionId],
            (err2) => {
                if (err2) console.error("❌ Update heartbeat error:", err2);
            }
        );

        // Kiểm tra session có bị kick không
        if (!session.is_active || session.is_forced_end) {
            return res.json({
                success: true,
                valid: false,
                kicked: true,
                message: "Session đã bị đăng xuất do có phiên thi khác"
            });
        }

        res.json({
            success: true,
            valid: true,
            message: "Session đang hoạt động"
        });
    });
});

// ========================
// 🚨 LOG VIOLATION - Ghi nhận vi phạm
// ========================
router.post("/violation", (req, res) => {
    const {
        sessionId,
        userId,
        examId,
        violationType,
        detail
    } = req.body;

    if (!sessionId || !userId || !examId || !violationType) {
        return res.status(400).json({ 
            success: false, 
            message: "Thiếu thông tin bắt buộc" 
        });
    }

    const sql = `
        INSERT INTO exam_violations (
            session_id, user_id, exam_id, violation_type, detail
        ) VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
        sql,
        [sessionId, userId, examId, violationType, detail],
        (err, result) => {
            if (err) {
                console.error("❌ Log violation error:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Không thể ghi log" 
                });
            }

            console.log(`⚠️ Violation logged: ${violationType} - ${detail}`);

            // Kiểm tra số lần vi phạm
            const checkSql = `
                SELECT COUNT(*) as count, s.max_violations
                FROM exam_violations v
                JOIN exam_sessions s ON v.session_id = s.id
                WHERE v.session_id = ?
                GROUP BY s.max_violations
            `;

            db.query(checkSql, [sessionId], (err2, results) => {
                if (err2) {
                    console.error("❌ Check violations error:", err2);
                    return res.json({ success: true, forceEnd: false });
                }

                const count = results[0]?.count || 0;
                const maxViolations = results[0]?.max_violations || 3;

                if (count >= maxViolations) {
                    console.log("🚫 Max violations reached, force end session");
                    
                    // Đánh dấu session kết thúc
                    db.query(
                        `UPDATE exam_sessions 
                         SET is_active = FALSE, end_time = NOW(), is_forced_end = TRUE
                         WHERE id = ?`,
                        [sessionId],
                        (err3) => {
                            if (err3) console.error("❌ Force end error:", err3);
                        }
                    );

                    return res.json({
                        success: true,
                        forceEnd: true,
                        message: "Đã vi phạm quá số lần cho phép"
                    });
                }

                res.json({
                    success: true,
                    forceEnd: false,
                    violationCount: count,
                    maxViolations
                });
            });
        }
    );
});

// ========================
// 📊 SUBMIT EXAM - Nộp bài thi
// ========================
router.post("/submit", (req, res) => {
    const {
        sessionId,
        userId,
        examId,
        answers, // { questionId: answerId }
        isForced = false
    } = req.body;

    if (!sessionId || !userId || !examId) {
        return res.status(400).json({ 
            success: false, 
            message: "Thiếu thông tin bắt buộc" 
        });
    }

    // Lấy thông tin đề thi và câu hỏi
    const examSql = `
        SELECT q.id as question_id, q.points, a.id as answer_id, a.is_correct
        FROM questions q
        LEFT JOIN answers a ON q.id = a.question_id
        WHERE q.exam_id = ?
    `;

    db.query(examSql, [examId], (err, examData) => {
        if (err) {
            console.error("❌ Get exam data error:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Lỗi lấy dữ liệu đề thi" 
            });
        }

        // Tính điểm
        let score = 0;
        let totalPoints = 0;
        let correct = 0;
        let wrong = 0;
        let unanswered = 0;

        // Group theo question
        const questionMap = {};
        examData.forEach(row => {
            if (!questionMap[row.question_id]) {
                questionMap[row.question_id] = {
                    points: row.points,
                    correctAnswer: null,
                    answers: []
                };
            }
            if (row.is_correct) {
                questionMap[row.question_id].correctAnswer = row.answer_id;
            }
            questionMap[row.question_id].answers.push(row.answer_id);
        });

        // Tính điểm từng câu
        Object.keys(questionMap).forEach(qid => {
            const q = questionMap[qid];
            totalPoints += q.points;

            const userAnswer = answers[qid];
            
            if (!userAnswer) {
                unanswered++;
            } else if (userAnswer == q.correctAnswer) {
                score += q.points;
                correct++;
            } else {
                wrong++;
            }
        });

        // Lấy thống kê vi phạm
        const violationSql = `
            SELECT violation_type, COUNT(*) as count
            FROM exam_violations
            WHERE session_id = ?
            GROUP BY violation_type
        `;

        db.query(violationSql, [sessionId], (err2, violations) => {
            if (err2) {
                console.error("❌ Get violations error:", err2);
            }

            const violationDetails = {};
            let totalViolations = 0;
            
            (violations || []).forEach(v => {
                violationDetails[v.violation_type] = v.count;
                totalViolations += v.count;
            });

            // Lưu kết quả
            const resultSql = `
                INSERT INTO exam_results (
                    session_id, user_id, exam_id,
                    score, total_points,
                    total_questions, correct_answers, wrong_answers, unanswered,
                    user_answers, total_violations, violation_details,
                    start_time, time_taken, is_forced_submit
                )
                SELECT 
                    ?, ?, ?,
                    ?, ?,
                    ?, ?, ?, ?,
                    ?, ?, ?,
                    start_time,
                    TIMESTAMPDIFF(SECOND, start_time, NOW()),
                    ?
                FROM exam_sessions WHERE id = ?
            `;

            db.query(
                resultSql,
                [
                    sessionId, userId, examId,
                    score, totalPoints,
                    Object.keys(questionMap).length, correct, wrong, unanswered,
                    JSON.stringify(answers),
                    totalViolations,
                    JSON.stringify(violationDetails),
                    isForced,
                    sessionId
                ],
                (err3, result) => {
                    if (err3) {
                        console.error("❌ Save result error:", err3);
                        return res.status(500).json({ 
                            success: false, 
                            message: "Không thể lưu kết quả" 
                        });
                    }

                    // Đóng session
                    db.query(
                        `UPDATE exam_sessions 
                         SET is_active = FALSE, end_time = NOW()
                         WHERE id = ?`,
                        [sessionId],
                        (err4) => {
                            if (err4) console.error("❌ Close session error:", err4);
                        }
                    );

                    console.log("✅ Exam submitted successfully");

                    res.json({
                        success: true,
                        result: {
                            score,
                            totalPoints,
                            percentage: ((score / totalPoints) * 100).toFixed(2),
                            correct,
                            wrong,
                            unanswered,
                            totalQuestions: Object.keys(questionMap).length,
                            violations: violationDetails,
                            totalViolations
                        }
                    });
                }
            );
        });
    });
});

// ========================
// 📈 GET RESULT - Lấy kết quả thi
// ========================
router.get("/result/:sessionId", (req, res) => {
    const { sessionId } = req.params;

    const sql = `
        SELECT 
            r.*,
            u.username,
            u.full_name,
            e.title as exam_title,
            s.start_time,
            s.end_time
        FROM exam_results r
        JOIN users u ON r.user_id = u.id
        JOIN exams e ON r.exam_id = e.id
        JOIN exam_sessions s ON r.session_id = s.id
        WHERE r.session_id = ?
    `;

    db.query(sql, [sessionId], (err, results) => {
        if (err) {
            console.error("❌ Get result error:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Lỗi lấy kết quả" 
            });
        }

        if (results.length === 0) {
            return res.status(404).json({ 
                success: false, 
                message: "Không tìm thấy kết quả" 
            });
        }

        res.json({
            success: true,
            data: results[0]
        });
    });
});

// ========================
// 📊 GET USER RESULTS - Lấy tất cả kết quả của user
// ========================
router.get("/results/user/:userId", (req, res) => {
    const { userId } = req.params;

    const sql = `
        SELECT 
            r.id,
            r.score,
            r.total_points,
            r.submit_time,
            r.time_taken,
            r.total_violations,
            e.title as exam_title,
            e.duration
        FROM exam_results r
        JOIN exams e ON r.exam_id = e.id
        WHERE r.user_id = ?
        ORDER BY r.submit_time DESC
    `;

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("❌ Get user results error:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Lỗi lấy kết quả" 
            });
        }

        res.json({
            success: true,
            total: results.length,
            data: results
        });
    });
});

export default router;