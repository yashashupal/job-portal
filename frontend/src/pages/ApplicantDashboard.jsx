import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Briefcase, Clock, Award, CheckCircle2, XCircle, 
  MapPin, FileText, ChevronRight, Loader2, Sparkles 
} from 'lucide-react';
import api, { SERVER_BASE_URL } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';

export default function ApplicantDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, appsRes] = await Promise.all([
        api.get('/dashboard/stats/'),
        api.get('/applications/my-applications/'),
      ]);
      setStats(statsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Card Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md shadow-emerald-100">
              {user?.first_name?.[0] || user?.username?.[0] || 'A'}
            </div>
            <div className="space-y-1">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Job Seeker Profile
              </span>
              <h1 className="text-2xl font-bold text-slate-900">
                {user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username}
              </h1>
              <p className="text-xs text-slate-500">
                {user?.email} {user?.phone ? `• ${user.phone}` : ''}
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Explore More Jobs
          </Link>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Total Applied</span>
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats?.total_applied ?? 0}</p>
            <p className="text-[11px] text-slate-400">Applications submitted</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Under Review</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats?.pending ?? 0}</p>
            <p className="text-[11px] text-amber-600 font-medium">Awaiting employer review</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Shortlisted</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats?.shortlisted ?? 0}</p>
            <p className="text-[11px] text-purple-600 font-medium">Selected for interviews</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Accepted / Offers</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats?.accepted ?? 0}</p>
            <p className="text-[11px] text-emerald-600 font-medium">Offers extended</p>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">
              My Job Applications
            </h2>
            <span className="text-xs text-slate-500">
              {applications.length} total submitted
            </span>
          </div>

          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">You haven't applied to any jobs yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Explore our curated job postings and submit your application with a single click.
              </p>
              <Link
                to="/"
                className="inline-block px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
              >
                Browse Job Openings
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map((app) => {
                const resumeUrl = app.resume.startsWith('http')
                  ? app.resume
                  : `${SERVER_BASE_URL}${app.resume}`;

                return (
                  <div
                    key={app.id}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-indigo-200 transition-all space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-indigo-600 text-lg shrink-0">
                          {app.job_company?.[0] || 'C'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/jobs/${app.job}`}
                              className="text-base font-bold text-slate-900 hover:text-indigo-600 transition-colors"
                            >
                              {app.job_title}
                            </Link>
                          </div>
                          <p className="text-xs text-slate-500 mt-0.5">
                            {app.job_company} • {app.job_location} ({app.job_type})
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Applied on {new Date(app.applied_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Status and Action */}
                      <div className="flex items-center gap-3 sm:self-center shrink-0">
                        <StatusBadge status={app.status} />

                        <a
                          href={resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          title="View submitted resume"
                        >
                          <FileText className="w-4 h-4" />
                        </a>

                        <Link
                          to={`/jobs/${app.job}`}
                          className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                          title="View job listing"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      </div>

                    </div>

                    {/* Status note for candidate */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                      <span>
                        {app.status === 'pending' && 'Your application is awaiting review by the hiring manager.'}
                        {app.status === 'reviewed' && 'The employer has reviewed your resume and profile.'}
                        {app.status === 'shortlisted' && '🎉 Great news! You have been shortlisted for next steps.'}
                        {app.status === 'accepted' && '🎊 Congratulations! Your application has been accepted.'}
                        {app.status === 'rejected' && 'Thank you for applying. The employer decided to proceed with other candidates.'}
                      </span>
                      <span className="text-slate-400">
                        Updated {new Date(app.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
