// //import React from "react";
// import React, { useState, useEffect } from "react";
// import Navbar from "../Navbar/Navbar";
// import "./ExamBank.css";
// import { LuClock3, LuUsers, LuMessageSquare } from "react-icons/lu";

// // const exams = [
// //   { id: 1, title: "IELTS Simulation Listening test 1", duration: 40, attempts: 1299534, comments: 3406, parts: 4, questions: 40, tags: ["IELTS Academic", "Listening"] },
// //   { id: 2, title: "IELTS Simulation Reading test 1",   duration: 60, attempts: 678612,  comments: 1462, parts: 3, questions: 40, tags: ["IELTS Academic", "Reading"] },
// //   { id: 3, title: "IELTS Simulation Listening test 2", duration: 40, attempts: 542871,  comments: 980,  parts: 4, questions: 40, tags: ["IELTS Academic", "Listening"] },
// //   { id: 4, title: "IELTS Simulation Reading test 2",   duration: 60, attempts: 297249,  comments: 879,  parts: 3, questions: 40, tags: ["IELTS Academic", "Reading"] },
// //   { id: 5, title: "IELTS Simulation Listening test 3", duration: 40, attempts: 355290,  comments: 576,  parts: 4, questions: 40, tags: ["IELTS Academic", "Listening"] },
// //   { id: 6, title: "IELTS Simulation Reading test 3",   duration: 60, attempts: 222363,  comments: 590,  parts: 3, questions: 40, tags: ["IELTS Academic", "Reading"] },
// //   { id: 7, title: "IELTS Simulation Listening test 4", duration: 40, attempts: 276750,  comments: 497,  parts: 4, questions: 40, tags: ["IELTS Academic", "Listening"] },
// //   { id: 8, title: "IELTS Simulation Reading test 4",   duration: 60, attempts: 154749,  comments: 367,  parts: 3, questions: 40, tags: ["IELTS Academic", "Reading"] },
// // ];

  

// const ExamBankTracNghiem = ({
//   onNavigateHome,
//   onShowTeachers,
//   onShowStudents,
//   onShowExamBank,
//   onShowCreateExam,
// }) => {


//   const [exams, setExams] = useState([]); // ✅ useState phải bên trong component

//   useEffect(() => { // ✅ useEffect cũng phải bên trong component
//     fetch("http://localhost:5000/api/exams")
//       .then(res => res.json())
//       .then(data => setExams(data))
//       .catch(err => console.error("Lỗi khi lấy danh sách đề:", err));
//   }, []);

//   const handleDetail = (exam) => {
//     // TODO: mở modal/đi tới trang chi tiết đề
//     alert(`Mở chi tiết: ${exam.title}`);
//   };



//   return (
//     <div className="exam-bank-page">
//       {/* Giữ navbar để có thể nhảy sang mục khác */}
//       <Navbar
//         onNavigateHome={onNavigateHome}
//         onShowTeachers={onShowTeachers}
//         onShowStudents={onShowStudents}
//         onShowExamBank={onShowExamBank}
//         onShowCreateExam={onShowCreateExam}
//       />

//       <div className="exam-bank-container">
//         <h1 className="exam-bank-title">Ngân hàng đề – Trắc nghiệm</h1>

//         <div className="exam-grid">
//           {exams.map((e) => (
//             <div key={e.id} className="exam-card">
//               <div className="exam-card-body">
//                 <h3 className="exam-title">{e.title}</h3>

//                 <div className="exam-meta-row">
//                   <span className="exam-meta">
//                     <LuClock3 /> {e.duration} phút
//                   </span>
//                   <span className="exam-sep">|</span>
//                   <span className="exam-meta">
//                     <LuUsers /> {e.attempts.toLocaleString()}
//                   </span>
//                   <span className="exam-sep">|</span>
//                   <span className="exam-meta">
//                     <LuMessageSquare /> {e.comments.toLocaleString()}
//                   </span>
//                 </div>

//                 <p className="exam-sub">
//                   {e.parts} phần thi | {e.questions} câu hỏi
//                 </p>

//                 <div className="exam-tags">
//                   {e.tags.map((t, i) => (
//                     <span key={i} className="exam-tag">#{t}</span>
//                   ))}
//                 </div>
//               </div>

//               <div className="exam-card-footer">
//                 <button className="exam-detail-btn" onClick={() => handleDetail(e)}>
//                   Chi tiết
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ExamBankTracNghiem;


import React, { useState, useEffect } from "react";
import Navbar from "../Navbar/Navbar";
import "./ExamBank.css";
import { LuClock3, LuUsers, LuMessageSquare } from "react-icons/lu";

const ExamBankTracNghiem = ({
  onNavigateHome,
  onShowTeachers,
  onShowStudents,
  onShowExamBank,
  onShowCreateExam,
}) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
        console.log("🌐 Fetching from:", apiUrl);

        const res = await fetch(`${apiUrl}/api/exams`);
        
        console.log("📥 GET Response status:", res.status);

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }

        const result = await res.json();
        console.log("📥 GET Response:", result);

        // Backend trả về: {message, total, data}
        const examsData = result.data || result;

        // Parse tags nếu cần
        const parsed = examsData.map((exam) => ({
          ...exam,
          tags: typeof exam.tags === 'string' 
            ? exam.tags.split(',').filter(Boolean)  // ✅ Split string thành array
            : (Array.isArray(exam.tags) ? exam.tags : []),
          attempts: exam.attempts || 0,
          comments: exam.comments || 0,
        }));

        console.log("✅ Parsed exams:", parsed);
        setExams(parsed);
      } catch (err) {
        console.error("❌ Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleDetail = (exam) => {
    alert(`Mở chi tiết: ${exam.title}`);
  };

  if (loading) return <div className="exam-bank-page">Đang tải danh sách đề...</div>;
  if (error) return <div className="exam-bank-page">Lỗi: {error}</div>;

  return (
    <div className="exam-bank-page">
      <Navbar
        onNavigateHome={onNavigateHome}
        onShowTeachers={onShowTeachers}
        onShowStudents={onShowStudents}
        onShowExamBank={onShowExamBank}
        onShowCreateExam={onShowCreateExam}
      />

      <div className="exam-bank-container">
        <h1 className="exam-bank-title">Ngân hàng đề – Trắc nghiệm</h1>

        <div className="exam-grid">
          {exams.map((e) => (
            <div key={e.id} className="exam-card">
              <div className="exam-card-body">
                <h3 className="exam-title">{e.title}</h3>

                <div className="exam-meta-row">
                  <span className="exam-meta">
                    <LuClock3 /> {e.duration} phút
                  </span>
                  <span className="exam-sep">|</span>
                  <span className="exam-meta">
                    <LuUsers /> {e.attempts.toLocaleString()}
                  </span>
                  <span className="exam-sep">|</span>
                  <span className="exam-meta">
                    <LuMessageSquare /> {e.comments.toLocaleString()}
                  </span>
                </div>

                <p className="exam-sub">
                  {e.parts} phần thi | {e.questions} câu hỏi
                </p>

                <div className="exam-tags">
                  {e.tags.map((t, i) => (
                    <span key={i} className="exam-tag">#{t}</span>
                  ))}
                </div>
              </div>

              <div className="exam-card-footer">
                <button className="exam-detail-btn" onClick={() => handleDetail(e)}>
                  Chi tiết
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamBankTracNghiem;
