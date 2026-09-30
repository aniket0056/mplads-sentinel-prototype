import React from 'react';
import { RiskTier } from '../../types/project';
import { AlertTriangle, AlertOctagon, CheckCircle2, Info } from 'lucide-react';

interface RiskBadgeProps {
  tier: RiskTier;
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  tier,
  score,
  size = 'md',
  showIcon = true,
}) => {
  const styles = {
    Critical: 'bg-red-50 text-red-700 border-red-200 ring-red-600/20',
    High: 'bg-amber-50 text-amber-700 border-amber-200 ring-amber-600/20',
    Medium: 'bg-yellow-50 text-yellow-800 border-yellow-200 ring-yellow-600/20',
    Low: 'bg-emerald-50 text-emerald-700 border-emerald-200 ring-emerald-600/20',
  }[tier];

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs font-semibold px-2.5 py-1',
    lg: 'text-sm font-bold px-3 py-1.5',
  }[size];

  const iconSize = size === 'sm' ? 12 : size === 'md' ? 14 : 16;

  const renderIcon = () => {
    if (!showIcon) return null;
    switch (tier) {
      case 'Critical':
        return <AlertOctagon size={iconSize} className="text-red-600 animate-pulse" />;
      case 'High':
        return <AlertTriangle size={iconSize} className="text-amber-600" />;
      case 'Medium':
        return <Info size={iconSize} className="text-yellow-700" />;
      case 'Low':
        return <CheckCircle2 size={iconSize} className="text-emerald-600" />;
    }
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ring-1 ring-inset ${styles} ${sizeClasses}`}
    >
      {renderIcon()}
      <span>
        {tier} Risk {score !== undefined ? `(${score})` : ''}
      </span>
    </span>
  );
};

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  let style = 'bg-slate-100 text-slate-700 border-slate-200';
  if (status === 'Completed') {
    style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  } else if (status === 'In Progress') {
    style = 'bg-blue-50 text-blue-700 border-blue-200';
  } else if (status === 'Delayed') {
    style = 'bg-amber-50 text-amber-700 border-amber-200';
  } else if (status === 'Critical Review') {
    style = 'bg-red-50 text-red-700 border-red-200';
  } else if (status === 'Suspended') {
    style = 'bg-purple-50 text-purple-700 border-purple-200';
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${style}`}>
      {status}
    </span>
  );
};
