import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Building2, MapPin, IndianRupee, Clock, Calendar, 
  Globe, CheckCircle2, ArrowLeft, Briefcase, Share2, 
  ShieldCheck, Loader2, AlertCircle 
} from 'lucide-react';
import api from '../api/axios';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';

export default function JobDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, isApplicant } = useAuth();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applyModalOpen, setApplyModalOpen] = useState(false);

  useEffect(() => {
    fetchJobDetail();
  }, [id]);

  const fetchJobDetail = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/jobs/${id}/`);
      setJob(res.data);
    } catch (err) {
      console.error(err);
      setError('Job details could not be loaded or this job is no longer active.');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isApplicant) {
      alert('You are logged in as an Employer. Only candidates registered as Job Seekers can apply for jobs.');
      return;
    }
    setApplyModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800">Job Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This job does not exist.'}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 rounded-xl"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to All Jobs
        </Link>
      </div>
    );
  }

  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return 'Salary Undisclosed';
    const min = job.salary_min ? `₹${(job.salary_min / 100000).toFixed(1)} Lakhs` : '';
    const max = job.salary_max ? `₹${(job.salary_max / 100000).toFixed(1)} Lakhs` : '';
    if (min && max) return `${min} - ${max} / year`;
    return min ? `From ${min} / year` : `Up to ${max} / year`;
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Back Link */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to all openings
        </Link>

        {/* Top Header Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-extrabold text-2xl shadow-sm shrink-0">
                {job.company?.[0]?.toUpperCase() || 'C'}
              </div>
              <div className="space-y-1">
                <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                  {job.company}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 leading-tight">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <IndianRupee className="w-3.5 h-3.5 text-slate-400" />
                    {formatSalary()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Apply CTA Box */}
            <div className="sm:text-right shrink-0">
              {job.has_applied ? (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" />
                  Application Submitted
                </div>
              ) : (
                <button
                  onClick={handleApplyClick}
                  className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all"
                >
                  Apply For This Job
                </button>
              )}
            </div>

          </div>

          {/* Quick Badges */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-indigo-700 border border-indigo-200">
              {job.job_type}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
              {job.experience_level}
            </span>
            {job.deadline && (
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Apply by {new Date(job.deadline).toLocaleDateString()}
              </span>
            )}
            <span className="text-xs text-slate-400 ml-auto">
              {job.applications_count || 0} candidate(s) applied
            </span>
          </div>
        </div>

        {/* Two-Column Details Body */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Description & Requirements */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Description */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                About the Opportunity
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-3">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                Responsibilities & Requirements
              </h2>
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {job.requirements}
              </div>
            </div>

            {/* Benefits */}
            {job.benefits && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-3">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
                  Perks & Benefits
                </h2>
                <div className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {job.benefits}
                </div>
              </div>
            )}

          </div>

          {/* Right Sidebar: Company Card */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                About the Hiring Employer
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <p className="font-semibold text-slate-900 text-sm">{job.company}</p>
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {job.location}
                </p>
                {job.employer_email && (
                  <p className="text-slate-500">Contact: {job.employer_email}</p>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <div className="p-3 bg-indigo-50/50 rounded-xl text-xs text-indigo-900 space-y-1">
                  <p className="font-semibold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                    Verified Employer
                  </p>
                  <p className="text-[11px] text-slate-500">
                    This employer is actively reviewing candidates for this opening.
                  </p>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <ApplyModal
          job={job}
          onClose={() => setApplyModalOpen(false)}
          onSuccess={() => {
            fetchJobDetail();
          }}
        />
      )}

    </div>
  );
}
