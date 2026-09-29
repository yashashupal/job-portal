import React from 'react';
import { Search, MapPin, Filter, RotateCcw } from 'lucide-react';

const JOB_TYPES = ['All', 'Full-time', 'Remote', 'Part-time', 'Internship', 'Contract'];
const EXP_LEVELS = ['All', 'Entry Level', 'Mid Level', 'Senior Level', 'Lead / Executive'];

export default function JobFilters({ filters, setFilters, onReset }) {
  const handleChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
          <Filter className="w-4 h-4 text-indigo-600" />
          Filter Jobs
        </h3>
        <button
          onClick={onReset}
          className="text-xs font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Keyword Search */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Search Keywords
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Title, skill, or company..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50"
          />
        </div>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-1.5">
          Location
        </label>
        <div className="relative">
          <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="e.g. Remote, Bengaluru, Mumbai"
            value={filters.location}
            onChange={(e) => handleChange('location', e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-slate-50/50"
          />
        </div>
      </div>

      {/* Job Type Options */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          Job Type
        </label>
        <div className="flex flex-wrap gap-1.5">
          {JOB_TYPES.map((type) => {
            const isSelected = filters.job_type === type;
            return (
              <button
                key={type}
                type="button"
                onClick={() => handleChange('job_type', type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      {/* Experience Level Options */}
      <div>
        <label className="block text-xs font-semibold text-slate-600 mb-2">
          Experience Level
        </label>
        <div className="space-y-1">
          {EXP_LEVELS.map((level) => {
            const isSelected = filters.experience_level === level;
            return (
              <label
                key={level}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                  isSelected ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <input
                  type="radio"
                  name="exp_level"
                  checked={isSelected}
                  onChange={() => handleChange('experience_level', level)}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
                <span>{level}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
}
