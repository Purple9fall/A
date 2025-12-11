// import React, { useState, useEffect } from "react";
// import Navbar from "../Navbar/Navbar";
// import "./ExamBank.css";
// import { LuClock3, LuUsers, LuMessageSquare } from "react-icons/lu";

// const ExamBankTracNghiem = ({
//   onNavigateHome,
//   onShowTeachers,
//   onShowStudents,
//   onShowExamBank,
//   onShowCreateExam,
//   onDoExam,
// }) => {
//   const [exams, setExams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchExams = async () => {
//       try {
//         const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
//         console.log("🌐 Fetching from:", apiUrl);

//         const res = await fetch(`${apiUrl}/api/exams`);
        
//         console.log("📥 GET Response status:", res.status);

//         if (!res.ok) {
//           throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//         }

//         const result = await res.json();
//         console.log("📥 GET Response:", result);

//         // Backend trả về: {message, total, data}
//         const examsData = result.data || result;

//         // Parse tags nếu cần
//         const parsed = examsData.map((exam) => ({
//           ...exam,
//           tags: typeof exam.tags === 'string' 
//             ? exam.tags.split(',').filter(Boolean)  // ✅ Split string thành array
//             : (Array.isArray(exam.tags) ? exam.tags : []),
//           attempts: exam.attempts || 0,
//           comments: exam.comments || 0,
//         }));

//         console.log("✅ Parsed exams:", parsed);
//         setExams(parsed);
//       } catch (err) {
//         console.error("❌ Fetch error:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExams();
//   }, []);

//   // const handleDetail = (exam) => {
//   //   alert(`Mở chi tiết: ${exam.title}`);
//   // };

//   const handleDetail = (exam) => {
//   console.log("User bấm vào đề:", exam);
//   onDoExam(exam.id);
//   };  

//   if (loading) return <div className="exam-bank-page">Đang tải danh sách đề...</div>;
//   if (error) return <div className="exam-bank-page">Lỗi: {error}</div>;

//   return (
//     <div className="exam-bank-page">
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


// import React, { useState, useEffect } from "react";
// import Navbar from "../Navbar/Navbar";
// import "./ExamBank.css";
// import { LuClock3, LuUsers, LuMessageSquare } from "react-icons/lu";

// const ExamBankTracNghiem = ({
//   onNavigateHome,
//   onShowTeachers,
//   onShowStudents,
//   onShowExamBank,
//   onShowCreateExam,
//   onDoExam,
// }) => {
//   const [exams, setExams] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Lấy role và token người dùng từ localStorage
//   const role = localStorage.getItem("role"); // admin / teacher / student
//   const token = localStorage.getItem("token"); // JWT

//   useEffect(() => {
//     const fetchExams = async () => {
//       try {
//         const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
//         const res = await fetch(`${apiUrl}/api/exams`);
//         if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
//         const result = await res.json();
//         const examsData = result.data || result;

//         // Chuyển tags từ string thành array
//         const parsed = examsData.map((exam) => ({
//           ...exam,
//           tags: typeof exam.tags === "string" ? exam.tags.split(",").filter(Boolean) : [],
//           attempts: exam.attempts || 0,
//           comments: exam.comments || 0,
//         }));

//         setExams(parsed);
//       } catch (err) {
//         console.error(err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchExams();
//   }, []);

//   // --- Xoá đề thi ---
//   const handleDelete = async (examId, title) => {
//     if (!window.confirm(`Bạn có chắc muốn xoá đề "${title}" không?`)) return;

//     try {
//       const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
//       const res = await fetch(`${apiUrl}/api/exams/${examId}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Lỗi server");

//       alert("✅ " + data.message);
//       setExams(exams.filter((e) => e.id !== examId));
//     } catch (err) {
//       console.error(err);
//       alert("❌ Lỗi: " + err.message);
//     }
//   };

//   // --- Chi tiết đề thi ---
//   const handleDetail = (exam) => {
//     onDoExam(exam.id);
//   };

//   if (loading) return <div className="exam-bank-page">Đang tải danh sách đề...</div>;
//   if (error) return <div className="exam-bank-page">Lỗi: {error}</div>;

//   return (
//     <div className="exam-bank-page">
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

//                 {(role === "admin" || role === "teacher") && (
//                   <button
//                     className="exam-delete-btn"
//                     onClick={() => handleDelete(e.id, e.title)}
//                   >
//                     🗑️ Xoá đề thi
//                   </button>
//                 )}
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
import { LuClock3, LuUsers, LuMessageSquare, LuTrash2 } from "react-icons/lu";

const ExamBankTracNghiem = ({
  onNavigateHome,
  onShowTeachers,
  onShowStudents,
  onShowExamBank,
  onShowCreateExam,
  onDoExam,
  currentUser, // object { id, username, role_name }
  token,       // JWT token
}) => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // =========================
  // Fetch danh sách đề thi
  // =========================
  const fetchExams = async () => {
    setLoading(true);
    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/exams`);
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const result = await res.json();
      const examsData = result.data || result;

      const parsed = examsData.map((exam) => ({
        ...exam,
        tags: typeof exam.tags === "string" ? exam.tags.split(",").filter(Boolean) : [],
        attempts: exam.attempts || 0,
        comments: exam.comments || 0,
      }));

      setExams(parsed);
    } catch (err) {
      console.error("❌ Fetch error:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  // =========================
  // Xem chi tiết bài thi
  // =========================
  const handleDetail = (exam) => {
    onDoExam(exam.id);
  };

  // =========================
  // Xóa đề thi
  // =========================
  const handleDelete = async (examId) => {
    if (!window.confirm("⚠️ Bạn có chắc muốn xóa đề thi này?")) return;

    try {
      const apiUrl = process.env.REACT_APP_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/api/exams/${examId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || `HTTP ${res.status}`);

      alert(`✅ ${data.message}`);
      fetchExams(); // Reload danh sách
    } catch (err) {
      console.error("❌ Delete error:", err);
      alert("❌ Lỗi khi xóa đề: " + err.message);
    }
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
                  <span className="exam-meta"><LuClock3 /> {e.duration} phút</span>
                  <span className="exam-sep">|</span>
                  <span className="exam-meta"><LuUsers /> {e.attempts.toLocaleString()}</span>
                  <span className="exam-sep">|</span>
                  <span className="exam-meta"><LuMessageSquare /> {e.comments.toLocaleString()}</span>
                </div>

                <p className="exam-sub">{e.parts} phần thi | {e.questions} câu hỏi</p>

                <div className="exam-tags">
                  {e.tags.map((t, i) => (<span key={i} className="exam-tag">#{t}</span>))}
                </div>
              </div>

              <div className="exam-card-footer">
                <button className="exam-detail-btn" onClick={() => handleDetail(e)}>
                  Chi tiết
                </button>

                {/* Nút Xóa chỉ hiển thị với Admin hoặc Teacher */}
                {(currentUser?.role_name === "admin" || currentUser?.role_name === "teacher") && (
                  <button
                    className="exam-delete-btn"
                    onClick={() => handleDelete(e.id)}
                    style={{ marginLeft: "10px", backgroundColor: "#E85A4F", color: "#fff" }}
                  >
                    <LuTrash2 /> Xóa
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExamBankTracNghiem;
