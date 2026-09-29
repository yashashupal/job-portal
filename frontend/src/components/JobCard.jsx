import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, MapPin, IndianRupee, Clock, 
  Briefcase, CheckCircle2, ChevronRight 
} from 'lucide-react';

export default function JobCard({ job, onApplyClick }) {
  // Format salary
  const formatSalary = () => {
    if (!job.salary_min && !job.salary_max) return 'Undisclosed';
    const min = job.salary_min ? `₹${(job.salary_min / 100000).toFixed(1)}L` : '';
    const max = job.salary_max ? `₹${(job.salary_max / 100000).toFixed(1)}L` : '';
    if (min && max) return `${min} - ${max} / year`;
    return min ? `From ${min} / year` : `Up to ${max} / year`;
  };

  // Get job type style
  const getJobTypeBadge = (type) => {
    switch (type) {
      case 'Remote':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Full-time':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'Part-time':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Internship':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const initial = job.company?.[0]?.toUpperCase() || 'C';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm hover:shadow-md hover:border-indigo-300/80 transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Top Header: Company Avatar & Badges */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center justify-center font-bold text-slate-700 text-lg shadow-inner group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-200 transition-colors">
              {initial}
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                {job.company}
              </h4>
              <Link
                to={`/jobs/${job.id}`}
                className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1"
              >
                {job.title}
              </Link>
            </div>
          </div>

          {job.has_applied && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Applied
            </span>
          )}
        </div>

        {/* Location & Salary Info */}
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-4 py-2 border-y border-slate-100">
          <div className="flex items-center gap-1.5 truncate">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{job.location}</span>
          </div>
          <div className="flex items-center gap-1.5 font-medium text-slate-900 truncate">
            <IndianRupee className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{formatSalary()}</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getJobTypeBadge(job.job_type)}`}>
            {job.job_type}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
            {job.experience_level}
          </span>
        </div>

        {/* Short Description */}
        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
          {job.description}
        </p>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-xs text-slate-400 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {new Date(job.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </span>

        <div className="flex items-center gap-2">
          <Link
            to={`/jobs/${job.id}`}
            className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 hover:bg-slate-50 rounded-lg transition-colors inline-flex items-center gap-1"
          >
            Details
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>

          {!job.has_applied && (
            <button
              onClick={() => onApplyClick(job)}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm hover:shadow transition-all"
            >
              Apply Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
