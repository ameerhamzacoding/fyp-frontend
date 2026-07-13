import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axiosInstance';
import { Briefcase, MapPin, Building, Calendar, ArrowLeft } from 'lucide-react';

export function CreateJobPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    skillsRequired: '',
    description: '',
    expiryDate: '' // 🚀 Initialized cleanly
  });
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // Split comma-separated skills into a clean array structure
      const parsedPayload = {
        ...formData,
        skillsRequired: formData.skillsRequired.split(',').map(skill => skill.trim())
      };
      
      await API.post('/jobs', parsedPayload);
      navigate('/hr-dashboard'); // Head back home cleanly
    } catch (err) {
      console.error('Failed to publish active recruiter listing:', err);
      alert(err.response?.data?.message || 'Database validation failed. Check fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-10 w-full animate-fadeIn">
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation Breadcrumb Back Anchor */}
        <button 
          onClick={() => navigate('/hr-dashboard')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 mb-6 transition-all"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Workspace
        </button>

        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="mb-8 border-b border-slate-100 pb-5">
            <h1 className="text-2xl font-bold text-slate-800">Post New Job Opening</h1>
            <p className="text-slate-400 text-xs mt-1">Fill out core requirements to broadcast your deployment tags to the machine matching space.</p>
          </div>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    name="title" 
                    required
                    placeholder="e.g., Senior QA Engineer"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600 transition-all"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Company Name</label>
                <div className="relative">
                  <Building className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    name="company" 
                    required
                    placeholder="e.g., UMT BETA LAB"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Job Location</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="text" 
                    name="location" 
                    required
                    placeholder="e.g., Lahore"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600 transition-all"
                  />
                </div>
              </div>

              {/* 🌟 FIXED: DYNAMIC DATE INPUT BINDING LOOP */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Application Closing Date</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                  <input 
                    type="date" 
                    name="expiryDate" 
                    required
                    min={new Date().toISOString().split('T')[0]} 
                    value={formData.expiryDate || ""}
                    
                    /* 🚀 FORCE EXPLICIT STATE UPDATE BYPASSING NATIVE EVENT LAGS */
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData(prev => ({ ...prev, expiryDate: val }));
                    }}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600 transition-all text-slate-700"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Required Technical Skills (Comma Separated)</label>
              <input 
                type="text" 
                name="skillsRequired" 
                required
                placeholder="React js, Node js, Mongodb"
                value={formData.skillsRequired}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600 transition-all"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Role Description</label>
              <textarea 
                name="description" 
                rows="4"
                required
                placeholder="Provide a comprehensive breakdown of project expectations..."
                value={formData.description}
                onChange={handleInputChange}
                className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl text-sm focus:outline-indigo-600 transition-all resize-none"
              ></textarea>
            </div>

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-600/10 transition-all tracking-wide disabled:bg-slate-300 disabled:cursor-not-allowed"
            >
              {submitting ? 'Publishing Post...' : 'Publish Corporate Job Opening'}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}