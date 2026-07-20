import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Users,
  Calendar,
  CheckCircle,
  PlusCircle,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import API from '../api/axiosInstance';

export function HRDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const fetchHRData = useCallback(async (manualRefresh = false) => {
    try {
      setError('');

      if (manualRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const res = await API.get('/jobs');

      console.log('HR dashboard jobs response:', res.data);

      let fetchedJobs = [];

      // Supports a direct array response:
      // res.json(jobs)
      if (Array.isArray(res.data)) {
        fetchedJobs = res.data;
      }

      // Supports an object response:
      // res.json({ jobs, count })
      else if (Array.isArray(res.data?.jobs)) {
        fetchedJobs = res.data.jobs;
      }

      // Supports:
      // res.json({ data: { jobs: [...] } })
      else if (Array.isArray(res.data?.data?.jobs)) {
        fetchedJobs = res.data.data.jobs;
      }

      // Supports:
      // res.json({ data: [...] })
      else if (Array.isArray(res.data?.data)) {
        fetchedJobs = res.data.data;
      } else {
        console.warn('Unexpected jobs response format:', res.data);
      }

      setJobs(fetchedJobs);
    } catch (err) {
      console.error(
        'Error fetching recruiter jobs:',
        err.response?.data || err.message
      );

      setJobs([]);

      setError(
        err.response?.data?.message ||
          err.response?.data?.msg ||
          'Unable to load job postings. Please check the backend route and authentication.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchHRData();
  }, [fetchHRData]);

  const activeJobs = jobs.filter(
    (job) => !job.status || job.status === 'Active'
  );

  const formatExpiryDate = (expiryDate) => {
    if (!expiryDate) {
      return null;
    }

    const date = new Date(expiryDate);

    if (Number.isNaN(date.getTime())) {
      return null;
    }

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <RefreshCw className="h-7 w-7 mx-auto mb-3 text-indigo-600 animate-spin" />

          <p className="text-slate-500 font-medium">
            Syncing portal metrics...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10 w-full animate-fadeIn">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-1">
              HR Dashboard
            </h1>

            <p className="text-slate-500 text-sm">
              Manage job postings and find suitable candidates for your
              organization.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => fetchHRData(true)}
              disabled={refreshing}
              className="px-4 py-3 bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-600 font-semibold rounded-xl flex items-center gap-2 text-sm transition-all disabled:opacity-60"
            >
              <RefreshCw
                className={`h-4 w-4 ${
                  refreshing ? 'animate-spin' : ''
                }`}
              />

              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/create-job')}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-md shadow-indigo-600/10 flex items-center gap-2 text-sm transition-all"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Create New Job</span>
            </button>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 mt-0.5 shrink-0" />

            <div>
              <p className="font-semibold text-sm">
                Unable to fetch HR jobs
              </p>

              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-md shadow-indigo-600/10 flex items-center gap-5">
            <div className="h-12 w-12 bg-indigo-700 rounded-xl flex items-center justify-center shrink-0">
              <Briefcase className="h-6 w-6" />
            </div>

            <div>
              <span className="text-2xl font-bold block">
                {activeJobs.length}
              </span>

              <span className="text-xs text-indigo-200 font-medium uppercase tracking-wider">
                Active Jobs
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="h-12 w-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center shrink-0">
              <Users className="h-6 w-6" />
            </div>

            <div>
              <span className="text-2xl font-bold text-slate-800 block">
                0
              </span>

              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Total Applicants
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="h-12 w-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center shrink-0">
              <Calendar className="h-6 w-6" />
            </div>

            <div>
              <span className="text-2xl font-bold text-slate-800 block">
                0
              </span>

              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Interviews
              </span>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-5">
            <div className="h-12 w-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
              <CheckCircle className="h-6 w-6" />
            </div>

            <div>
              <span className="text-2xl font-bold text-slate-800 block">
                0
              </span>

              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Offers Sent
              </span>
            </div>
          </div>
        </div>

        {/* Recent jobs */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Recent Job Postings
              </h2>

              <p className="text-sm text-slate-400 mt-1">
                Total jobs found: {jobs.length}
              </p>
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center shadow-sm">
              <Briefcase className="h-10 w-10 text-slate-300 mx-auto mb-3" />

              <p className="text-slate-700 font-semibold">
                No job postings found
              </p>

              <p className="text-slate-400 text-sm mt-1">
                Create a job or press Refresh after publishing one.
              </p>

              <button
                type="button"
                onClick={() => navigate('/create-job')}
                className="mt-5 px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl inline-flex items-center gap-2 text-sm transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                Create First Job
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {jobs.map((job, index) => {
                const expiryDate = formatExpiryDate(job.expiryDate);

                return (
                  <div
                    key={job._id || job.id || `${job.title}-${index}`}
                    className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 md:flex-row md:items-center md:justify-between transition-all hover:border-indigo-200 hover:shadow-md"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-indigo-600 shrink-0">
                        <Briefcase className="h-5 w-5" />
                      </div>

                      <div>
                        <h3 className="font-bold text-slate-800 text-base">
                          {job.title || 'Untitled Job'}
                        </h3>

                        <p className="text-xs text-slate-400 mt-1">
                          Company:{' '}
                          <span className="font-medium text-slate-600 mr-3">
                            {job.company || 'N/A'}
                          </span>

                          Location:{' '}
                          <span className="font-medium text-slate-600">
                            {job.location || 'N/A'}
                          </span>
                        </p>

                        {Array.isArray(job.skillsRequired) &&
                          job.skillsRequired.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {job.skillsRequired
                                .slice(0, 5)
                                .map((skill) => (
                                  <span
                                    key={skill}
                                    className="px-2.5 py-1 bg-slate-100 text-slate-600 text-[11px] font-medium rounded-md"
                                  >
                                    {skill}
                                  </span>
                                ))}
                            </div>
                          )}
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-2 shrink-0">
                      {!job.status || job.status === 'Active' ? (
                        <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-semibold rounded-lg">
                          Active
                        </span>
                      ) : job.status === 'Expired' ? (
                        <span className="px-3 py-1 bg-rose-50 text-rose-700 border border-rose-100 text-xs font-semibold rounded-lg">
                          Expired
                        </span>
                      ) : (
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 border border-amber-100 text-xs font-semibold rounded-lg">
                          {job.status || 'Filled'}
                        </span>
                      )}

                      {expiryDate && (
                        <p className="text-[11px] text-slate-400 font-medium">
                          Ends: {expiryDate}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}