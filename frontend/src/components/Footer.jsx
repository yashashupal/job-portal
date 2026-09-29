import React from 'react';
import { Briefcase, Heart, Globe, Shield, Sparkles } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <Briefcase className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold text-slate-900">JobPortal</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed">
              A modern hiring platform connecting ambitious talent with fast-growing companies. Find your dream job or hire top-tier talent with ease.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">For Candidates</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="/" className="hover:text-indigo-600 transition-colors">Browse All Jobs</a></li>
              <li><a href="/applicant/dashboard" className="hover:text-indigo-600 transition-colors">Applied Jobs</a></li>
              <li><span className="text-slate-400">Career Advice (Coming soon)</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">For Employers</h4>
            <ul className="space-y-2 text-sm text-slate-600">
              <li><a href="/hirer/dashboard?tab=post" className="hover:text-indigo-600 transition-colors">Post a Job Opening</a></li>
              <li><a href="/hirer/dashboard" className="hover:text-indigo-600 transition-colors">Manage Candidates</a></li>
              <li><a href="/hirer/dashboard" className="hover:text-indigo-600 transition-colors">Hiring Dashboard</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} JobPortal. Built with Django REST Framework & React.</p>
          <div className="flex items-center gap-2">
            <span>Clean, fast & responsive experience</span>
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
