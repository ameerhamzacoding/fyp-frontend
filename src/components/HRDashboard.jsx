import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { Briefcase, Users, Calendar, CheckCircle, PlusCircle } from 'lucide-react';

export function HRDashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🚀 FETCH LIVE JOBS WITH DYNAMIC JSON ARRAY CHECKING
  const fetchHRData = async () => {
    try {
      const res = await API.get('/jobs'); 
      
      console.log("🔍 INSPECTING SERVER RESPONSE:", res.data);

      // 🛠️ The JSON Envelope Safe-Unpacker Loop
      if (Array.isArray(res.data)) {
        // Direct array setup: [...]
        setJobs(res.data);
      } else if (res.data && Array.isArray(res.data.jobs)) {
        // Wrapped format type A: { jobs: [...] }
        setJobs(res.data.jobs);
      } else if (res.data && Array.isArray(res.data.data)) {
        // Standard API envelope format type B: { success: true, data: [...] }
        setJobs(res.data.data);
      } else {
        console.warn("⚠️ Response received, but no iterable array field matched:", res.data);
        setJobs([]);
      }
    } catch (err) {
      console.error('Error fetching recruiter database records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHRData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium animate-pulse">Syncing portal metrics...</p>
      </div>
    );
  }

  return (
    <div className="p-10 w-full animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        
        {/* Title Headline Header Block */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-1">HR Dashboard</h1>
          <p className="text-slate-500 text-sm">Welcome to the HR portal. Manage job postings and find the best talent for your organization.</p>
        </div>

        {/* 📊 DYNAMIC STATS CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-md shadow-indigo-600/10 flex items-center gap-5">
            <div className="h-12 w-12 bg-indigo-700 rounded-xl flex items-center justify-center shrink-0">
              <Briefcase className="h-6 w-6" />
            </div>
            <div>
              {/* Dynamic Count from structural array state length */}
              <span className="text-2xl font-bold block">{jobs.length}</span>
              <span className="text-xs text-indigo-200 font-medium uppercase tracking-wider">Active Jobs</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-800 block">0</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Applicants</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <Calendar className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-800 block">0</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Interviews Scheduled</span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle className="h-6 w-6" />
            </div>
            <div>
              <span className="text-2xl font-bold text-slate-800 block">0</span>
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Offers Sent</span>
            </div>
          </div>
        </div>

        {/* Create Posting CTA Button */}
        <button 
          onClick={() => navigate('/create-job')}
          className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-2 text-sm mb-10 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create New Job Posting</span>
        </button>

        {/* 🚀 DYNAMIC RECENT JOB POSTINGS LIST */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-800 mb-2">Recent Job Postings</h2>
          
          {jobs.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 text-sm shadow-sm">
              No job postings published yet. Click the button above to launch your first job opening!
            </div>
          ) : (
            jobs.map((job) => (
              <div key={job._id || job.title} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between transition-all hover:border-slate-300">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-indigo-600">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-base">{job.title}</h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Company: <span className="font-medium text-slate-600 mr-3">{job.company || 'N/A'}</span>
                      Location: <span className="font-medium text-slate-600">{job.location || 'N/A'}</span>
                    </p>
                  </div>
                </div>

                {/* DYNAMIC LIFE CYCLE STATUS BADGES & TIMELINE */}
                <div className="flex flex-col items-end gap-1 shrink-0">
                  {job.status === 'Active' || !job.status ? (
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold rounded-lg">
                      Active
                    </span>
                  ) : job.status === 'Expired' ? (
                    <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 text-xs font-semibold rounded-lg">
                      Expired
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold rounded-lg">
                      Filled
                    </span>
                  )}
                  
                  {job.expiryDate && (
                    <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                      Ends: {(() => {
                        const d = new Date(job.expiryDate);
                        const utcDate = new Date(d.getTime() + d.getTimezoneOffset() * 60000);
                        return utcDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                      })()}
                    </p>
                  )}
                </div>

              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}