import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SYSTEM_ANOMALY_CLUSTERS } from '../services/anomalyEngine';
import {
  Zap,
  AlertOctagon,
  TrendingDown,
  Clock,
  Building2,
  FileWarning,
  Eye,
  Snowflake,
  ExternalLink,
  ShieldAlert,
  CheckCircle,
} from 'lucide-react';

export const AnomalyDetection: React.FC = () => {
  const navigate = useNavigate();
  const { projects, freezeProjectTranche, addAuditEntry, currentUserRole } = useApp();
  const [selectedClusterId, setSelectedClusterId] = useState<string>('ALL');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Collect all individual anomalies across projects
  const allProjectAnomalies = projects.flatMap((p) =>
    p.anomalies.map((a) => ({
      ...a,
      project: p,
    }))
  );

  const filteredAnomalies = allProjectAnomalies.filter((item) => {
    if (selectedClusterId === 'FINANCIAL') return item.type === 'Financial Disconnect' || item.type === 'Velocity Spike';
    if (selectedClusterId === 'EXECUTION') return item.type === 'Missing Milestone';
    if (selectedClusterId === 'VENDOR') return item.type === 'Vendor Clustering';
    if (selectedClusterId === 'GHOST') return item.type === 'Ghost Asset Risk';
    if (selectedClusterId === 'GEO') return item.type === 'Geo Out-of-Bounds';
    return true;
  });

  const handleAction = (projectId: string, actionType: string) => {
    if (actionType === 'Freeze') {
      freezeProjectTranche(projectId);
      setActionNotice(`Tranche disbursement halted for ${projectId}. Treasury order issued.`);
    } else {
      addAuditEntry({
        actor: 'Vigilance Cell',
        role: currentUserRole,
        action: `Anomaly Investigation Initiated: ${actionType}`,
        category: 'Investigation',
        details: `Special inquiry ordered for ${projectId}.`,
        targetId: projectId,
        severity: 'Warning',
      });
      setActionNotice(`Action logged: ${actionType} for ${projectId}`);
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5" />
              Machine Learning Outlier Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Anomaly & Irregularity Detection Radar
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Autonomous detection of expenditure velocity spikes, March Rush disbursement patterns, contractor clustering, and physical verification discrepancies.
          </p>
        </div>

        {actionNotice && (
          <div className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-3 py-1.5 rounded-xl flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* Systemic Anomaly Clusters */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">
          Systemic Anomaly Archetypes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {SYSTEM_ANOMALY_CLUSTERS.map((cluster) => (
            <div
              key={cluster.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-mono text-[10px] text-amber-400">{cluster.id}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    cluster.severity === 'Critical' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {cluster.severity}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white leading-snug">
                  {cluster.title}
                </h4>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  {cluster.description}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-800/80 space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Affected Works:</span>
                  <span className="font-bold text-white">{cluster.affectedProjectsCount} Projects</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">At-Risk Capital:</span>
                  <span className="font-bold text-red-400">₹{cluster.totalAtRiskAmountLakhs} Lakhs</span>
                </div>
                <div className="text-[10px] text-amber-300/90 pt-1">
                  <strong>Remedy:</strong> {cluster.remedyAction}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-3">
        {[
          { label: 'All Anomalies', key: 'ALL' },
          { label: 'Financial Disconnects & March Rush', key: 'FINANCIAL' },
          { label: 'Chronic Delays & Milestones', key: 'EXECUTION' },
          { label: 'Vendor Collusion Clusters', key: 'VENDOR' },
          { label: 'Ghost Assets & Billing', key: 'GHOST' },
          { label: 'Geo Out-of-Bounds', key: 'GEO' },
        ].map(({ label, key }) => (
          <button
            key={key}
            onClick={() => setSelectedClusterId(key)}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedClusterId === key
                ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/20'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Detailed Flagged Anomalies Feed */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white">
          Active Anomaly Flags ({filteredAnomalies.length} Flagged Incidents)
        </h3>

        <div className="space-y-3">
          {filteredAnomalies.map((anom) => (
            <div
              key={anom.id}
              className={`bg-slate-900 border rounded-2xl p-4 shadow-sm transition-all ${
                anom.severity === 'Critical'
                  ? 'border-red-900/60 bg-gradient-to-r from-slate-900 via-slate-900 to-red-950/20'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {anom.project.id}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      anom.severity === 'Critical'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      {anom.severity} Severity
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {anom.type}
                    </span>
                    <span className="text-xs text-slate-400">
                      Detected: {anom.detectedAt}
                    </span>
                  </div>

                  <h4
                    onClick={() => navigate(`/projects/${anom.project.id}`)}
                    className="text-sm font-bold text-white hover:text-indigo-400 cursor-pointer"
                  >
                    {anom.project.title}
                  </h4>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {anom.description}
                  </p>

                  <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 text-[11px] text-slate-300 flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <strong className="text-slate-400">Diagnostic Metrics: </strong>
                      <span className="font-mono text-slate-100">{anom.metricComparison}</span>
                    </div>
                    <div className="text-[10px] text-indigo-400">
                      Flagged by: {anom.flaggedByModel}
                    </div>
                  </div>
                </div>

                {/* Quick Action Buttons */}
                <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                  <button
                    onClick={() => navigate(`/projects/${anom.project.id}`)}
                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>

                  <button
                    onClick={() => handleAction(anom.project.id, 'Freeze')}
                    className="px-3 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Snowflake className="w-3.5 h-3.5" />
                    <span>Freeze Tranche</span>
                  </button>

                  <button
                    onClick={() => handleAction(anom.project.id, 'Summon Contractor')}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Summon Agency</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
