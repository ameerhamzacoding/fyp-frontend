import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { Save, X, GraduationCap, CheckSquare, Heart } from 'lucide-react';

export function ProfilePage() {
  const navigate = useNavigate();
  const [education, setEducation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [userRole, setUserRole] = useState('student'); // Secondary state factor tracking layout context redirection
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Static options mapped straight from your Figma canvas layout
  const skillOptions = [
    "JavaScript", "Python", "Java", "React", 
    "Node.js", "Data Analysis", "Machine Learning", "Project Management"
  ];

  const interestOptions = [
    "Software Development", "Data Science", "Artificial Intelligence", "Web Development",
    "Mobile Development", "Cloud Computing", "Cybersecurity", "UI/UX Design"
  ];

  // Fetch initial profile records from MongoDB Atlas
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await API.get('/profile/me');
        if (res.data) {
          setEducation(res.data.education || '');
          setSelectedSkills(Array.isArray(res.data.skills) ? res.data.skills : []);
          setSelectedInterests(Array.isArray(res.data.interests) ? res.data.interests : []);
          
          // Captures role profile configuration context directly if exposed by payload hook
          if (res.data.user && res.data.user.role) {
            setUserRole(res.data.user.role.toLowerCase());
          }
        }
      } catch (err) {
        console.error("Error reading profile metrics:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  // Multi-select toggle handler for arrays
  const handleToggle = (item, currentList, setList) => {
    if (currentList.includes(item)) {
      setList(currentList.filter(i => i !== item));
    } else {
      setList([...currentList, item]);
    }
  };

  const handleCancelRedirect = () => {
    if (userRole.includes('professional')) {
      navigate('/professional-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    try {
      const payload = {
        education,
        skills: selectedSkills,
        interests: selectedInterests
      };

      const res = await API.post('/profile', payload);
      setMessage({ type: 'success', text: res.data.msg || 'Profile synchronized successfully!' });
      
      // Dynamic fallback redirection context matching current user ecosystem constraints
      setTimeout(() => {
        if (userRole.includes('professional')) {
          navigate('/professional-dashboard');
        } else {
          navigate('/student-dashboard');
        }
      }, 1200);
    } catch (err) {
      setMessage({ type: 'error', text: 'Failed to update profile parameters.' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium animate-pulse">Loading profile canvas details...</p>
      </div>
    );
  }

  return (
    /* ✂️ REMOVED: Structural outer flex layouts so component embeds seamlessly inside MainLayout */
    <div className="p-10 w-full">
      <div className="max-w-3xl mx-auto">
        
        {/* Header Block Layout */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Complete Your Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Tell us about your education, skills, and interests to personalize your career guidance track.</p>
        </div>

        {message.text && (
          <div className={`p-4 rounded-xl mb-6 text-sm font-medium border ${
            message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          
          {/* 1. Education Dropdown Container Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
              <GraduationCap className="h-5 w-5 text-indigo-600" />
              <h2>Education</h2>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">Education Level</label>
              <select
                value={education}
                onChange={(e) => setEducation(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:border-indigo-600 focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="">Select your education level</option>
                <option value="Bachelors">Bachelor's Degree</option>
                <option value="Masters">Master's Degree</option>
                <option value="PhD">Ph.D. / Doctorate</option>
                <option value="Diploma">Professional Diploma</option>
              </select>
            </div>
          </div>

          {/* 2. Technical Skills Checkbox Grid Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
              <CheckSquare className="h-5 w-5 text-emerald-600" />
              <h2>Skills</h2>
            </div>
            <p className="text-xs text-slate-400">Select all skills that apply to you</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {skillOptions.map((skill) => {
                const isChecked = selectedSkills.includes(skill);
                return (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => handleToggle(skill, selectedSkills, setSelectedSkills)}
                    className={`px-4 py-3.5 border rounded-xl text-sm font-medium flex items-center justify-between text-left transition-all ${
                      isChecked 
                        ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{skill}</span>
                    <input 
                      type="checkbox" 
                      checked={isChecked} 
                      readOnly 
                      className="accent-indigo-600 h-4 w-4 rounded cursor-pointer"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Career Areas of Interest Checkbox Grid Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 text-slate-800 font-bold text-base border-b border-slate-100 pb-3">
              <Heart className="h-5 w-5 text-rose-500" />
              <h2>Career Interests</h2>
            </div>
            <p className="text-xs text-slate-400">Select your areas of interest</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {interestOptions.map((interest) => {
                const isChecked = selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => handleToggle(interest, selectedInterests, setSelectedInterests)}
                    className={`px-4 py-3.5 border rounded-xl text-sm font-medium flex items-center justify-between text-left transition-all ${
                      isChecked 
                        ? 'border-indigo-600 bg-indigo-50/40 text-indigo-700' 
                        : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <span>{interest}</span>
                    <input 
                      type="checkbox" 
                      checked={isChecked} 
                      readOnly 
                      className="accent-indigo-600 h-4 w-4 rounded cursor-pointer"
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interaction Form Buttons Footer row */}
          <div className="flex items-center gap-4 pt-2">
            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/10 transition-all flex items-center gap-2 text-sm"
            >
              <Save className="h-4 w-4" />
              <span>Save Profile</span>
            </button>
            <button
              type="button"
              onClick={handleCancelRedirect}
              className="px-6 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 font-semibold rounded-xl transition-all flex items-center gap-2 text-sm"
            >
              <X className="h-4 w-4" />
              <span>Cancel</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}