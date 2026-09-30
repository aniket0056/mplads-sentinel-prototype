import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { AlertNotification } from '../types/project';
import {
  BellRing,
  AlertOctagon,
  AlertTriangle,
  Info,
  CheckCircle2,
  UserCheck,
  Snowflake,
  Eye,
  Check,
  Filter,
  FileCheck2,
  MessageSquare,
  ArrowUpRight,
} from 'lucide-react';

export const Alerts: React.FC = () => {
  const navigate = useNavigate();
  const { alerts, updateAlertStatus, freezeProjectTranche, createOrUpdateCase, currentUserRole } = useApp();

  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedAlertForAssign, setSelectedAlertForAssign] = useState<AlertNotification | null>(null);
  const [investigatorName, setInvestigatorName] = useState<string>('Shri Arvind Deshmukh (Addl. DM Vigilance)');
  const [noteModalAlert, setNoteModalAlert] = useState<AlertNotification | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const [notificationMsg, setNotificationMsg] = useState<string | null>(null);

  const filteredAlerts = alerts.filter((a) => {
    if (severityFilter !== 'All' && a.severity !== severityFilter) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter) return false;
    return true;
  });

  const handleAcknowledge = (alert: AlertNotification) => {
    updateAlertStatus(alert.id, 'Acknowledged', 'Alert acknowledged by reviewing officer.');
    setNotificationMsg(`Alert ${alert.id} acknowledged.`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleEscalate = (alert: AlertNotification) => {
    updateAlertStatus(alert.id, 'Escalated', 'Escalated to State Nodal Authority & MoSPI.');
    createOrUpdateCase({
      projectId: alert.projectId,
      projectTitle: alert.projectTitle,
      priority: 'Critical',
      status: 'Escalated',
      notes: `Escalated alert ${alert.id}: ${alert.message}`,
    });
    setNotificationMsg(`Alert ${alert.id} escalated to higher authority.`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleResolve = (alert: AlertNotification) => {
    updateAlertStatus(alert.id, 'Resolved', 'Resolved following administrative verification.');
    setNotificationMsg(`Alert ${alert.id} marked as Resolved.`);
    setTimeout(() => setNotificationMsg(null), 3000);
  };

  const handleFreeze = (alert: AlertNotification) => {
    freezeProjectTranche(alert.projectId);
    updateAlertStatus(alert.id, 'Under Review', 'Subsequent tranche payment frozen by executive order.');
    setNotificationMsg(`Tranche payment frozen for ${alert.projectId}. Treasury order issued.`);
    setTimeout(() => setNotificationMsg(null), 4000);
  };

  const handleAssignSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAlertForAssign) {
      updateAlertStatus(
        selectedAlertForAssign.id,
        'Assigned',
        `Assigned to ${investigatorName}`,
        investigatorName
      );
      createOrUpdateCase({
        projectId: selectedAlertForAssign.projectId,
        projectTitle: selectedAlertForAssign.projectTitle,
        assignedOfficer: investigatorName,
        status: 'Assigned',
        priority: selectedAlertForAssign.severity === 'Critical' ? 'Critical' : 'High',
        notes: `Review initiated from alert ${selectedAlertForAssign.id}.`,
      });
      setNotificationMsg(`Inquiry officer designated: ${investigatorName}`);
      setSelectedAlertForAssign(null);
      setTimeout(() => setNotificationMsg(null), 4000);
    }
  };

  const handleAddNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (noteModalAlert && noteText.trim()) {
      updateAlertStatus(noteModalAlert.id, noteModalAlert.status, noteText.trim());
      setNotificationMsg(`Note appended to alert ${noteModalAlert.id}.`);
      setNoteModalAlert(null);
      setNoteText('');
      setTimeout(() => setNotificationMsg(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-1">
              <BellRing className="w-3.5 h-3.5" />
              Administrative Incident Center
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Vigilance Alert Triage & Incident Workflow
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Real-time incident dispatching and case management for District Authorities, State Nodal Officers, and Ministry Monitoring Units.
          </p>
        </div>

        {notificationMsg && (
          <div className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{notificationMsg}</span>
          </div>
        )}
      </div>

      {/* Filter and Status Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 border border-slate-800 p-3.5 rounded-2xl text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold">Severity:</span>
          {['All', 'Critical', 'Warning', 'Info'].map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                severityFilter === sev
                  ? 'bg-indigo-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="text-slate-400 font-semibold">Workflow Status:</span>
          {['All', 'New', 'Acknowledged', 'Under Review', 'Assigned', 'Escalated', 'Resolved'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                statusFilter === st
                  ? 'bg-amber-600 text-white font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => {
          const isCritical = alert.severity === 'Critical';

          return (
            <div
              key={alert.id}
              className={`bg-slate-900 border rounded-2xl p-4 shadow-sm transition-all space-y-3 ${
                isCritical
                  ? 'border-red-900/60 bg-gradient-to-r from-slate-900 to-red-950/20'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="space-y-1.5 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {alert.id}
                    </span>
                    <span
                      onClick={() => navigate(`/projects/${alert.projectId}`)}
                      className="font-mono text-xs text-indigo-400 hover:underline cursor-pointer"
                    >
                      {alert.projectId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        alert.severity === 'Critical'
                          ? 'bg-red-950 text-red-400 border border-red-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span className="text-[11px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {alert.type}
                    </span>
                    <span className="text-[11px] text-slate-500">
                      {alert.timestamp}
                    </span>
                  </div>

                  <h3
                    onClick={() => navigate(`/projects/${alert.projectId}`)}
                    className="text-sm font-bold text-white hover:text-indigo-400 cursor-pointer"
                  >
                    {alert.projectTitle}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {alert.message}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                    <span>District: <strong className="text-slate-200">{alert.district}, {alert.state}</strong></span>
                    <span>Status: <strong className="text-amber-400">{alert.status}</strong></span>
                    {alert.assignedTo && (
                      <span>Inquiry Officer: <strong className="text-indigo-300">{alert.assignedTo}</strong></span>
                    )}
                    {alert.actionTakenNotes && (
                      <span className="text-emerald-400">Notes: {alert.actionTakenNotes}</span>
                    )}
                  </div>
                </div>

                {/* Workflow Action Buttons */}
                <div className="flex flex-wrap md:flex-col gap-1.5 shrink-0">
                  <button
                    onClick={() => navigate(`/projects/${alert.projectId}`)}
                    className="px-2.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Project</span>
                  </button>

                  {alert.status === 'New' && (
                    <button
                      onClick={() => handleAcknowledge(alert)}
                      className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Acknowledge</span>
                    </button>
                  )}

                  <button
                    onClick={() => setSelectedAlertForAssign(alert)}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Assign Officer</span>
                  </button>

                  <button
                    onClick={() => handleFreeze(alert)}
                    className="px-2.5 py-1.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Snowflake className="w-3.5 h-3.5" />
                    <span>Freeze Tranche</span>
                  </button>

                  <button
                    onClick={() => {
                      setNoteModalAlert(alert);
                      setNoteText(alert.actionTakenNotes || '');
                    }}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-slate-400" />
                    <span>Add Note</span>
                  </button>

                  {alert.status !== 'Resolved' && (
                    <>
                      <button
                        onClick={() => handleEscalate(alert)}
                        className="px-2.5 py-1.5 bg-amber-950 hover:bg-amber-900 text-amber-300 border border-amber-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                        <span>Escalate</span>
                      </button>

                      <button
                        onClick={() => handleResolve(alert)}
                        className="px-2.5 py-1.5 bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Resolve</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Assignment Modal */}
      {selectedAlertForAssign && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              Assign Official Inquiry Officer
            </h3>
            <p className="text-xs text-slate-400">
              Designate a field investigator or technical committee for alert {selectedAlertForAssign.id} ({selectedAlertForAssign.projectId}).
            </p>
            <form onSubmit={handleAssignSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Inquiry Officer Name & Designation
                </label>
                <input
                  type="text"
                  value={investigatorName}
                  onChange={(e) => setInvestigatorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedAlertForAssign(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                >
                  Assign & Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Note Modal */}
      {noteModalAlert && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              Append Verification Note
            </h3>
            <p className="text-xs text-slate-400">
              Record administrative remarks or physical inspection findings for alert {noteModalAlert.id}.
            </p>
            <form onSubmit={handleAddNoteSubmit} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Verification Remarks
                </label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="Enter inspection remarks, measurement book verification status, or engineering notes..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setNoteModalAlert(null)}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                >
                  Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
