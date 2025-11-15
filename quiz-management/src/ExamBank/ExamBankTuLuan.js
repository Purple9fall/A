import React from "react";
import Navbar from "../Navbar/Navbar";
import "./ExamBank.css";
import { LuClock3, LuUsers, LuMessageSquare } from "react-icons/lu";

const exams = [
  { id: 1, title: "IELTS Writing Task 1 - Bar Chart", duration: 60, attempts: 924512, comments: 1250, parts: 1, questions: 1, tags: ["IELTS Academic", "Writing Task 1"] },
  { id: 2, title: "IELTS Writing Task 2 - Opinion Essay", duration: 60, attempts: 851734, comments: 980, parts: 1, questions: 1, tags: ["IELTS Academic", "Writing Task 2"] },
  { id: 3, title: "Essay: Environmental Pollution", duration: 45, attempts: 562340, comments: 620, parts: 1, questions: 1, tags: ["Essay", "Environment"] },
  { id: 4, title: "Short Response: History - WW2 Causes", duration: 30, attempts: 347829, comments: 412, parts: 1, questions: 1, tags: ["History", "Short Answer"] },
  { id: 5, title: "Essay: The Importance of Reading", duration: 45, attempts: 298472, comments: 365, parts: 1, questions: 1, tags: ["Essay", "Literature"] },
];

const ExamBankTuLuan = ({
  onNavigateHome,
  onShowTeachers,
  onShowStudents,
  onShowExamBank,
  onShowCreateExam,
}) => {
  const handleDetail = (exam) => {
    alert(`Mở chi tiết: ${exam.title}`);
  };

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
        <h1 className="exam-bank-title">Ngân hàng đề – Trả lời ngắn</h1>

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

export default ExamBankTuLuan;
