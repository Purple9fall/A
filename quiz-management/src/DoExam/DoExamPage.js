// import React, { useEffect, useState } from "react";
// import Navbar from "../Navbar/Navbar";
// import "./DoExamPage.css";

// const DoExamPage = ({
//   examId,
//   onNavigateHome,
//   onShowTeachers,
//   onShowStudents,
//   onShowExamBank,
//   onShowCreateExam,
// }) => {
//   const [examInfo, setExamInfo] = useState(null);
//   const [questions, setQuestions] = useState([]);
//   const [answers, setAnswers] = useState({});
//   const [submitted, setSubmitted] = useState(false);
//   const [score, setScore] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchExam = async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(`http://localhost:5000/api/exams/${examId}`);

//         if (!res.ok) throw new Error("Không tìm thấy đề thi");

//         const data = await res.json();
//         console.log("📥 Data:", data);

//         setExamInfo(data.exam || {});

//         // Tạo cấu trúc câu hỏi + answers
//         const qWithAnswers = (data.questions || []).map((q) => ({
//           ...q,
//           answers: data.answers
//             ? data.answers.filter((a) => a.question_id === q.id)
//             : [],
//         }));

//         setQuestions(qWithAnswers);
//       } catch (err) {
//         console.error("❌ Error:", err);
//         setExamInfo(null);
//         setQuestions([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExam();
//   }, [examId]);

//   const handleSelect = (qid, value) => {
//     if (submitted) return;
//     setAnswers((prev) => ({ ...prev, [qid]: value }));
//   };

//   const handleSubmit = () => {
//     let totalPoints = 0;

//     questions.forEach((q) => {
//       const selected = answers[q.id]; // id đáp án học sinh chọn
//       const correctAnswer = q.answers.find((a) => a.is_correct)?.id; // id đáp án đúng

//       if (selected === correctAnswer) {
//         totalPoints += q.points;
//       }
//     });

//     setScore(totalPoints);
//     setSubmitted(true);
//   };

//   if (loading) return <div className="do-exam-page">Đang tải đề thi...</div>;
//   if (!examInfo) return <div className="do-exam-page">Không tìm thấy đề thi</div>;

//   return (
//     <div className="do-exam-page">
//       <Navbar
//         onNavigateHome={onNavigateHome}
//         onShowTeachers={onShowTeachers}
//         onShowStudents={onShowStudents}
//         onShowExamBank={onShowExamBank}
//         onShowCreateExam={onShowCreateExam}
//       />

//       <div className="do-exam-container">
//         <h1 className="exam-title">{examInfo.title}</h1>
//         <p className="exam-time">{examInfo.duration} phút</p>

//         <div className="question-list">
//           {questions.map((q, index) => (
//             <div className="question-card" key={q.id}>
//               <p className="question-text">
//                 <strong>Câu {index + 1}:</strong> {q.question_text} ({q.points} điểm)
//               </p>

//               <div className="choices">
//                 {q.answers.length > 0 ? (
//                   q.answers.map((a) => (
//                     <label
//                       className={`choice-item ${submitted && a.is_correct ? "correct" : ""}`}
//                       key={a.id}
//                     >
//                       <input
//                         type="radio"
//                         name={`q-${q.id}`}
//                         value={a.id}
//                         checked={answers[q.id] === a.id}
//                         onChange={() => handleSelect(q.id, a.id)}
//                         disabled={submitted}
//                       />
//                       <span>{a.answer_text}</span>
//                     </label>
//                   ))
//                 ) : (
//                   <p>❌ Chưa có đáp án cho câu hỏi này</p>
//                 )}
//               </div>

//               {submitted && q.answers.length > 0 && (
//                 <p className="correct-answer">
//                   ✅ Đáp án đúng:{" "}
//                   {q.answers.find((a) => a.is_correct)?.answer_text || "Chưa có"}
//                 </p>
//               )}
//             </div>
//           ))}
//         </div>

