import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Settings as SettingsIcon,
  Sliders,
  Shield,
  Save,
  Check,
  RotateCcw,
  Bell,
  Cpu,
  Database,
} from 'lucide-react';

export const Settings: React.FC = () => {
  const { addAuditEntry, currentUserRole } = useApp();

  // Settings State
  const [criticalCutoff, setCriticalCutoff] = useState<number>(75);
  const [duplicateRadius, setDuplicateRadius] = useState<number>(500);
  const [marchRushPct, setMarchRushPct] = useState<number>(40);
  const [delayThresholdDays, setDelayThresholdDays] = useState<number>(90);
  const [emailAlerts, setEmailAlerts] = useState<boolean>(true);
  const [smsAlerts, setSmsAlerts] = useState<boolean>(true);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addAuditEntry({
      actor: 'System Administrator',
      role: currentUserRole,
      action: 'Vigilance Thresholds Updated',
      category: 'Security',
      details: `Saved new policy thresholds: Critical Score=${criticalCutoff}, Duplicate Radius=${duplicateRadius}m, March Rush=${marchRushPct}%.`,
      severity: 'Info',
    });
    setSaveNotice('Settings & Policy Thresholds saved successfully.');
    setTimeout(() => setSaveNotice(null), 4000);
  };

  const handleReset = () => {
    setCriticalCutoff(75);
    setDuplicateRadius(500);
    setMarchRushPct(40);
    setDelayThresholdDays(90);
    setSaveNotice('Reset to default statutory standards.');
    setTimeout(() => setSaveNotice(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <SettingsIcon className="w-3.5 h-3.5" />
              National Policy Thresholds
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            System Configuration & AI Model Parameters
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Configure automated enforcement triggers, duplicate proximity radii, March Rush tripwires, and API integration gateways.
          </p>
        </div>

        {saveNotice && (
          <div className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-3.5 py-1.5 rounded-xl flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{saveNotice}</span>
          </div>
        )}
      </div>

      {/* System Information */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-indigo-400" />
            <span>Platform &amp; System Information</span>
          </h3>
          <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Operational
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Application</div>
            <div className="text-sm font-bold text-white mt-1">MPLADS Sentinel AI</div>
            <div className="text-[11px] text-slate-500 mt-0.5">National Project Risk, Anomaly &amp; Monitoring Platform</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Platform Version</div>
            <div className="text-sm font-mono font-bold text-indigo-300 mt-1">v2.4.0 (Enterprise Build)</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Statutory Rules Engine v2026.3</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Active User Role</div>
            <div className="text-sm font-bold text-amber-300 mt-1">{currentUserRole}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">Access scope: Full Administrative</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">AI Risk Engine</div>
            <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Operational
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Automated Heuristic &amp; Anomaly Analysis</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Data Pipeline</div>
            <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Operational (Active)
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">Ingestion &amp; Validation Stream Active</div>
          </div>

          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Primary Database</div>
            <div className="text-sm font-bold text-cyan-300 mt-1">Local Project Repository</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">Connected (Verified)</div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Anomaly & Risk Thresholds */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <span>AI Risk Scoring Sensitivity Limits</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Cutoff Score */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span className="font-medium">Critical Risk Escalation Score:</span>
                <span className="font-mono font-bold text-red-400">≥ {criticalCutoff} / 100</span>
              </div>
              <input
                type="range"
                min="60"
                max="90"
                value={criticalCutoff}
                onChange={(e) => setCriticalCutoff(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">
                Works scoring above this limit trigger automated alerts to the District DM.
              </span>
            </div>

            {/* Duplicate Proximity Radius */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span className="font-medium">Duplicate GPS Proximity Threshold:</span>
                <span className="font-mono font-bold text-indigo-400">{duplicateRadius} meters</span>
              </div>
              <input
                type="range"
                min="100"
                max="2000"
                step="50"
                value={duplicateRadius}
                onChange={(e) => setDuplicateRadius(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">
                Works sanctioned within this distance with matching scope are flagged for review.
              </span>
            </div>

            {/* March Rush Velocity Spike */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span className="font-medium">March Rush Velocity Tripwire:</span>
                <span className="font-mono font-bold text-amber-400">&gt; {marchRushPct}% in 14 days</span>
              </div>
              <input
                type="range"
                min="20"
                max="70"
                value={marchRushPct}
                onChange={(e) => setMarchRushPct(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">
                Rapid fund withdrawal spikes in late Q4 trigger scrutiny of measurement books.
              </span>
            </div>

            {/* Delay Threshold */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-300">
                <span className="font-medium">Delay Show-Cause Trigger:</span>
                <span className="font-mono font-bold text-orange-400">&gt; {delayThresholdDays} days</span>
              </div>
              <input
                type="range"
                min="30"
                max="180"
                value={delayThresholdDays}
                onChange={(e) => setDelayThresholdDays(Number(e.target.value))}
                className="w-full accent-indigo-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <span className="text-[11px] text-slate-500 block">
                Automatic generation of show-cause notice under GFR rules to executing agency.
              </span>
            </div>
          </div>
        </div>

        {/* Integration Gateways */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <span>Government Enterprise System Connectors</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-200">PFMS Gateway</span>
                <span className="text-emerald-400 font-bold text-[10px]">CONFIGURED</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Treasury payment voucher ingest schema ready for batch file exchange and API hooks.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-200">e-Sakshi Mobile GIS</span>
                <span className="text-emerald-400 font-bold text-[10px]">ACTIVE</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Geo-tagged field inspection records parsed with EXIF coordinates and time validation.
              </p>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
              <div className="flex justify-between items-center">
                <span className="font-bold text-slate-200">GeM Marketplace SOR</span>
                <span className="text-emerald-400 font-bold text-[10px]">INDEXED</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Civil works CPWD / State SOR schedule benchmarks indexed for rate-variation detection.
              </p>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Standards</span>
          </button>

          <button
            type="submit"
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
