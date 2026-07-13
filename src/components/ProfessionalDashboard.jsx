import React, { useState, useEffect } from 'react';
import API from '../api/axiosInstance';
import {
  CheckCircle,
  Circle,
  AlertCircle,
  Briefcase,
  TrendingUp,
  Building2
} from 'lucide-react';

export function ProfessionalDashboard() {
  const [analytics, setAnalytics] = useState({
    skillsCount: 0,
    assessmentsCount: 0
  });

  const [tracks, setTracks] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const [profileRes, assessmentRes, guidanceRes, jobRes] = await Promise.all([
          API.get('/profile/me').catch(() => null),
          API.get('/assessment/my-count').catch(() => ({ data: { count: 0 } })),
          API.get('/guidance/predict-tracks').catch(() => ({ data: null })),
          API.get('/match').catch(() => ({ data: [] }))
        ]);

        const aiData = guidanceRes?.data;

        const paths = Array.isArray(aiData?.recommendations)
          ? aiData.recommendations.map((item, index) => ({
              rank: index + 1,
              title: item.career,
              confidence: item.confidence,
              isTop: item.career === aiData.topCareer,
              matchedSkills:
                item.career === aiData.topCareer ? aiData.skillGap?.matchedSkills || [] : [],
              missingSkills:
                item.career === aiData.topCareer ? aiData.skillGap?.missingSkills || [] : [],
              readiness:
                item.career === aiData.topCareer ? aiData.skillGap?.matchPercentage || 0 : 0
            }))
          : [];

        setTracks(paths);
        setSelectedPath(paths[0] || null);
        setMatchedJobs(Array.isArray(jobRes.data) ? jobRes.data : []);

        setAnalytics({
          skillsCount: profileRes?.data?.skills?.length || 0,
          assessmentsCount: assessmentRes?.data?.count || 0
        });
      } catch (err) {
        console.error('Professional dashboard error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-sm text-slate-500">Loading professional dashboard...</p>
      </div>
    );
  }

  const hasSkills = analytics.skillsCount > 0;
  const hasAssessment = analytics.assessmentsCount > 0;
  const unlocked = !!selectedPath;

  const completion =
    hasSkills && hasAssessment
      ? 100
      : hasSkills || hasAssessment
      ? 50
      : 0;

  const matched = selectedPath?.matchedSkills || [];
  const missing = selectedPath?.missingSkills || [];

  const roadmapItems = unlocked && missing.length
    ? missing
    : ['Add professional skills', 'Complete career assessment', 'Unlock AI transition', 'Review matched jobs'];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Professional Dashboard</h1>
            <p className="text-sm text-slate-500 mt-1">
              Career transition insights, skill gaps, and matched job opportunities.
            </p>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400 uppercase font-semibold">Profile Status</p>
            <p className="text-sm font-semibold text-slate-700">
              {analytics.skillsCount} skills · {analytics.assessmentsCount} assessment
            </p>
          </div>
        </div>

        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <h2 className="text-sm font-bold text-slate-900 mb-5">Professional Setup</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <SetupStep done={hasSkills} title="Add Skills" desc={`${analytics.skillsCount} skills added`} />
            <SetupStep done={hasAssessment} title="Take Assessment" desc={`${analytics.assessmentsCount} completed`} />
            <SetupStep done={unlocked} title="AI Career Pivot" desc={unlocked ? 'Unlocked' : 'Locked'} />
            <SetupStep done={matchedJobs.length > 0} title="Job Matching" desc={matchedJobs.length > 0 ? `${matchedJobs.length} matches` : 'Pending'} />
          </div>

          <div className="mt-6">
            <div className="flex justify-between text-xs text-slate-500 mb-2">
              <span>Setup completion</span>
              <span>{completion}%</span>
            </div>
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: `${completion}%` }}
              />
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wide">
                AI Career Transition Recommendation
              </p>

              <h2 className="text-4xl font-bold text-slate-950 mt-3">
                {unlocked ? selectedPath.title : 'Career Recommendation Locked'}
              </h2>

              <p className="text-sm text-slate-500 mt-3 max-w-2xl">
                {unlocked
                  ? 'Recommended as your strongest professional pivot based on your current skills, interests, and assessment responses.'
                  : 'Add your professional skills and complete the assessment to unlock your AI career transition recommendation.'}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 min-w-[280px]">
              <Metric label="Pivot Confidence" value={unlocked ? `${selectedPath.confidence}%` : '--'} />
              <Metric label="Technical Readiness" value={unlocked ? `${selectedPath.readiness}%` : '--'} />
            </div>
          </div>

          <div className="mt-8">
            <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
              <span>Transition readiness progress</span>
              <span>{unlocked ? `${selectedPath.readiness}%` : 'Locked'}</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{ width: unlocked ? `${selectedPath.readiness}%` : '0%' }}
              />
            </div>
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-4">Alternative Transition Paths</h3>

          {tracks.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {['Transition Path 1', 'Transition Path 2', 'Transition Path 3'].map((item) => (
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
                  className={`text-left border rounded-xl p-4 transition ${
                    selectedPath?.title === track.title
                      ? 'border-blue-500 bg-blue-50'
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          <section className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Transition Skill Analysis</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillBox
                title="Transferable Skills"
                icon={<CheckCircle className="h-4 w-4 text-emerald-600" />}
                items={unlocked && matched.length ? matched : ['Will appear after AI recommendation']}
              />

              <SkillBox
                title="Skills To Build"
                icon={<AlertCircle className="h-4 w-4 text-amber-600" />}
                items={unlocked && missing.length ? missing : ['Will appear after AI recommendation']}
              />
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-slate-900 mb-5">Transition Summary</h3>

            <div className="space-y-4">
              <SummaryRow label="Skills Added" value={analytics.skillsCount} />
              <SummaryRow label="Assessments Taken" value={analytics.assessmentsCount} />
              <SummaryRow label="Transferable Skills" value={unlocked ? matched.length : 0} />
              <SummaryRow label="Skill Gaps" value={unlocked ? missing.length : 0} />
              <SummaryRow label="Matched Jobs" value={matchedJobs.length} />
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 text-blue-600" />
                <p className="text-sm font-bold text-slate-900">AI Insight</p>
              </div>
              <p className="text-sm text-slate-600">
                {unlocked
                  ? `Your strongest pivot is ${selectedPath.title}. Build the listed missing skills to improve your job matching score.`
                  : 'Complete your profile and assessment to unlock your AI career transition.'}
              </p>
            </div>
          </section>
        </div>

        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-sm font-bold text-slate-900 mb-5">Professional Upskilling Roadmap</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {roadmapItems.slice(0, 8).map((skill, idx) => (
              <div key={idx} className="border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-slate-400">Step {idx + 1}</p>
                <h4 className="text-sm font-bold text-slate-900 mt-2">{skill}</h4>
                <p className="text-xs text-slate-500 mt-2">
                  {unlocked
                    ? 'Practice this skill through an industry-level project.'
                    : 'This step unlocks after your AI career transition is generated.'}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Matched Corporate Openings</h3>
              <p className="text-xs text-slate-500 mt-1">
                Jobs are ranked using your profile skill overlap.
              </p>
            </div>

            <Briefcase className="h-5 w-5 text-blue-600" />
          </div>

          {matchedJobs.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PlaceholderJob />
              <PlaceholderJob />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedJobs.map((job) => (
                <div key={job._id || job.title} className="border border-slate-200 rounded-xl p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{job.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {job.company || 'Company'} · {job.location || 'Location'}
                      </p>
                    </div>

                    <span className="text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-lg">
                      {job.matchPercentage || 0}% Match
                    </span>
                  </div>

                  {job.matchedSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">
                      {job.matchedSkills.map((skill, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] px-2 py-1 bg-slate-50 border border-slate-200 rounded-md text-slate-600"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {job.expiryDate && (
                    <p className="text-[11px] text-slate-400 mt-4">
                      Expires: {new Date(job.expiryDate).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <Building2 className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Professional Career Note</h3>
              <p className="text-sm text-slate-600 mt-2">
                This dashboard focuses on career transition, job readiness, and corporate opportunity matching.
                Update your skills regularly to receive more accurate job matches.
              </p>
            </div>
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
        {done ? (
          <CheckCircle className="h-4 w-4 text-emerald-600" />
        ) : (
          <Circle className="h-4 w-4 text-slate-300" />
        )}
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

function PlaceholderJob() {
  return (
    <div className="border border-dashed border-slate-200 rounded-xl p-5">
      <h4 className="text-sm font-bold text-slate-400">Recommended Job</h4>
      <p className="text-xs text-slate-400 mt-2">
        Complete your profile to discover matching professional opportunities.
      </p>
    </div>
  );
}