//         {!submitted ? (
//           <button className="submit-btn" onClick={handleSubmit}>
//             Nộp bài
//           </button>
//         ) : (
//           <div className="score">
//             <h2>
//               🎉 Bài thi đã nộp! Điểm: {score} /{" "}
//               {questions.reduce((sum, q) => sum + q.points, 0)}
//             </h2>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DoExamPage;


import React, { useEffect, useState } from "react";
import Navbar from "../Navbar/Navbar";
import "./DoExamPage.css";

const DoExamPage = ({
  examId,
  onNavigateHome,
  onShowTeachers,
  onShowStudents,
  onShowExamBank,
  onShowCreateExam,
}) => {
  const [examInfo, setExamInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5000/api/exams/${examId}`);

        if (!res.ok) throw new Error("Không tìm thấy đề thi");

        const data = await res.json();
        setExamInfo(data.exam || {});

        const qWithAns = (data.questions || []).map((q) => ({
          ...q,
          answers: data.answers
            ? data.answers.filter((a) => a.question_id === q.id)
            : [],
        }));

        setQuestions(qWithAns);

        setTimeLeft((data.exam.duration || 0) * 60);
      } catch (err) {
        console.error("❌ Error:", err);
        setExamInfo(null);
        setQuestions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (submitted || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, submitted]);

  const handleSelect = (qid, value) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleSubmit = () => {
    if (submitted) return;

    let total = 0;

    questions.forEach((q) => {
      const selected = answers[q.id];
      const correct = q.answers.find((a) => a.is_correct)?.id;

      if (selected === correct) total += q.points;
    });

    setScore(total);
    setSubmitted(true);
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60)
      .toString()
      .padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  if (loading) return <div className="do-exam-page">Đang tải đề thi...</div>;
  if (!examInfo) return <div className="do-exam-page">Không tìm thấy đề thi</div>;

  return (
    <div className="do-exam-page">
      <Navbar
        onNavigateHome={onNavigateHome}
        onShowTeachers={onShowTeachers}
        onShowStudents={onShowStudents}
        onShowExamBank={onShowExamBank}
        onShowCreateExam={onShowCreateExam}
      />

      {/* ✅ Đồng hồ cố định góc phải */}
      <div className={`timer-floating ${timeLeft <= 30 && timeLeft > 0 ? 'timer-urgent' : ''}`}>
        ⏳ {formatTime(timeLeft)}
      </div>

      <div className="do-exam-container">
        <h1 className="exam-title">{examInfo.title}</h1>

        {/* ❌ XÓA dòng thời gian cũ trong nội dung */}
        {/* <p className="exam-time">Thời gian còn lại: ...</p> */}

        <div className="question-list">
          {questions.map((q, index) => (
            <div className="question-card" key={q.id}>
              <p className="question-text">
                <strong>Câu {index + 1}:</strong> {q.question_text} ({q.points} điểm)
              </p>

              <div className="choices">
                {q.answers.length > 0 ? (
                  q.answers.map((a) => (
                    <label
                      className={`choice-item ${
                        submitted && a.is_correct ? "correct" : ""
                      }`}
                      key={a.id}
                    >
                      <input
                        type="radio"
                        name={`q-${q.id}`}
                        value={a.id}
                        checked={answers[q.id] === a.id}
                        onChange={() => handleSelect(q.id, a.id)}
                        disabled={submitted}
                      />
                      <span>{a.answer_text}</span>
                    </label>
                  ))
                ) : (
                  <p>❌ Chưa có đáp án</p>
                )}
              </div>

              {submitted && (
                <p className="correct-answer">
                  ✅ Đáp án đúng:{" "}
                  {q.answers.find((a) => a.is_correct)?.answer_text || "Không có"}
                </p>
              )}
            </div>
          ))}
        </div>

        {!submitted ? (
          <button className="submit-btn" onClick={handleSubmit}>
            Nộp bài
          </button>
        ) : (
          <div className="score">
            <h2>
              🎉 Điểm: {score} / {questions.reduce((s, q) => s + q.points, 0)}
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoExamPage;


