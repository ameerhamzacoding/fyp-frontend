import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { CheckCircle } from 'lucide-react';

export function AssessmentPage() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState('student'); // State fallback context tracking for layout redirection

  // Sample static questions for the AI Career System matrix parsing
  const questions = [
  {
    id: 1,
    question: "What type of work would you enjoy the most?",
    options: [
      "Designing websites and user interfaces",
      "Writing code and solving programming problems",
      "Building AI and smart applications",
      "Working with data and analytics",
      "Creating mobile applications",
      "Building complete web applications"
    ]
  },
  {
    id: 2,
    question: "Which type of project would you like to build?",
    options: [
      "Personal Portfolio Website",
      "E-commerce Website",
      "Mobile App",
      "AI Chatbot",
      "Hospital Management System",
      "Game"
    ]
  },
  {
    id: 3,
    question: "Which subject do you enjoy the most?",
    options: [
      "Programming",
      "Artificial Intelligence",
      "Databases",
      "Networking",
      "Software Engineering",
      "Mathematics"
    ]
  },
  {
    id: 4,
    question: "What activity sounds the most exciting?",
    options: [
      "Creating beautiful websites",
      "Writing backend logic",
      "Training AI models",
      "Analyzing data",
      "Finding and fixing bugs",
      "Managing software projects"
    ]
  },
  {
    id: 5,
    question: "How do you prefer learning new skills?",
    options: [
      "Watching YouTube tutorials",
      "Building practical projects",
      "Reading documentation",
      "Learning with friends",
      "Solving coding challenges",
      "Attending workshops"
    ]
  },
  {
    id: 6,
    question: "What motivates you the most?",
    options: [
      "Building useful software",
      "High salary",
      "Creativity and innovation",
      "Starting my own company",
      "Helping people through technology",
      "Solving difficult problems"
    ]
  },
  {
    id: 7,
    question: "Which work style suits you best?",
    options: [
      "Working independently",
      "Working in a small team",
      "Working in a large company",
      "Working directly with clients"
    ]
  },
  {
    id: 8,
    question: "Where would you like to work in the future?",
    options: [
      "Software House",
      "Startup",
      "Multinational Company",
      "Government Organization",
      "Freelancing",
      "Remote Company"
    ]
  },
  {
    id: 9,
    question: "Which industry interests you the most?",
    options: [
      "E-commerce",
      "Healthcare",
      "Education",
      "Finance",
      "Gaming",
      "Artificial Intelligence"
    ]
  },
  {
    id: 10,
    question: "Which quality describes you best?",
    options: [
      "Creative",
      "Analytical",
      "Curious",
      "Patient",
      "Leadership",
      "Detail-Oriented"
    ]
  },
  {
    id: 11,
    question: "What type of technology would you like to work with?",
    options: [
      "Web Development",
      "Artificial Intelligence",
      "Mobile Applications",
      "Cloud Computing",
      "Cybersecurity",
      "Data Science"
    ]
  },
  {
    id: 12,
    question: "Where do you see yourself after graduation?",
    options: [
      "Software Developer",
      "AI Engineer",
      "Data Scientist",
      "Mobile App Developer",
      "Entrepreneur",
      "Technical Team Lead"
    ]
  }
];
  // 🚀 ROBUST USER CONTEXT DETECTOR WITH SYSTEM DIAGNOSTIC TRACERS
  useEffect(() => {
    const fetchUserContext = async () => {
      try {
        const res = await API.get('/profile/me');
        
        // 🔍 TRACER 1: See the exact backend response structure
        console.log("🔍 ASSESSMENT PAGE PROFILE RESPONSE:", res.data);

        const activeRole = res?.data?.user?.role || res?.data?.role;
        if (activeRole) {
          setUserRole(activeRole.toLowerCase().trim());
        }
      } catch (err) {
        console.error("Error reading profile parameters:", err);
        
        try {
          const token = localStorage.getItem('token');
          if (token) {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            
            // 🔍 TRACER 2: See what is hidden inside your local JWT storage token
            console.log("🔍 JWT TOKEN PAYLOAD UNPACKED:", payload);

            const jwtRole = payload?.user?.role || payload?.role;
            if (jwtRole) {
              setUserRole(jwtRole.toLowerCase().trim());
            }
          }
        } catch (jwtErr) {
          console.error("Token decoding fallback failed:", jwtErr);
        }
      }
    };
    fetchUserContext();
  }, []);

  const handleSelectOption = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  // 🚀 FIXED BULLETPROOFoverrides: DIRECT JWT CHECK ON-CLICK
  const handleReturnDashboard = () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        // Decode the payload segment from the active JSON Web Token string
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const decodedPayload = JSON.parse(window.atob(base64));
        
        // Normalize token payload layouts cleanly
        const verifiedRole = (decodedPayload?.user?.role || decodedPayload?.role || '').toLowerCase().trim();
        
        console.log("🎯 Final Click Routing Role Verdict:", verifiedRole);

        if (verifiedRole === 'professional') {
          navigate('/professional-dashboard');
          return;
        } else if (verifiedRole === 'hr') {
          navigate('/hr-dashboard');
          return;
        }
      }
    } catch (error) {
      console.error("Failed to parse explicit path routing overrides on click:", error);
    }

    // Safe state fallback condition if token is missing or parse logs fail
    if (userRole === 'professional') {
      navigate('/professional-dashboard');
    } else {
      navigate('/student-dashboard');
    }
  };

  const handleSubmit = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    
    if (Object.keys(answers).length < questions.length) {
      alert("Please answer all questions before submitting your evaluation.");
      return;
    }

    setLoading(true);
    try {
      const totalScore = Object.values(answers).reduce((acc, curr) => acc + (curr + 1) * 25, 0);

      const formattedAnswers = questions.map(q => ({
        questionId: q.id,
        questionText: q.question,
        selectedOption: q.options[answers[q.id]]
      }));

      await API.post('/assessment', {
        score: totalScore,
        answers: formattedAnswers
      });

      setIsSubmitted(true);
    } catch (err) {
      console.error('Failed to submit assessment parameters:', err);
      alert('Error connecting to backend server. Please check your network connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 w-full">
      <div className="max-w-3xl mx-auto">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Career Assessment</h1>
          <p className="text-slate-500">Answer the following questions to help us understand your career preferences and provide personalized recommendations.</p>
        </div>

        {isSubmitted ? (
          /* Success Feedback Layout Block */
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm text-center py-12 max-w-xl mx-auto animate-fadeIn">
            <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Assessment Completed!</h2>
            <p className="text-slate-500 text-sm mb-6">Your profiling metric coordinates have been successfully synchronized with your data science tracking engine.</p>
            <button 
              type="button"
              onClick={handleReturnDashboard}
              className="px-6 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/10 text-sm"
            >
              Return to Dashboard Workspace
            </button>
          </div>
        ) : (
          /* Quiz Interactive Form Elements */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">Progress Tracking</span>
                <span className="text-sm font-bold text-indigo-600">{Object.keys(answers).length} / {questions.length} completed</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-indigo-600 h-full transition-all duration-300"
                  style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex gap-4 items-start mb-4">
                    <span className="h-7 w-7 bg-slate-50 text-slate-600 border border-slate-200 text-xs font-bold rounded-lg flex items-center justify-center shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-slate-800 text-base pt-0.5">{q.question}</h3>
                  </div>

                  <div className="grid gap-3 pl-11">
                    {q.options.map((opt, oIdx) => (
                      <button
                        type="button"
                        key={oIdx}
                        onClick={() => handleSelectOption(q.id, oIdx)}
                        className={`w-full text-left px-5 py-3.5 rounded-xl border text-sm font-medium transition-all duration-150 flex items-center justify-between ${
                          answers[q.id] === oIdx
                            ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm shadow-indigo-600/5'
                            : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600'
                        }`}
                      >
                        <span>{opt}</span>
                        <div className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                          answers[q.id] === oIdx ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                        }`}>
                          {answers[q.id] === oIdx && <div className="h-1.5 w-1.5 bg-white rounded-full" />}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 text-right">
              <button
                type="submit"
                disabled={loading || Object.keys(answers).length < questions.length}
                className="px-8 py-3.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-600/10 text-sm"
              >
                {loading ? 'Processing Data Vectors...' : 'Submit Evaluation Mapping'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}