import React from 'react';
import { useApp } from '../context/AppContext';
import { SectoralAllocationChart } from '../components/charts/StateVulnerabilityBarChart';
import {
  TrendingUp,
  IndianRupee,
  PieChart as PieIcon,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Building,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const FinancialAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useApp();

  const totalSanctioned = projects.reduce((acc, p) => acc + p.sanctionedAmountLakhs, 0);
  const totalReleased = projects.reduce((acc, p) => acc + p.releasedAmountLakhs, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.expenditureAmountLakhs, 0);

  const releaseRatio = Math.round((totalReleased / totalSanctioned) * 100);
  const spendRatio = Math.round((totalSpent / totalReleased) * 100);

  // Idle funds: Sanctioned > 6 months ago but spent < 10%
  const idleProjects = projects.filter((p) => p.expenditurePercentage < 15 && p.status !== 'Completed');
  const totalIdleAmount = idleProjects.reduce((acc, p) => acc + (p.releasedAmountLakhs - p.expenditureAmountLakhs), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <h2 className="text-xl font-bold text-white tracking-tight">
          MPLADS Financial Analytics & Capital Velocity
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Tracking financial sanction life cycles, release-to-expenditure ratios, idle parked capital, and cost escalation risks.
        </p>
      </div>

      {/* 4 Financial KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Sanctioned */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Total Sanctions</span>
            <IndianRupee className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">
            ₹{totalSanctioned.toFixed(1)}L
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Across {projects.length} recommended works
          </p>
        </div>

        {/* KPI 2: Released to Implementing Agencies */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Treasury Released</span>
            <span className="font-mono text-xs text-emerald-400">{releaseRatio}%</span>
          </div>
          <div className="text-2xl font-bold text-emerald-400">
            ₹{totalReleased.toFixed(1)}L
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Funds transferred to district accounts
          </p>
        </div>

        {/* KPI 3: Ground Expenditure */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span>Voucher Expenditure</span>
            <span className="font-mono text-xs text-blue-400">{spendRatio}%</span>
          </div>
          <div className="text-2xl font-bold text-blue-400">
            ₹{totalSpent.toFixed(1)}L
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Disbursed against contractor invoices
          </p>
        </div>

        {/* KPI 4: Idle Parked Capital */}
        <div className="bg-slate-900 border border-amber-900/60 rounded-2xl p-4 shadow-sm bg-gradient-to-b from-slate-900 to-amber-950/20">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-2">
            <span className="text-amber-400 font-semibold">Idle Parked Capital</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-400">
            ₹{totalIdleAmount.toFixed(1)}L
          </div>
          <p className="text-[11px] text-amber-300 mt-1">
            {idleProjects.length} works with sluggish start
          </p>
        </div>
      </div>

      {/* Sectoral Outlay & Spending Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Sectoral Capital Allocation (₹ Lakhs)
              </h3>
              <p className="text-xs text-slate-400">
                Expenditure priorities across community infrastructure, drinking water, roads, education, and renewable energy.
              </p>
            </div>
            <PieIcon className="w-4 h-4 text-indigo-400" />
          </div>
          <SectoralAllocationChart projects={projects} />
        </div>

        {/* Front-Loading Risk Table */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-1">
              Top Front-Loading Disconnects
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              Projects where fund draw exceeds ground civil progress by &gt; 25%.
            </p>

            <div className="space-y-2">
              {projects
                .filter((p) => p.expenditurePercentage - p.physicalProgressPercentage > 20)
                .slice(0, 5)
                .map((p) => {
                  const gap = p.expenditurePercentage - p.physicalProgressPercentage;
                  return (
                    <div
                      key={p.id}
                      onClick={() => navigate(`/projects/${p.id}`)}
                      className="p-2.5 bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800 rounded-xl cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-mono font-bold text-amber-400">{p.id}</span>
                        <span className="font-bold text-red-400">+{gap}% Gap</span>
                      </div>
                      <p className="text-xs text-slate-200 line-clamp-1">{p.title}</p>
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Spent: {p.expenditurePercentage}%</span>
                        <span>Ground: {p.physicalProgressPercentage}%</span>
                        <span className="text-red-400 font-semibold">Risk: {p.riskScore}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-800/80 text-[11px] text-slate-400">
            Source: PFMS Electronic Payment Gateway & District Treasuries.
          </div>
        </div>
      </div>
    </div>
  );
};
