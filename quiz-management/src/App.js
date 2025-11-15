import React, { useState } from "react";
import LoginPage from "./Login/LoginPage";
import RegisterPage from "./Register/RegisterPage";
import HomePage from "./Home/HomePage";
import IntroducePage from "./Introduce/IntroducePage";
import TeacherList from "./List/TeacherList";
import StudentList from "./List/StudentList";
import ExamBankTracNghiem from "./ExamBank/ExamBankTracNghiem";
import ExamBankTuLuan from "./ExamBank/ExamBankTuLuan"; // nếu bạn đã tạo
import CreateExamTracNghiem from "./CreateExam/CreateExamTracNghiem";

function App() {
  const [currentPage, setCurrentPage] = useState("login"); // login | register | home | introduce | teacherList
  const [userEmail, setUserEmail] = useState("");

  const handleLoginSuccess = (email) => {
    setUserEmail(email);
    setCurrentPage("home"); // chuyển qua trang chủ
  };

  const handleSwitchToRegister = () => {
    setCurrentPage("register");
  };

  const handleSwitchToLogin = () => {
    setCurrentPage("login");
  };

  const handleLogout = () => {
    setUserEmail("");
    setCurrentPage("login");
  };

  const handleStartIntroduce = () => {
    setCurrentPage("introduce");
  };

  const handleBackToHome = () => {
    setCurrentPage("home");
  };

  const handleShowTeachers = () => {
    setCurrentPage("teacherList");
  }

  const handleShowStudents = () => {
    setCurrentPage("studentList");
  }

  const handleShowExamBank = (type) => {
  if (type === "tracnghiem") setCurrentPage("examBankTracNghiem");
  else if (type === "tuluan") setCurrentPage("examBankTuLuan");
  };

  const handleShowCreateExam = (type) => {
  if (type === "tracnghiem") setCurrentPage("createExamTracNghiem");
  else if (type === "tuluan") setCurrentPage("createExamTuLuan");
  };

  return (
    <div>
      {currentPage === "login" && (
        <LoginPage
          onSwitch={handleSwitchToRegister}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {currentPage === "register" && (
        <RegisterPage onSwitch={handleSwitchToLogin} />
      )}

      {currentPage === "home" && (
        <HomePage
          email={userEmail}
          onLogout={handleLogout}
          onStartIntroduce={handleStartIntroduce}
          onShowTeachers={handleShowTeachers}
          onShowStudents={handleShowStudents} 
          onNavigateHome={handleBackToHome}
          onShowExamBank={handleShowExamBank} 
          onShowCreateExam={handleShowCreateExam}
        />
      )}

      {currentPage === "introduce" && (
        <IntroducePage onBack={handleBackToHome} />
      )}

      {currentPage === "teacherList" && (

        <TeacherList 
          onNavigateHome={handleBackToHome} 
          onShowTeachers={handleShowTeachers}     
          onShowStudents={handleShowStudents}
          onShowExamBank={handleShowExamBank}
          onShowCreateExam={handleShowCreateExam}
        /> 
      )}

      {currentPage === "studentList" && (
        <StudentList 
          onNavigateHome={handleBackToHome}
          onShowTeachers={handleShowTeachers}     
          onShowStudents={handleShowStudents}
          onShowExamBank={handleShowExamBank} 
          onShowCreateExam={handleShowCreateExam}
        /> 
      )}

      {currentPage === "examBankTracNghiem" && (
        <ExamBankTracNghiem
          onNavigateHome={handleBackToHome}
          onShowTeachers={handleShowTeachers}
          onShowStudents={handleShowStudents}
          onShowExamBank={handleShowExamBank}
          onShowCreateExam={handleShowCreateExam}
        />
      )}

      {currentPage === "examBankTuLuan" && (
        <ExamBankTuLuan
          onNavigateHome={handleBackToHome}
          onShowTeachers={handleShowTeachers}
          onShowStudents={handleShowStudents}
          onShowExamBank={handleShowExamBank}
          onShowCreateExam={handleShowCreateExam}
        />
      )}


      {currentPage === "createExamTracNghiem" && (
        <CreateExamTracNghiem
          onNavigateHome={handleBackToHome}
          onShowTeachers={handleShowTeachers}
          onShowStudents={handleShowStudents}
          onShowExamBank={handleShowExamBank}
          onShowCreateExam={handleShowCreateExam}
        />
      )}

      {/* {currentPage === "createExamTuLuan" && (
        <CreateExamTuLuan
          onNavigateHome={handleBackToHome}
          onShowTeachers={handleShowTeachers}
          onShowStudents={handleShowStudents}
          onShowExamBank={handleShowExamBank}
        />
      )} */}


    </div>
  );
}

export default App;


