import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { RiskBadge, StatusBadge } from '../components/common/RiskBadge';
import {
  ShieldAlert,
  AlertOctagon,
  Calendar,
  IndianRupee,
  Clock,
  MapPin,
  CheckCircle2,
  Copy,
  FileText,
  UserCheck,
  Snowflake,
  ExternalLink,
  Building,
  HardHat,
  ArrowLeft,
  ChevronRight,
  Info,
  Check,
} from 'lucide-react';

export const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { projects, freezeProjectTranche, createOrUpdateCase, currentUserRole } = useApp();

  // Find project or fallback to 1021
  const project = projects.find((p) => p.id === id) || projects.find((p) => p.id === 'MPL-2026-1021') || projects[0];

  const [assignedInvestigator, setAssignedInvestigator] = useState(
    project.assignedInvestigator || 'Shri Arvind Deshmukh (Addl. DM Vigilance)'
  );
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  const isTrancheFrozen = project.status === 'Suspended';

  const handleFreeze = () => {
    freezeProjectTranche(project.id);
    setActionSuccessMsg(`Subsequent tranche payment frozen for ${project.id}. Treasury notified.`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrUpdateCase({
      projectId: project.id,
      projectTitle: project.title,
      assignedOfficer: assignedInvestigator,
      status: 'Assigned',
      priority: 'Critical',
      notes: `Designated ${assignedInvestigator} to conduct ground physical verification for ${project.id}.`,
    });
    setShowAssignModal(false);
    setActionSuccessMsg(`Reviewing officer assigned: ${assignedInvestigator}`);
    setTimeout(() => setActionSuccessMsg(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb and Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <button
            onClick={() => navigate('/projects')}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Projects Registry</span>
          </button>
          <span>/</span>
          <span className="font-mono text-slate-200 font-bold">{project.id}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Action Success Alert */}
          {actionSuccessMsg && (
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              {actionSuccessMsg}
            </span>
          )}

          {/* Freeze Tranche Button */}
          <button
            onClick={handleFreeze}
            disabled={isTrancheFrozen}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
              isTrancheFrozen
                ? 'bg-purple-950 text-purple-300 border border-purple-800 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30'
            }`}
          >
            <Snowflake className="w-3.5 h-3.5" />
            <span>{isTrancheFrozen ? 'Tranche Frozen' : 'Freeze Subsequent Tranche'}</span>
          </button>

          {/* Assign Reviewing Officer Button */}
          <button
            onClick={() => setShowAssignModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
            <span>Assign Reviewing Officer</span>
          </button>

          {/* Export Project Dossier */}
          <button
            onClick={() => navigate(`/reports?focusId=${project.id}`)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Export Risk Dossier</span>
          </button>
        </div>
      </div>

      {/* Main Project Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="space-y-2 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono font-bold text-amber-400 bg-slate-950 px-2.5 py-1 rounded border border-slate-800 text-xs">
                {project.id}
              </span>
              <RiskBadge tier={project.riskTier} score={project.riskScore} size="md" />
              <StatusBadge status={project.status} />
              <span className="text-xs text-slate-400">
                FY {project.financialYear} • Sanction Date: {project.sanctionDate}
              </span>
            </div>

            <h1 className="text-lg sm:text-2xl font-bold text-white leading-tight">
              {project.title}
            </h1>

            <p className="text-xs text-slate-300 leading-relaxed">
              {project.description}
            </p>
          </div>

          {/* Large Risk Dial / Score Box */}
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center shrink-0 min-w-[170px] text-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Composite Risk Score
            </span>
            <div className="text-4xl font-extrabold text-red-500 my-1">
              {project.riskScore}
              <span className="text-sm font-normal text-slate-500"> /100</span>
            </div>
            <RiskBadge tier={project.riskTier} size="sm" />
            <span className="text-[10px] text-slate-400 mt-2">
              Formula: 30% Fin + 20% Dly + 20% Cost + 15% Dup + 10% Doc + 5% Geo
            </span>
          </div>
        </div>

        {/* 4 Core Vital Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Expenditure */}
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Fund Utilization</span>
              <IndianRupee className="w-3.5 h-3.5 text-blue-400" />
            </div>
            <div className="text-xl font-bold text-white">
              {project.expenditurePercentage}%
            </div>
            <p className="text-[11px] text-slate-400">
              ₹{project.expenditureAmountLakhs.toFixed(1)}L of ₹{project.sanctionedAmountLakhs.toFixed(1)}L
            </p>
          </div>

          {/* Physical Progress */}
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Physical Progress</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </div>
            <div className="text-xl font-bold text-slate-200">
              {project.physicalProgressPercentage}%
            </div>
            <p className="text-[11px] text-red-400 font-semibold">
              Variance: +{project.expenditurePercentage - project.physicalProgressPercentage}% Gap
            </p>
          </div>

          {/* Delay */}
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Milestone Delay</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <div className="text-xl font-bold text-red-400">
              +{project.delayDays} Days
            </div>
            <p className="text-[11px] text-slate-400">
              Target: {project.targetCompletionDate}
            </p>
          </div>

          {/* Location & MP */}
          <div className="bg-slate-950/70 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Constituency</span>
              <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            </div>
            <div className="text-sm font-bold text-white truncate">
              {project.district}, {project.state}
            </div>
            <p className="text-[11px] text-slate-400 truncate">
              MP: {project.mpName}
            </p>
          </div>
        </div>

        {/* Stakeholder Details Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 text-xs border-t border-slate-800">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Executing Agency:</span>
              <span className="text-slate-200 font-semibold">{project.implementingAgency}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HardHat className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Contractor / Vendor:</span>
              <span className="text-slate-200 font-semibold">{project.contractorName} ({project.vendorPanMasked})</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-slate-400 block text-[10px]">Assigned Reviewing Officer:</span>
              <span className="text-slate-200 font-semibold">{assignedInvestigator}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: Explainable AI Factors (XAI) & Mathematical Decomposition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Explainable AI Breakdown */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                <span>Explainable AI Risk Decomposition (XAI)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Transparent multi-dimensional weighting matrix explaining the {project.riskScore} risk score.
              </p>
            </div>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
              Audit Standard
            </span>
          </div>

          <div className="space-y-3">
            {project.explainableFactors.map((factor, idx) => (
              <div
                key={idx}
                className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{factor.factor}</span>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-950 px-1.5 py-0.2 rounded border border-indigo-800">
                      {factor.weightPct}% Weight
                    </span>
                  </div>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                      factor.impact === 'High'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : factor.impact === 'Medium'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    }`}
                  >
                    Score: {factor.score}/100 ({factor.impact} Impact)
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      factor.score >= 75
                        ? 'bg-red-500'
                        : factor.score >= 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${factor.score}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-300 leading-relaxed">
                  {factor.description}
                </p>

                <div className="text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
                  <strong className="text-amber-400">AI Recommendation: </strong> {factor.recommendation}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Duplicate Work Analysis & Geospatial Verification */}
        <div className="lg:col-span-5 space-y-5">
          {/* Duplicate Detection Card */}
          {project.duplicateMatch ? (
            <div className="bg-slate-900 border border-amber-800/80 rounded-2xl p-5 shadow-sm space-y-3 bg-gradient-to-b from-slate-900 to-amber-950/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Copy className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">
                    Potential Duplicate Work Identified
                  </h3>
                </div>
                <span className="bg-amber-950 text-amber-300 border border-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                  {project.duplicateMatch.similarityScore}% Similarity
                </span>
              </div>

              <p className="text-xs text-slate-300">
                {project.duplicateMatch.reason}
              </p>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-400">
                  <span>Candidate Match Project:</span>
                  <span
                    onClick={() => navigate(`/projects/${project.duplicateMatch?.matchedProjectId}`)}
                    className="font-mono font-bold text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
                  >
                    {project.duplicateMatch.matchedProjectId}
                    <ExternalLink className="w-3 h-3" />
                  </span>
                </div>
                <p className="font-semibold text-slate-200 line-clamp-1">
                  {project.duplicateMatch.matchedProjectTitle}
                </p>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 text-slate-400">
                  <div>
                    <span>Sanction: </span>
                    <strong className="text-white">₹{project.duplicateMatch.matchedSanctionAmountLakhs}L</strong>
                  </div>
                  <div>
                    <span>Distance: </span>
                    <strong className="text-amber-400">{project.duplicateMatch.breakdown.geoProximityMeters}m</strong>
                  </div>
                  <div>
                    <span>Text Match: </span>
                    <strong className="text-indigo-300">{project.duplicateMatch.breakdown.titleSimilarity}%</strong>
                  </div>
                  <div>
                    <span>Status: </span>
                    <strong className="text-amber-400">Potential Duplicate — Review Required</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/duplicate-detection')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Compare Side-by-Side in Duplicate Studio</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm text-xs text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>No duplicate works match exceeding the 45% threshold.</span>
            </div>
          )}

          {/* Geospatial Verification Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-indigo-400" />
              <span>Geospatial Verification & Geo-Tagging</span>
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Coordinates:</span>
                <span className="font-mono text-slate-200">
                  {project.location.lat.toFixed(4)}° N, {project.location.lng.toFixed(4)}° E
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Address / Land Mark:</span>
                <span className="text-slate-200">{project.location.address}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Geo-Tagged Photos:</span>
                <span className="text-slate-200">{project.geoTaggedPhotosCount} uploaded</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Utilization Certificate:</span>
                <span className={project.utilizationCertificateSubmitted ? 'text-emerald-400' : 'text-amber-400 font-semibold'}>
                  {project.utilizationCertificateSubmitted ? 'Verified (GFR-12A)' : 'Pending Submission'}
                </span>
              </div>
            </div>

            {project.location.geoAnomalyFlag && (
              <div className="bg-red-950/70 border border-red-600/50 p-2.5 rounded-lg text-xs text-red-300 flex items-start gap-2">
                <AlertOctagon className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-red-400 block">Boundary Discrepancy Flag:</strong>
                  {project.location.geoAnomalyReason || 'Pin falls inside restricted reservation polygon.'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Milestone Progress Lifecycle */}
      {project.milestones && project.milestones.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-white">
            Milestone Dissection & Inspection Timeline
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase font-semibold">
                  <th className="py-2.5 px-3">Milestone Stage</th>
                  <th className="py-2.5 px-3">Target Date</th>
                  <th className="py-2.5 px-3">Physical Target</th>
                  <th className="py-2.5 px-3 text-right">Disbursed (₹)</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {project.milestones.map((m) => (
                  <tr key={m.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-medium">{m.title}</td>
                    <td className="py-2.5 px-3 text-slate-400">{m.targetDate}</td>
                    <td className="py-2.5 px-3">{m.physicalTargetPct}%</td>
                    <td className="py-2.5 px-3 text-right font-mono font-semibold">
                      ₹{m.financialDisbursedLakhs.toFixed(1)}L
                    </td>
                    <td className="py-2.5 px-3">
                      <StatusBadge status={m.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit History for this project */}
      {project.auditHistory && project.auditHistory.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-white">
            Administrative Milestone & Review History
          </h3>
          <div className="space-y-2">
            {project.auditHistory.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
              >
                <div>
                  <span className="font-semibold text-slate-200">{item.action}</span>
                  <p className="text-[11px] text-slate-400">{item.note}</p>
                </div>
                <div className="text-right text-[11px] text-slate-400 shrink-0">
                  <div className="font-mono">{item.date}</div>
                  <div>By: {item.actor}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Review Officer Assignment Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              Designate Reviewing Officer
            </h3>
            <p className="text-xs text-slate-400">
              Assign an official inquiry officer or executive engineer to perform a ground verification for project {project.id}.
            </p>
            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Officer Name & Designation
                </label>
                <input
                  type="text"
                  value={assignedInvestigator}
                  onChange={(e) => setAssignedInvestigator(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAssignModal(false)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                >
                  Confirm Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
