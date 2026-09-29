import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Briefcase, Users, CheckCircle, Clock, Plus, 
  Trash2, ExternalLink, Download, FileText, Filter, 
  Building, Globe, Phone, Mail, Award, Loader2, AlertCircle 
} from 'lucide-react';
import api, { SERVER_BASE_URL } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import StatusBadge from '../components/StatusBadge';
import PostJobModal from '../components/PostJobModal';

export default function HirerDashboard() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'jobs'); // 'jobs' or 'applications'
  const [stats, setStats] = useState(null);
  const [myJobs, setMyJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postModalOpen, setPostModalOpen] = useState(false);
  
  // Status filter for applications tab
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (searchParams.get('tab') === 'post') {
      setPostModalOpen(true);
    }
  }, [searchParams]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsRes, jobsRes, appsRes] = await Promise.all([
        api.get('/dashboard/stats/'),
        api.get('/jobs/my-jobs/'),
        api.get('/applications/hirer-applications/'),
      ]);
      setStats(statsRes.data);
      setMyJobs(jobsRes.data);
      setApplications(appsRes.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await api.patch(`/applications/${applicationId}/status/`, { status: newStatus });
      // Update local state
      setApplications(prev =>
        prev.map(app => (app.id === applicationId ? { ...app, status: newStatus } : app))
      );
      // Reload stats
      const statsRes = await api.get('/dashboard/stats/');
      setStats(statsRes.data);
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update status. Please try again.");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job posting? All related applications will also be deleted.")) {
      return;
    }
    try {
      await api.delete(`/jobs/${jobId}/`);
      setMyJobs(prev => prev.filter(j => j.id !== jobId));
      setApplications(prev => prev.filter(a => a.job !== jobId));
      loadDashboardData();
    } catch (err) {
      console.error(err);
      alert("Failed to delete job.");
    }
  };

  const handleToggleActive = async (job) => {
    try {
      const res = await api.patch(`/jobs/${job.id}/`, { is_active: !job.is_active });
      setMyJobs(prev => prev.map(j => j.id === job.id ? res.data : j));
    } catch (err) {
      console.error(err);
      alert("Failed to update job status.");
    }
  };

  // Filtered applications
  const filteredApplications = applications.filter(app => {
    const matchesJob = selectedJobFilter === 'All' || app.job === parseInt(selectedJobFilter, 10);
    const matchesStatus = statusFilter === 'All' || app.status === statusFilter;
    return matchesJob && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Banner */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                Hirer Portal
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {user?.company_name || 'Hiring Dashboard'}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Welcome back, {user?.first_name || user?.username}!
            </h1>
            <p className="text-xs text-slate-500">
              Manage your job listings, review applicant resumes, and track recruitment progress.
            </p>
          </div>

          <button
            onClick={() => setPostModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-sm hover:shadow transition-all shrink-0"
          >
            <Plus className="w-4 h-4" />
            Post New Job
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Total Jobs</span>
              <Briefcase className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats?.total_jobs ?? 0}</p>
            <p className="text-[11px] text-slate-400">{stats?.active_jobs ?? 0} active openings</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Total Applicants</span>
              <Users className="w-4 h-4 text-indigo-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats?.total_applications ?? 0}</p>
            <p className="text-[11px] text-slate-400">Across all jobs</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Shortlisted</span>
              <Award className="w-4 h-4 text-purple-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats?.shortlisted ?? 0}</p>
            <p className="text-[11px] text-purple-600 font-medium">Ready for interview</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-semibold">Accepted / Hired</span>
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <p className="text-2xl font-black text-slate-900">{stats?.accepted ?? 0}</p>
            <p className="text-[11px] text-emerald-600 font-medium">Successful hires</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('jobs')}
            className={`pb-3 px-4 text-xs font-bold transition-all relative ${
              activeTab === 'jobs'
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            My Job Postings ({myJobs.length})
            {activeTab === 'jobs' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('applications')}
            className={`pb-3 px-4 text-xs font-bold transition-all relative ${
              activeTab === 'applications'
                ? 'text-indigo-600'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Candidates & Applications ({applications.length})
            {activeTab === 'applications' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-t-full"></span>
            )}
          </button>
        </div>

        {/* Content based on Active Tab */}
        {loading ? (
          <div className="py-20 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          </div>
        ) : activeTab === 'jobs' ? (
          
          /* Tab 1: Job Postings */
          <div className="space-y-4">
            {myJobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Briefcase className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No jobs posted yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Get started by posting your first job opening to start receiving candidates.
                </p>
                <button
                  onClick={() => setPostModalOpen(true)}
                  className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
                >
                  Post a Job Now
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50/80 text-slate-500 font-semibold border-b border-slate-200/80">
                      <tr>
                        <th className="py-3.5 px-4">Role Title</th>
                        <th className="py-3.5 px-4">Type & Exp</th>
                        <th className="py-3.5 px-4">Location</th>
                        <th className="py-3.5 px-4">Applicants</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4">Date Posted</th>
                        <th className="py-3.5 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {myJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-3.5 px-4 font-bold text-slate-900">
                            {job.title}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            <span className="font-medium">{job.job_type}</span> • {job.experience_level}
                          </td>
                          <td className="py-3.5 px-4 text-slate-600">
                            {job.location}
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => {
                                setSelectedJobFilter(job.id.toString());
                                setActiveTab('applications');
                              }}
                              className="inline-flex items-center gap-1 font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-2.5 py-1 rounded-lg"
                            >
                              <Users className="w-3 h-3" />
                              {job.applications_count || 0} candidate(s)
                            </button>
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => handleToggleActive(job)}
                              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all ${
                                job.is_active
                                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                  : 'bg-slate-100 text-slate-500 border border-slate-200'
                              }`}
                            >
                              {job.is_active ? 'Active' : 'Closed'}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-slate-400">
                            {new Date(job.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3.5 px-4 text-right space-x-2">
                            <button
                              onClick={() => handleDeleteJob(job.id)}
                              title="Delete Job"
                              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

        ) : (
          
          /* Tab 2: Applications Inbox */
          <div className="space-y-4">
            
            {/* Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2">
                  <Filter className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-xs font-semibold text-slate-600">Filter Job:</span>
                  <select
                    value={selectedJobFilter}
                    onChange={(e) => setSelectedJobFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-slate-50/50"
                  >
                    <option value="All">All Jobs ({applications.length})</option>
                    {myJobs.map(j => (
                      <option key={j.id} value={j.id.toString()}>{j.title}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-600">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-2.5 py-1.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 bg-slate-50/50"
                  >
                    <option value="All">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
              </div>

              <span className="text-xs text-slate-400">
                Showing {filteredApplications.length} candidate{filteredApplications.length === 1 ? '' : 's'}
              </span>
            </div>

            {/* Applications List */}
            {filteredApplications.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No applications found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No candidates have applied under the selected filters yet.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map((app) => {
                  const resumeUrl = app.resume.startsWith('http') 
                    ? app.resume 
                    : `${SERVER_BASE_URL}${app.resume}`;

                  return (
                    <div
                      key={app.id}
                      className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm hover:border-indigo-200 transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        
                        {/* Candidate Identity */}
                        <div className="flex items-start gap-3">
                          <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm shrink-0">
                            {app.applicant_name?.[0] || app.applicant_username?.[0] || 'A'}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-bold text-slate-900">
                                {app.applicant_name || app.applicant_username}
                              </h4>
                              <StatusBadge status={app.status} />
                            </div>
                            <p className="text-xs text-indigo-600 font-medium mt-0.5">
                              Applied for: <span className="font-semibold text-slate-800">{app.job_title}</span>
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 mt-1">
                              {app.applicant_email && (
                                <span className="flex items-center gap-1">
                                  <Mail className="w-3 h-3" /> {app.applicant_email}
                                </span>
                              )}
                              {app.applicant_phone && (
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3 h-3" /> {app.applicant_phone}
                                </span>
                              )}
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" /> Applied on {new Date(app.applied_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Status Changer & Resume Button */}
                        <div className="flex items-center gap-2 sm:self-center shrink-0">
                          {/* Resume Download Link */}
                          <a
                            href={resumeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            View Resume
                          </a>

                          {/* Status Dropdown */}
                          <select
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                          >
                            <option value="pending">Pending</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="shortlisted">Shortlisted</option>
                            <option value="accepted">Accepted</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </div>

                      </div>

                      {/* Cover letter & Portfolio (if provided) */}
                      {(app.cover_letter || app.portfolio_url) && (
                        <div className="pt-3 border-t border-slate-100 text-xs space-y-2">
                          {app.portfolio_url && (
                            <p className="flex items-center gap-1 text-slate-600">
                              <span className="font-semibold text-slate-700">Portfolio:</span>
                              <a
                                href={app.portfolio_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-indigo-600 hover:underline flex items-center gap-1"
                              >
                                {app.portfolio_url}
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </p>
                          )}
                          {app.cover_letter && (
                            <div className="p-3 bg-slate-50 rounded-xl text-slate-600 text-xs">
                              <span className="font-semibold text-slate-700 block mb-1">Cover Note:</span>
                              <p className="whitespace-pre-line leading-relaxed">{app.cover_letter}</p>
                            </div>
                          )}
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        )}

      </div>

      {/* Post Job Modal */}
      {postModalOpen && (
        <PostJobModal
          onClose={() => setPostModalOpen(false)}
          onCreated={() => {
            loadDashboardData();
          }}
        />
      )}

    </div>
  );
}
