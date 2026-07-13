import logo from './logo.svg';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/landingpage';
import AuthPage from './components/AuthPage'; 
import { StudentDashboard } from './components/StudentDashboard';
import { ProfilePage } from './components/ProfilePage';
import { AssessmentPage } from './components/AssessmentPage';
import { HRDashboard } from './components/HRDashboard';
import { CreateJobPage } from './components/CreateJobPage';
import { ProfessionalDashboard } from './components/ProfessionalDashboard';
import { ChatbotPage } from './components/ChatbotPage';

// 🌟 ADDED IMPORT: Bring in the new global persistent layout framework
import { MainLayout } from './components/MainLayout';

import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full">
        <Routes>
          {/* Public Pages Gateway (No sidebars here) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
          
          {/* 🌟 PERSISTENT SIDEBAR PAGES (Wrapped securely inside MainLayout) */}
          <Route path="/student-dashboard" element={<MainLayout><StudentDashboard /></MainLayout>} />
          <Route path="/professional-dashboard" element={<MainLayout><ProfessionalDashboard /></MainLayout>} />
          <Route path="/profile" element={<MainLayout><ProfilePage /></MainLayout>} />
          <Route path="/assessment" element={<MainLayout><AssessmentPage /></MainLayout>} />
          <Route path="/chatbot" element={<MainLayout><ChatbotPage /></MainLayout>} />
          
          {/* HR Routes (Kept completely separate from student/professional pipelines) */}
<Route path="/hr-dashboard" element={<MainLayout><HRDashboard /></MainLayout>} />
<Route path="/create-job" element={<MainLayout><CreateJobPage /></MainLayout>} />
          
          {/* Fallback - Catches broken links and returns safely to Landing */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;