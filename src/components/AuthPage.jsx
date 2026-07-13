import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import API from '../api/axiosInstance';

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Register views
  
  // Form States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { name, email, password, role } = formData;

  // Automatically toggle form view mode based on what button was clicked on the landing page
  useEffect(() => {
    const mode = searchParams.get('mode');
    if (mode === 'register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [searchParams]);

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  // Explicit helper to handle custom card-button role selections
  const handleRoleSelect = (selectedRole) => {
    setFormData({ ...formData, role: selectedRole });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Select the correct endpoint based on current view mode
    const endpoint = isLogin ? '/auth/login' : '/auth/register';

    try {
      const res = await API.post(endpoint, isLogin ? { email, password } : formData);
      setSuccess(res.data.msg || (isLogin ? 'Login successful!' : 'Registration successful!'));
      
      // 1. Save secure token to browser storage
      localStorage.setItem('token', res.data.token);
      
      // 2. Redirect based on the user role returned from your database
      setTimeout(() => {
        if (isLogin) {
          const userRole = res.data.role;
          
          // 🚀 FIXED: Explicit routing logic block for all roles
          if (userRole === 'hr') {
            navigate('/hr-dashboard');
          } else if (userRole === 'professional') {
            navigate('/professional-dashboard'); 
          } else {
            navigate('/student-dashboard');
          }
        } else {
          // If they just registered, flip them to the login screen view mode
          setIsLogin(true);
          setSuccess('Account created! Please log in.');
        }
      }, 1500);

    } catch (err) {
      setError(err.response?.data?.msg || 'Authentication failed. Please check your entries.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
      
      {/* Platform Branding Logo */}
      <div className="h-12 w-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-4 shadow-md shadow-indigo-600/10">
        ✨
      </div>
      
      <h2 className="text-3xl font-bold text-slate-800 tracking-tight">
        {isLogin ? 'Welcome Back' : 'Create Account'}
      </h2>
      <p className="text-slate-500 text-sm mb-8 mt-1.5">
        {isLogin ? 'Sign in to access your platform workspace' : 'Join our platform to get started'}
      </p>

      {/* Main Authentication Card Container */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm w-full max-w-md space-y-5">
        
        {error && (
          <div className="text-sm font-medium text-rose-600 bg-rose-50 p-3.5 rounded-xl border border-rose-100">
            {error}
          </div>
        )}
        {success && (
          <div className="text-sm font-medium text-emerald-600 bg-emerald-50 p-3.5 rounded-xl border border-emerald-100">
            {success}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">Full Name</label>
              <input 
                type="text" 
                name="name"
                value={name}
                onChange={onChange}
                placeholder="Enter your name" 
                required
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
              />
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Enter your email" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Enter your password" 
              required
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>

          {/* New Interactive Role Option Selector Layout */}
          {!isLogin && (
            <div className="space-y-2.5 pt-1">
              <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider block">Select Your Role</label>
              
              {[
                { id: 'student', label: 'Student' },
                { id: 'professional', label: 'Professional' },
                { id: 'hr', label: 'HR Recruiter' }
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleRoleSelect(item.id)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                    role === item.id
                      ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-semibold shadow-sm shadow-indigo-600/5'
                      : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                  }`}
                >
                  <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                    role === item.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                  }`}>
                    {role === item.id && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                  </div>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}

          <button 
            type="submit" 
            className="w-full py-3.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2 pt-3"
          >
            {isLogin ? 'Sign In' : 'Register'}
          </button>
        </form>

        <p className="text-center text-slate-500 text-sm pt-2">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(''); setSuccess(''); }} 
            className="text-indigo-600 cursor-pointer font-bold hover:text-indigo-700 transition-all"
          >
            {isLogin ? 'Register here' : 'Login here'}
          </span>
        </p>
        
      </div>
    </div>
  );
};

export default AuthPage;