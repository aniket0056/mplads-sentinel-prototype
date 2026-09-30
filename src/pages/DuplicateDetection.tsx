import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { useNavigate } from 'react-router-dom';
import {
  Copy,
  AlertOctagon,
  MapPin,
  CheckCircle2,
  FileCheck2,
  ExternalLink,
  ShieldCheck,
  Check,
  ArrowRight,
} from 'lucide-react';

export const DuplicateDetection: React.FC = () => {
  const navigate = useNavigate();
  const { projects, addAuditEntry, currentUserRole, createOrUpdateCase } = useApp();

  // Find all projects with duplicate matches
  const duplicatePairs = projects.filter((p) => p.duplicateMatch);

  const [selectedProjectId, setSelectedProjectId] = useState<string>(
    duplicatePairs[0]?.id || 'MPL-2026-1021'
  );
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const currentProject = projects.find((p) => p.id === selectedProjectId) || duplicatePairs[0];
  const matchedProject = projects.find((p) => p.id === currentProject?.duplicateMatch?.matchedProjectId);

  const handleResolveAction = (status: string) => {
    addAuditEntry({
      actor: currentUserRole,
      role: currentUserRole,
      action: `Duplicate Review Adjudication: ${status}`,
      category: 'Investigation',
      details: `Adjudicated duplicate work match between ${currentProject.id} and ${matchedProject?.id} as: ${status}.`,
      targetId: currentProject.id,
      severity: 'Warning',
    });

    createOrUpdateCase({
      projectId: currentProject.id,
      projectTitle: currentProject.title,
      riskCategory: 'Duplicate Work Review',
      status: 'Under Review',
      notes: `Review initiated for potential duplication with ${matchedProject?.id}. Action: ${status}`,
    });

    setActionMessage(`Adjudication registered: ${status}`);
    setTimeout(() => setActionMessage(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Copy className="w-3.5 h-3.5" />
              Geospatial & Textual Similarity Engine
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Duplicate Work & Scheme Overlap Radar
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Cross-referencing historical assets, PMGSY, State PWD, and municipal registries to identify potential overlapping works and avoid duplicate funding of identical roads, water pipes, or community buildings.
          </p>
        </div>

        {actionMessage && (
          <div className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{actionMessage}</span>
          </div>
        )}
      </div>

      {/* Duplicate Pairs Selector Bar */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
          Detected Potential Duplicate Pairs ({duplicatePairs.length} Incidents)
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {duplicatePairs.map((p) => {
            const isSelected = selectedProjectId === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all space-y-1 ${
                  isSelected
                    ? 'bg-slate-800 border-amber-500 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-slate-900 border-slate-800 hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono font-bold text-amber-400">{p.id}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-950 text-amber-300 border border-amber-800">
                    {p.duplicateMatch?.similarityScore}% Match
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-1">{p.title}</h4>
                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                  <span>Dist: {p.duplicateMatch?.breakdown.geoProximityMeters}m</span>
                  <span>{p.district}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Side-by-Side Comparison Studio */}
      {currentProject && matchedProject && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                <span>Side-by-Side Comparative Review Matrix</span>
              </h3>
              <p className="text-xs text-slate-400">
                Evaluating physical proximity, title token overlap, and implementing agency alignments.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Proximity:</span>
              <span className="font-mono font-bold text-amber-400 bg-amber-950 px-2.5 py-1 rounded border border-amber-800 text-xs">
                {currentProject.duplicateMatch?.breakdown.geoProximityMeters} meters away
              </span>
            </div>
          </div>

          {/* 2-Column Comparison Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Column 1: Current Flagged Work */}
            <div className="bg-slate-950/80 border border-amber-900/50 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded text-xs border border-slate-800">
                  {currentProject.id} (Proposed / Newly Sanctioned)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-950 text-red-400 border border-red-800">
                  Risk Score: {currentProject.riskScore}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {currentProject.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {currentProject.description}
                </p>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                <div className="flex justify-between text-slate-400">
                  <span>Sanction Outlay:</span>
                  <span className="font-bold text-white">₹{currentProject.sanctionedAmountLakhs} Lakhs</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Financial Year:</span>
                  <span className="text-slate-200">FY {currentProject.financialYear}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GPS Coordinates:</span>
                  <span className="font-mono text-slate-200">
                    {currentProject.location.lat.toFixed(4)}° N, {currentProject.location.lng.toFixed(4)}° E
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Executing Agency:</span>
                  <span className="text-slate-200">{currentProject.implementingAgency}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Contractor:</span>
                  <span className="text-slate-200 font-semibold">{currentProject.contractorName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fund Utilization vs Progress:</span>
                  <span className="text-amber-400 font-bold">
                    {currentProject.expenditurePercentage}% spent / {currentProject.physicalProgressPercentage}% progress
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/projects/${currentProject.id}`)}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Risk Analysis</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Column 2: Prior Matched Asset */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-amber-400 bg-slate-900 px-2.5 py-1 rounded text-xs border border-slate-800">
                  {matchedProject.id} (Historical / Parallel Work)
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  Status: {matchedProject.status}
                </span>
              </div>

              <div>
                <h4 className="text-sm font-bold text-white leading-snug">
                  {matchedProject.title}
                </h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {matchedProject.description}
                </p>
              </div>

              <div className="space-y-2 text-xs border-t border-slate-800/80 pt-3">
                <div className="flex justify-between text-slate-400">
                  <span>Sanction Outlay:</span>
                  <span className="font-bold text-white">₹{matchedProject.sanctionedAmountLakhs} Lakhs</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Financial Year:</span>
                  <span className="text-slate-200">FY {matchedProject.financialYear}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>GPS Coordinates:</span>
                  <span className="font-mono text-slate-200">
                    {matchedProject.location.lat.toFixed(4)}° N, {matchedProject.location.lng.toFixed(4)}° E
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Executing Agency:</span>
                  <span className="text-slate-200">{matchedProject.implementingAgency}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Contractor:</span>
                  <span className="text-slate-200 font-semibold">{matchedProject.contractorName}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Fund Utilization vs Progress:</span>
                  <span className="text-emerald-400 font-bold">
                    {matchedProject.expenditurePercentage}% spent / {matchedProject.physicalProgressPercentage}% progress
                  </span>
                </div>
              </div>

              <button
                onClick={() => navigate(`/projects/${matchedProject.id}`)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>View Historical Record</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Adjudication Action Bar */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-300 font-medium">
              Administrative Review Adjudication:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => handleResolveAction('Potential Duplicate — Review Required')}
                className="px-3.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors shadow-sm"
              >
                Flag for Detailed Review
              </button>
              <button
                onClick={() => handleResolveAction('Physical Ground Re-Survey Ordered')}
                className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-semibold rounded-lg transition-colors"
              >
                Order On-Site GPS Re-Survey
              </button>
              <button
                onClick={() => handleResolveAction('Cleared — Legitimate Distinct Phase')}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700"
              >
                Verify as Distinct Phase
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
