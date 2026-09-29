import React, { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, Sparkles, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';
import JobCard from '../components/JobCard';
import JobFilters from '../components/JobFilters';
import ApplyModal from '../components/ApplyModal';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function HomePage() {
  const { isAuthenticated, isApplicant } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters state
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    job_type: 'All',
    experience_level: 'All',
  });

  // Apply modal state
  const [selectedJobForApply, setSelectedJobForApply] = useState(null);

  // Fetch jobs whenever filters change
  useEffect(() => {
    fetchJobs();
  }, [filters]);

  const fetchJobs = async () => {
    setLoading(true);
    setError('');
    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.location) params.location = filters.location;
      if (filters.job_type && filters.job_type !== 'All') params.job_type = filters.job_type;
      if (filters.experience_level && filters.experience_level !== 'All') params.experience_level = filters.experience_level;

      const res = await api.get('/jobs/', { params });
      setJobs(res.data);
    } catch (err) {
      console.error(err);
      setError('Unable to load jobs. Please verify your backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      location: '',
      job_type: 'All',
      experience_level: 'All',
    });
  };

  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isApplicant) {
      alert('You are logged in as an Employer / Hirer. Please switch to or register an Applicant account to apply for jobs.');
      return;
    }
    setSelectedJobForApply(job);
  };

  return (
    <div className="min-h-screen pb-16">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50/70 via-white to-slate-50 border-b border-slate-200/60 pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100/80 text-indigo-700 text-xs font-semibold mb-6 border border-indigo-200/60 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            Connecting Ambition with Opportunity
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight max-w-3xl mx-auto leading-tight sm:leading-tight">
            Discover Your Next Career Move at <span className="bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">Top Tech Companies</span>
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Browse through hundreds of curated full-time, remote, and internship roles. Apply directly with your resume or post openings as a hiring manager.
          </p>

          {/* Quick Hero Search Bar */}
          <div className="mt-8 max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-lg shadow-indigo-100/50 border border-slate-200/80 flex flex-col sm:flex-row items-center gap-2">
            <div className="flex items-center gap-2 w-full px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-slate-100">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="Job title, skills, or company..."
                value={filters.search}
                onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
                className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <div className="flex items-center gap-2 w-full px-3 py-1.5">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                type="text"
                placeholder="City or 'Remote'..."
                value={filters.location}
                onChange={(e) => setFilters(f => ({ ...f, location: e.target.value }))}
                className="w-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none bg-transparent"
              />
            </div>

            <button
              onClick={fetchJobs}
              className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-sm hover:shadow transition-all shrink-0"
            >
              Search
            </button>
          </div>

          {/* Popular Search tags */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span>Popular:</span>
            {['React', 'Python', 'Remote', 'Django', 'Internship'].map((tag) => (
              <button
                key={tag}
                onClick={() => setFilters(f => ({ ...f, search: tag }))}
                className="px-2.5 py-1 rounded-full bg-white hover:bg-indigo-50 hover:text-indigo-600 border border-slate-200 transition-colors"
              >
                {tag}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Left Column: Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-20">
              <JobFilters
                filters={filters}
                setFilters={setFilters}
                onReset={handleResetFilters}
              />
            </div>
          </div>

          {/* Right Column: Job Listings */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Featured Opportunities
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {jobs.length} open position{jobs.length === 1 ? '' : 's'}
                </p>
              </div>
            </div>

            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 mb-6">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                      <div className="space-y-2 flex-1">
                        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                      </div>
                    </div>
                    <div className="h-8 bg-slate-100 rounded"></div>
                    <div className="h-10 bg-slate-100 rounded"></div>
                  </div>
                ))}
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                  <Briefcase className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">No jobs match your criteria</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try adjusting your search terms or clearing filters to see more results.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-4 py-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {jobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    onApplyClick={handleApplyClick}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Apply Modal */}
      {selectedJobForApply && (
        <ApplyModal
          job={selectedJobForApply}
          onClose={() => setSelectedJobForApply(null)}
          onSuccess={() => {
            fetchJobs();
          }}
        />
      )}

    </div>
  );
}
