import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Users, Briefcase, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 selection:bg-indigo-500 selection:text-white">
      {/* Hero Section */}
      <div className="flex min-h-screen items-center justify-center px-8">
        <div className="w-full max-w-5xl">
          <div className="mb-16 text-center text-white">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm">
                <Sparkles className="h-10 w-10 text-emerald-400" />
              </div>
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
              AI-Powered Career Counselor &<br />
              <span className="text-emerald-400">HR Talent Matching</span>
            </h1>
            
            <p className="mx-auto mb-12 max-w-3xl text-xl leading-relaxed text-indigo-100">
              A comprehensive platform connecting students, professionals, and HR recruiters 
              for optimal career matching and talent acquisition.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => navigate('/auth?mode=login')}
                className="group flex items-center gap-2 rounded-xl bg-white px-8 py-4 font-semibold text-indigo-700 shadow-xl transition-all duration-200 hover:bg-indigo-50 hover:shadow-2xl"
              >
                Login
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                onClick={() => navigate('/auth?mode=register')}
                className="rounded-xl border-2 border-white/20 bg-white/10 px-8 py-4 font-semibold text-white backdrop-blur-sm transition-all duration-200 hover:bg-white/20"
              >
                Register Now
              </button>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            <FeatureCard 
              icon={<Users className="h-6 w-6 text-white" />}
              title="For Students"
              description="Get personalized career guidance and discover opportunities that match your skills."
            />
            <FeatureCard 
              icon={<Briefcase className="h-6 w-6 text-white" />}
              title="For Professionals"
              description="Advance your career with AI-powered job recommendations and skill assessments."
            />
            <FeatureCard 
              icon={<Sparkles className="h-6 w-6 text-white" />}
              title="For HR"
              description="Find the perfect candidates with intelligent talent matching technology."
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="rounded-2xl border border-white/20 bg-white/10 p-8 backdrop-blur-sm transition-transform hover:-translate-y-1">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
        {icon}
      </div>
      <h3 className="mb-3 text-xl font-semibold text-white">{title}</h3>
      <p className="text-indigo-100/80 leading-relaxed">
        {description}
      </p>
    </div>
  );
}