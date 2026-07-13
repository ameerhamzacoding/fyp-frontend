import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import API from '../api/axiosInstance';
import { LayoutDashboard, User, ClipboardList, MessageSquare, LogOut, PlusCircle } from 'lucide-react';

export function MainLayout({ children }) {
  const location = useLocation();
  const path = location.pathname;
  const [detectedRole, setDetectedRole] = useState('student');

  useEffect(() => {
    const checkRoleContext = async () => {
      try {
        const res = await API.get('/profile/me').catch(() => null);
        if (res && res.data && res.data.user && res.data.user.role) {
          setDetectedRole(res.data.user.role.toLowerCase());
        } else {
          const token = localStorage.getItem('token');
          if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            if (payload && payload.user && payload.user.role) {
              setDetectedRole(payload.user.role.toLowerCase());
            }
          }
        }
      } catch (err) {
        console.error("MainLayout role detection error:", err);
      }
    };
    checkRoleContext();
  }, [path]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/';
  };

  // Determine dashboard link based on role state or path variables
  const isHR = detectedRole === 'hr' || detectedRole === 'hr recruiter' || path.includes('hr') || path.includes('create-job');
  const isProfessional = detectedRole === 'professional' || path.includes('professional');

  let dashboardLink = '/student-dashboard';
  if (isHR) {
    dashboardLink = '/hr-dashboard';
  } else if (isProfessional) {
    dashboardLink = '/professional-dashboard';
  }

  const isDashboardActive = path.includes('dashboard') || path.includes('create-job');

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      
      {/* PERSISTENT GLOBAL SIDEBAR NAVIGATION */}
      <div className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col justify-between h-screen sticky top-0 shrink-0 select-none">
        <div className="space-y-8">
          <div className="flex items-center gap-3 px-1 py-2">
            <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-600/10 text-xl text-white font-bold">✨</div>
            <span className="font-bold text-slate-800 text-xl tracking-tight">Career Counselor</span>
          </div>

          <nav className="space-y-1">
            {/* Base Dashboard Link (Shared by all roles, routes dynamically) */}
            <Link 
              to={dashboardLink} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                isDashboardActive ? 'text-indigo-700 bg-indigo-50/50 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <LayoutDashboard className="h-5 w-5 shrink-0" /> <span>Dashboard</span>
            </Link>
            
            {/* 🌟 DYNAMIC LINK INJECTION BASED ON CURRENT ROLE */}
            {isHR ? (
              <>
                {/* HR RECRUITER MODULE NAVIGATION LINKS */}
                <Link 
                  to="/create-job" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    path === '/create-job' ? 'text-indigo-700 bg-indigo-50/50 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <PlusCircle className="h-5 w-5 shrink-0" /> <span>Create Job</span>
                </Link>
              </>
            ) : (
              <>
                {/* STUDENT & CANDIDATE MODULE NAVIGATION LINKS */}
                <Link 
                  to="/profile" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    path === '/profile' ? 'text-indigo-700 bg-indigo-50/50 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <User className="h-5 w-5 shrink-0" /> <span>Profile</span>
                </Link>
                
                <Link 
                  to="/assessment" 
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                    path === '/assessment' ? 'text-indigo-700 bg-indigo-50/50 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <ClipboardList className="h-5 w-5 shrink-0" /> <span>Career Assessment</span>
                </Link>
              </>
            )}

            {/* AI Chatbot Assistant Link (Shared by all roles) */}
            <Link 
              to="/chatbot" 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${
                path === '/chatbot' ? 'text-indigo-700 bg-indigo-50/50 font-semibold' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <MessageSquare className="h-5 w-5 shrink-0" /> <span>AI Assistant</span>
            </Link>
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 text-rose-600 hover:bg-rose-50 rounded-xl font-bold w-full mt-auto text-sm transition-all">
          <LogOut className="h-5 w-5 shrink-0" /> <span>Logout</span>
        </button>
      </div>

      {/* THE SUB-PAGES RENDER HERE DYNAMICALLY */}
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>

    </div>
  );
}