// src/App.tsx

import { Routes, Route, Link, NavLink } from 'react-router-dom';
import Home from './pages/Home';
import CreateExam from './pages/CreateExam';
import AddStudents from './pages/AddStudents';
import ExamSession from './pages/ExamSession';
import HistoryList from './pages/HistoryList';
import HistoryDetail from './pages/HistoryDetail';
import './App.css'; 

function App() {
  return (
    <>
      <nav className="main-nav">
        <Link to="/" className="nav-brand">
          Eksaminationsapp
        </Link>
        <div className="nav-links">
          <NavLink to="/">Hjem</NavLink>
          <NavLink to="/create-exam">Opret Ny Eksamen</NavLink>
          <NavLink to="/history">Se Historik</NavLink>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-exam" element={<CreateExam />} />
          <Route path="/exam/:examId/add-students" element={<AddStudents />} />
          <Route path="/exam/:examId/session" element={<ExamSession />} />
          
          <Route path="/history" element={<HistoryList />} />

          <Route path="/history/:examId" element={<HistoryDetail />} />
          <Route path="*" element={<h2>Siden blev ikke fundet (404)</h2>} />
        </Routes>
      </main>
    </>
  );
}

export default App;