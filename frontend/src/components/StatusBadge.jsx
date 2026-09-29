import React from 'react';
import { Clock, Eye, CheckCircle2, XCircle, Award } from 'lucide-react';

const statusConfig = {
  pending: {
    label: 'Pending Review',
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    icon: Clock,
  },
  reviewed: {
    label: 'Reviewed',
    bg: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Eye,
  },
  shortlisted: {
    label: 'Shortlisted',
    bg: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Award,
  },
  accepted: {
    label: 'Accepted',
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    icon: CheckCircle2,
  },
  rejected: {
    label: 'Rejected',
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    icon: XCircle,
  },
};

export default function StatusBadge({ status }) {
  const current = statusConfig[status] || {
    label: status,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
    icon: Clock,
  };
  const Icon = current.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${current.bg} shadow-sm transition-all`}
    >
      <Icon className="w-3.5 h-3.5" />
      {current.label}
    </span>
  );
}
