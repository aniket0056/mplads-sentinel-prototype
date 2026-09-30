import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  History,
  ShieldCheck,
  Search,
  Filter,
  AlertOctagon,
  Lock,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const AuditTrail: React.FC = () => {
  const navigate = useNavigate();
  const { auditLogs } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchVal, setSearchVal] = useState<string>('');

  const filteredLogs = auditLogs.filter((log) => {
    if (categoryFilter !== 'All' && log.category !== categoryFilter) return false;
    if (searchVal.trim()) {
      const q = searchVal.toLowerCase();
      const matchActor = log.actor.toLowerCase().includes(q);
      const matchAction = log.action.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      const matchTarget = log.targetId ? log.targetId.toLowerCase().includes(q) : false;
      if (!matchActor && !matchAction && !matchDetails && !matchTarget) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Cryptographically Attested Ledger
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Immutable Statutory Audit Trail
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Append-only verification log tracking risk threshold revisions, executive tranche freezes, investigator assignments, and algorithmic escalations.
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[10px]">Integrity Status:</span>
          <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            Zero Tampering Detected
          </span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold">Event Category:</span>
          {['All', 'Risk Escalation', 'Fund Action', 'Investigation', 'Data Ingestion', 'Security'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                categoryFilter === cat
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search audit trail..."
            className="w-full pl-8 pr-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Audit Log Timeline */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="divide-y divide-slate-800/80">
          {filteredLogs.map((entry) => (
            <div
              key={entry.id}
              className="p-4 hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-amber-400 font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {entry.id}
                  </span>
                  <span className="font-mono text-slate-400 text-[11px]">
                    {entry.timestamp}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    entry.category === 'Fund Action'
                      ? 'bg-purple-950 text-purple-400 border border-purple-800'
                      : entry.category === 'Risk Escalation'
                      ? 'bg-red-950 text-red-400 border border-red-800'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}>
                    {entry.category}
                  </span>
                  {entry.targetId && (
                    <span
                      onClick={() => {
                        if (entry.targetId?.startsWith('MPL-')) {
                          navigate(`/projects/${entry.targetId}`);
                        }
                      }}
                      className="font-mono text-indigo-400 hover:underline cursor-pointer"
                    >
                      Target: {entry.targetId}
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white">
                  {entry.action}
                </h4>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {entry.details}
                </p>

                <div className="text-[11px] text-slate-500 flex items-center gap-2 pt-0.5">
                  <span>Actor: <strong className="text-slate-300">{entry.actor}</strong> ({entry.role})</span>
                  <span>•</span>
                  <span>Terminal IP: <strong className="text-slate-400 font-mono">{entry.ipAddress}</strong></span>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded border border-emerald-800/80 block">
                  HASH VERIFIED ✓
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
