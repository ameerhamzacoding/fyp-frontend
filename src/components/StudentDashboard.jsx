import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import { CheckCircle, Circle, AlertCircle, TrendingUp } from 'lucide-react';

export function StudentDashboard() {
  const [analytics, setAnalytics] = useState({ skillsCount: 0, assessmentsCount: 0 });
  const [tracks, setTracks] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [profileRes, assessmentRes, guidanceRes] = await Promise.all([
          API.get('/profile/me').catch(() => null),
          API.get('/assessment/my-count').catch(() => ({ data: { count: 0 } })),
          API.get('/guidance/predict-tracks').catch(() => ({ data: null }))
        ]);

        const aiData = guidanceRes?.data;

        const paths = Array.isArray(aiData?.recommendations)
          ? aiData.recommendations.map((item, index) => ({
              rank: index + 1,
              title: item.career,
              confidence: item.confidence,
              isTop: item.career === aiData.topCareer,
              matchedSkills: item.career === aiData.topCareer ? aiData.skillGap?.matchedSkills || [] : [],
              missingSkills: item.career === aiData.topCareer ? aiData.skillGap?.missingSkills || [] : [],
              readiness: item.career === aiData.topCareer ? aiData.skillGap?.matchPercentage || 0 : 0
            }))
          : [];

        setTracks(paths);
        setSelectedPath(paths[0] || null);

        setAnalytics({
          skillsCount: profileRes?.data?.skills?.length || 0,
          assessmentsCount: assessmentRes?.data?.count || 0
        });
      } catch (err) {
        console.error('Student dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading dashboard...</p>
      </div>
    );
  }

  const hasSkills = analytics.skillsCount > 0;
  const hasAssessment = analytics.assessmentsCount > 0;
  const isUnlocked = !!selectedPath;

  const profileCompletion = hasSkills && hasAssessment ? 100 : hasSkills || hasAssessment ? 50 : 0;

  const matched = selectedPath?.matchedSkills || [];
  const missing = selectedPath?.missingSkills || [];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">
            Build your personalized AI career roadmap step by step.
          </p>
        </div>

        {/* Setup Checklist */}
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-5">Complete Your Setup</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SetupStep done={hasSkills} title="Add Skills" desc={`${analytics.skillsCount} skills added`} />
            <SetupStep done={hasAssessment} title="Take Assessment" desc={`${analytics.assessmentsCount} completed`} />
            <SetupStep done={isUnlocked} title="AI Recommendation" desc={isUnlocked ? 'Unlocked' : 'Locked'} />
            <SetupStep done={isUnlocked} title="Learning Roadmap" desc={isUnlocked ? 'Generated' : 'Pending'} />
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Profile completion</span>
              <span>{profileCompletion}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${profileCompletion}%` }} />
            </div>
          </div>
        </section>

        {/* Recommendation */}
        <section className="bg-white border border-slate-200 rounded-xl p-8">
          {isUnlocked ? (
            <>
              <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                AI Recommended Career
              </p>

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8 mt-3">
                <div>
                  <h2 className="text-4xl font-bold text-slate-950">{selectedPath.title}</h2>
                  <p className="text-sm text-slate-500 mt-3 max-w-2xl">
                    Recommended from your profile skills, education, interests, and assessment answers.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4 min-w-[280px]">
                  <Metric label="AI Confidence" value={`${selectedPath.confidence}%`} />
                  <Metric label="Career Readiness" value={`${selectedPath.readiness}%`} />
                </div>
              </div>
            </>
          ) : (
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                AI Recommended Career
              </p>
              <h2 className="text-3xl font-bold text-slate-900 mt-3">Locked</h2>
              <p className="text-sm text-slate-500 mt-3 max-w-2xl">
                Complete your profile skills and career assessment to unlock personalized AI recommendations.
              </p>
            </div>
          )}
        </section>

        {/* Alternative Careers */}
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Career Matches</h3>

          {tracks.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Career Path 1', 'Career Path 2', 'Career Path 3'].map((item) => (
                <div key={item} className="border border-dashed border-slate-200 rounded-xl p-4 text-slate-400">
                  <p className="text-xs font-semibold">Locked</p>
                  <h4 className="text-sm font-bold mt-1">{item}</h4>
                  <p className="text-xs mt-2">Complete setup to reveal</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {tracks.map((track) => (
                <button
                  key={track.title}
                  onClick={() => setSelectedPath(track)}
                  className={`text-left border rounded-xl p-4 ${
                    selectedPath?.title === track.title
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <p className="text-xs text-slate-400 font-semibold">#{track.rank}</p>
                  <h4 className="text-sm font-bold text-slate-900 mt-1">{track.title}</h4>
                  <p className="text-xs text-slate-500 mt-2">{track.confidence}% confidence</p>
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Skill Analysis</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillBox
                title="Matched Skills"
                icon={<CheckCircle className="h-4 w-4 text-emerald-600" />}
                items={matched.length ? matched : ['Will appear after AI recommendation']}
              />

              <SkillBox
                title="Missing Skills"
                icon={<AlertCircle className="h-4 w-4 text-amber-600" />}
                items={missing.length ? missing : ['Will appear after AI recommendation']}
              />
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Summary</h3>

            <div className="space-y-4">
              <SummaryRow label="Skills Added" value={analytics.skillsCount} />
              <SummaryRow label="Assessments Taken" value={analytics.assessmentsCount} />
              <SummaryRow label="Career Paths" value={tracks.length} />
              <SummaryRow label="Skills Missing" value={missing.length} />
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-indigo-600" />
                <p className="text-sm font-bold text-slate-900">Next Action</p>
              </div>
              <p className="text-sm text-slate-600">
                {isUnlocked
                  ? 'Start learning the first missing skill in your roadmap.'
                  : 'Add skills and complete the assessment to unlock AI guidance.'}
              </p>
            </div>
          </section>
        </div>

        {/* Roadmap */}
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Learning Roadmap</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(missing.length ? missing : ['Roadmap locked', 'Add skills', 'Take assessment', 'Generate recommendation'])
              .slice(0, 8)
              .map((skill, idx) => (
                <div key={idx} className="border border-slate-200 rounded-xl p-4">
                  <p className="text-xs font-semibold text-slate-400">Step {idx + 1}</p>
                  <h4 className="text-sm font-bold text-slate-900 mt-2">{skill}</h4>
                  <p className="text-xs text-slate-500 mt-2">
                    {isUnlocked ? 'Learn and practice this skill with a small project.' : 'This will unlock after AI prediction.'}
                  </p>
                </div>
              ))}
          </div>
        </section>

      </div>
    </div>
  );
}

function SetupStep({ done, title, desc }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4">
      <div className="flex items-center gap-2">
        {done ? <CheckCircle className="h-4 w-4 text-emerald-600" /> : <Circle className="h-4 w-4 text-slate-300" />}
        <p className="text-sm font-bold text-slate-900">{title}</p>
      </div>
      <p className="text-xs text-slate-500 mt-2">{desc}</p>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 bg-slate-50">
      <p className="text-xs font-semibold text-slate-400 uppercase">{label}</p>
      <p className="text-2xl font-bold text-slate-900 mt-2">{value}</p>
    </div>
  );
}

function SkillBox({ title, icon, items }) {
  return (
    <div className="border border-slate-200 rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        {icon}
        <h4 className="text-sm font-bold text-slate-800">{title}</h4>
      </div>
      <div className="space-y-2">
        {items.map((item, idx) => (
          <div key={idx} className="text-sm text-slate-600 border-b border-slate-100 pb-2 last:border-0">
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 pb-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>
      <span className="text-sm font-bold text-slate-900">{value}</span>
    </div>
  );
}