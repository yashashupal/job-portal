import React, { useState } from 'react';
import { X, Upload, FileText, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ApplyModal({ job, onClose, onSuccess }) {
  const { isAuthenticated, isApplicant } = useAuth();
  const navigate = useNavigate();

  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isApplicant) {
      setError('Only candidates registered as Job Seekers / Applicants can apply for jobs.');
      return;
    }
    if (!resume) {
      setError('Please select and upload your resume file.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('cover_letter', coverLetter);
    if (portfolioUrl) {
      formData.append('portfolio_url', portfolioUrl);
    }

    try {
      await api.post(`/jobs/${job.id}/apply/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setSuccess(true);
      setTimeout(() => {
        if (onSuccess) onSuccess();
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      const detail = err.response?.data?.detail || 'Failed to submit application. Please try again.';
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-5">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
            Job Application
          </span>
          <h2 className="text-xl font-bold text-slate-900 mt-2">
            Apply to {job.title}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            {job.company} • {job.location} ({job.job_type})
          </p>
        </div>

        {/* Success Notice */}
        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Your resume and details have been sent to {job.company}. You can track this application in your dashboard.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Resume Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Upload Resume (PDF, DOC, DOCX) <span className="text-rose-500">*</span>
              </label>
              <div className="relative border-2 border-dashed border-slate-200 hover:border-indigo-400 rounded-xl p-4 text-center cursor-pointer transition-colors bg-slate-50/50">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx,.txt"
                  onChange={handleFileChange}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-1">
                  <div className="w-9 h-9 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Upload className="w-4 h-4" />
                  </div>
                  {resume ? (
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                      <FileText className="w-3.5 h-3.5" />
                      <span>{resume.name}</span>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs font-medium text-slate-700">
                        Click to browse or drag file here
                      </p>
                      <p className="text-[10px] text-slate-400">PDF, DOC, DOCX up to 10MB</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Portfolio / Website */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Portfolio or GitHub URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://github.com/yourusername"
                value={portfolioUrl}
                onChange={(e) => setPortfolioUrl(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            {/* Cover Letter */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Cover Note / Message to Hirer (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Explain why you are a great fit for this role..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 bg-slate-50/50"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm hover:shadow transition-all disabled:opacity-50"
              >
                {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                Submit Application
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
