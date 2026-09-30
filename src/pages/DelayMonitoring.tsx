import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { RiskBadge } from '../components/common/RiskBadge';
import {
  Clock,
  AlertTriangle,
  Building,
  CheckCircle2,
  Calendar,
  Hourglass,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const DelayMonitoring: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useApp();
  const [selectedSector, setSelectedSector] = useState<string>('All');

  // Sectoral average delays
  const sectorDelays: { [sector: string]: { totalDelay: number; count: number } } = {};
  projects.forEach((p) => {
    if (!sectorDelays[p.category]) sectorDelays[p.category] = { totalDelay: 0, count: 0 };
    sectorDelays[p.category].totalDelay += p.delayDays;
    sectorDelays[p.category].count++;
  });

  const sectorSummary = Object.keys(sectorDelays).map((cat) => ({
    category: cat,
    avgDelay: Math.round(sectorDelays[cat].totalDelay / sectorDelays[cat].count),
    count: sectorDelays[cat].count,
  })).sort((a, b) => b.avgDelay - a.avgDelay);

  // Agency bottleneck rankings
  const agencyDelays: { [agency: string]: { totalDelay: number; count: number; criticalCount: number } } = {};
  projects.forEach((p) => {
    const ag = p.implementingAgency;
    if (!agencyDelays[ag]) agencyDelays[ag] = { totalDelay: 0, count: 0, criticalCount: 0 };
    agencyDelays[ag].totalDelay += p.delayDays;
    agencyDelays[ag].count++;
    if (p.riskTier === 'Critical') agencyDelays[ag].criticalCount++;
  });

  const agencySummary = Object.keys(agencyDelays).map((ag) => ({
    agency: ag,
    avgDelay: Math.round(agencyDelays[ag].totalDelay / agencyDelays[ag].count),
    worksCount: agencyDelays[ag].count,
    criticalCount: agencyDelays[ag].criticalCount,
  })).sort((a, b) => b.avgDelay - a.avgDelay).slice(0, 5);

  const delayedProjects = projects
    .filter((p) => selectedSector === 'All' || p.category === selectedSector)
    .sort((a, b) => b.delayDays - a.delayDays);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Hourglass className="w-3.5 h-3.5" />
              Machine Learning Predictive Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Execution Delay & Critical Path Surveillance
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Survival analysis and historical gradient boosting models predicting milestone completion slippage, contractor bottlenecks, and procurement lead times.
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[10px]">National Avg Delay:</span>
          <span className="font-mono font-bold text-red-400 text-base">+78.4 Days</span>
        </div>
      </div>

      {/* Sectoral Breakdown Cards */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">
          Sectoral Average Timeline Overruns
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
          {sectorSummary.slice(0, 4).map((s) => (
            <div
              key={s.category}
              className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-1"
            >
              <span className="text-[11px] text-slate-400 block truncate">{s.category}</span>
              <div className="text-xl font-bold text-red-400">+{s.avgDelay} Days</div>
              <p className="text-[10px] text-slate-500">Across {s.count} sanctioned works</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Agency Bottlenecks & Delayed List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Agency Bottleneck Analysis */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            <span>High-Friction Executing Agencies</span>
          </h3>
          <p className="text-xs text-slate-400">
            Ranked by average days delayed past approved target completion dates.
          </p>

          <div className="space-y-2.5 pt-1">
            {agencySummary.map((ag, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 space-y-1.5"
              >
                <div className="flex justify-between items-start text-xs">
                  <h4 className="font-bold text-slate-200 line-clamp-1">{ag.agency}</h4>
                  <span className="font-mono font-bold text-red-400 whitespace-nowrap">
                    +{ag.avgDelay}d avg
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400">
                  <span>Active Works: {ag.worksCount}</span>
                  <span className="text-red-400 font-semibold">{ag.criticalCount} in Critical Review</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Delayed Projects Queue */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">
              Critical Timeline Overruns Queue
            </h3>
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-2.5 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none"
            >
              <option value="All">All Sectors</option>
              {sectorSummary.map((s) => (
                <option key={s.category} value={s.category}>
                  {s.category}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
            {delayedProjects.slice(0, 8).map((p) => (
              <div
                key={p.id}
                onClick={() => navigate(`/projects/${p.id}`)}
                className="p-3 bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800 rounded-xl cursor-pointer transition-colors flex items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5 max-w-md">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">{p.id}</span>
                    <span className="font-semibold text-slate-200 line-clamp-1">{p.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Target: {p.targetCompletionDate} • Forecast: {p.forecastCompletionDate}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <span className="font-bold text-red-400 text-sm block">+{p.delayDays}d</span>
                    <span className="text-[10px] text-slate-500">Overdue</span>
                  </div>
                  <RiskBadge tier={p.riskTier} score={p.riskScore} size="sm" />
                  <ArrowRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
