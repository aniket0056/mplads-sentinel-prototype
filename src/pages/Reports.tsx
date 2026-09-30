import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { useSearchParams } from 'react-router-dom';
import {
  FileText,
  Printer,
  Download,
  ShieldCheck,
  CheckCircle,
  FileCheck2,
  Filter,
  Check,
} from 'lucide-react';

export const Reports: React.FC = () => {
  const [searchParams] = useSearchParams();
  const focusId = searchParams.get('focusId');
  const { displayedProjects, currentUserRole, addAuditEntry } = useApp();

  const [reportType, setReportType] = useState<string>('NATIONAL_RISK');
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRiskTier, setSelectedRiskTier] = useState<string>('All');
  const [toastNotice, setToastNotice] = useState<string | null>(null);

  const reportOptions = [
    { key: 'NATIONAL_RISK', label: 'National Risk Summary' },
    { key: 'STATE_MONITORING', label: 'State Monitoring Report' },
    { key: 'DISTRICT_MONITORING', label: 'District Monitoring Report' },
    { key: 'HIGH_RISK', label: 'High-Risk Projects Report' },
    { key: 'DELAYED_PROJECTS', label: 'Delayed Projects Report' },
    { key: 'FINANCIAL_VARIANCE', label: 'Financial Variance Report' },
    { key: 'DUPLICATE_WORKS', label: 'Potential Duplicate Works Report' },
    { key: 'ALERT_RESOLUTION', label: 'Alert Resolution Report' },
  ];

  const filteredReportProjects = useMemo(() => {
    return displayedProjects.filter((p) => {
      if (selectedState !== 'All' && p.state !== selectedState) return false;
      if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
      if (selectedRiskTier !== 'All' && p.riskTier !== selectedRiskTier) return false;

      if (reportType === 'HIGH_RISK') return p.riskTier === 'Critical' || p.riskTier === 'High';
      if (reportType === 'DELAYED_PROJECTS') return p.delayDays > 30;
      if (reportType === 'FINANCIAL_VARIANCE') return p.expenditurePercentage - p.physicalProgressPercentage > 20;
      if (reportType === 'DUPLICATE_WORKS') return !!p.duplicateMatch;
      return true;
    });
  }, [displayedProjects, selectedState, selectedCategory, selectedRiskTier, reportType]);

  const handlePrint = () => {
    addAuditEntry({
      actor: currentUserRole,
      role: currentUserRole,
      action: 'Report Printed / Exported',
      category: 'Investigation',
      details: `Generated and printed ${reportType} report for ${filteredReportProjects.length} projects.`,
      severity: 'Info',
    });
    window.print();
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Project ID,Title,State,District,MP,Category,Sanctioned(L),Spent(L),Utilization(%),Progress(%),Delay(Days),Risk Score,Risk Tier',
        ...filteredReportProjects.map(
          (p) =>
            `"${p.id}","${p.title.replace(/"/g, '""')}","${p.state}","${p.district}","${p.mpName}","${p.category}",${p.sanctionedAmountLakhs},${p.expenditureAmountLakhs},${p.expenditurePercentage},${p.physicalProgressPercentage},${p.delayDays},${p.riskScore},"${p.riskTier}"`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MPLADS_${reportType}_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setToastNotice('Report CSV exported successfully.');
    setTimeout(() => setToastNotice(null), 3000);
  };

  const currentReportTitle = reportOptions.find((r) => r.key === reportType)?.label || 'National Risk Summary';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <FileCheck2 className="w-3.5 h-3.5" />
              Administrative Reporting Division
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Official Monitoring & Executive Reports
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Generate formal administrative summaries, financial variance audits, and risk assessment packs across parliamentary constituencies.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {toastNotice && (
            <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-3 py-1 rounded-lg flex items-center gap-1.5 animate-in fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              {toastNotice}
            </span>
          )}

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/30 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Official Report</span>
          </button>
        </div>
      </div>

      {/* Control Panel (Hidden in print) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3 print:hidden">
        {/* Report Type Selector */}
        <div className="space-y-1.5">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
            Select Operational Report Type:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {reportOptions.map(({ label, key }) => (
              <button
                key={key}
                onClick={() => setReportType(key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  reportType === key
                    ? 'bg-indigo-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Global Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-800 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Filter by State:</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
            >
              <option value="All">All States (National)</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Bihar">Bihar</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="West Bengal">West Bengal</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Filter by Sector:</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
            >
              <option value="All">All Sectors</option>
              <option value="Roads & Bridges">Roads & Bridges</option>
              <option value="Drinking Water">Drinking Water</option>
              <option value="Education & Schools">Education & Schools</option>
              <option value="Healthcare & Sanitation">Healthcare & Sanitation</option>
              <option value="Solar & Renewable">Solar & Renewable</option>
              <option value="Community Infrastructure">Community Infrastructure</option>
            </select>
          </div>

          <div>
            <label className="text-slate-400 block mb-1">Filter by Risk Level:</label>
            <select
              value={selectedRiskTier}
              onChange={(e) => setSelectedRiskTier(e.target.value)}
              className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none"
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical Risk (≥75)</option>
              <option value="High">High Risk (55-74)</option>
              <option value="Medium">Medium Risk (35-54)</option>
              <option value="Low">Low Risk (&lt;35)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Printable Report Canvas */}
      <div className="bg-white text-slate-900 rounded-2xl p-8 shadow-2xl border border-slate-200 max-w-5xl mx-auto space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Official Header */}
        <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-slate-900 text-amber-400 rounded-xl flex items-center justify-center font-bold text-xl border-2 border-slate-800 shadow">
              IN
            </div>
            <div>
              <h1 className="text-lg font-black uppercase tracking-wider text-slate-900">
                Government of India
              </h1>
              <p className="text-xs font-semibold text-slate-700">
                Ministry of Statistics and Programme Implementation (MoSPI)
              </p>
              <p className="text-[11px] text-slate-500">
                MPLADS Scheme Implementation & Risk Intelligence Division
              </p>
            </div>
          </div>

          <div className="text-right text-xs">
            <div className="font-mono font-bold text-slate-900">REPORT: {currentReportTitle.toUpperCase()}</div>
            <div className="text-slate-600">Generated: 29 Sep 2026 • 19:50 IST</div>
            <div className="text-slate-500 text-[10px]">
              Active Role: {currentUserRole}
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 bg-slate-100 p-2 rounded">
            1. Executive Overview & Scope
          </h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            This document provides the official administrative monitoring summary for <strong>{currentReportTitle}</strong> covering {filteredReportProjects.length} projects under the Members of Parliament Local Area Development Scheme (MPLADS). All indicators are computed in accordance with MoSPI statutory guidelines and General Financial Rules (GFR).
          </p>
        </div>

        {/* High-Risk Highlight for MPL-2026-1021 if in scope */}
        {filteredReportProjects.some((p) => p.id === 'MPL-2026-1021') && (
          <div className="border-2 border-red-700 rounded-xl p-4 bg-red-50/50 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="font-mono font-bold text-red-900 bg-red-200 px-2 py-0.5 rounded">
                PRIMARY ADVERSE FINDING: MPL-2026-1021
              </span>
              <span className="font-bold text-red-700">
                AI Risk Score: 91 / 100 (Critical)
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Construction of 4-Lane Bituminous Approach Road & Drain from NH-48 to Shivajinagar Junction
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
              <div><strong>Location:</strong> Pune Rural, Maharashtra</div>
              <div><strong>Fund Utilization:</strong> 92% (₹69.0L disbursed)</div>
              <div><strong>Physical Progress:</strong> 52% (Civil shell only)</div>
              <div><strong>Project Delay:</strong> +189 Days overdue</div>
            </div>
            <p className="text-xs text-red-900 pt-1 leading-relaxed">
              <strong>Risk Summary:</strong> 40 percentage points disconnect between fund utilization and certified physical execution. 86% duplicate similarity match flagged against prior asset MPL-2026-1044 within 140 meters. Subsequent tranche frozen under executive orders.
            </p>
          </div>
        )}

        {/* Projects Matrix Table */}
        <div className="space-y-2">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 bg-slate-100 p-2 rounded">
            2. Projects Data Matrix ({filteredReportProjects.length} Records)
          </h2>
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b-2 border-slate-300 text-slate-700 text-[10px] uppercase font-bold">
                <th className="py-2 px-2">Project ID</th>
                <th className="py-2 px-2">Work Title & Location</th>
                <th className="py-2 px-2 text-right">Sanction (₹)</th>
                <th className="py-2 px-2 text-right">Spent (%)</th>
                <th className="py-2 px-2 text-right">Progress (%)</th>
                <th className="py-2 px-2">Delay</th>
                <th className="py-2 px-2 text-center">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredReportProjects.slice(0, 10).map((p) => (
                <tr key={p.id}>
                  <td className="py-2 px-2 font-mono font-bold text-slate-900">{p.id}</td>
                  <td className="py-2 px-2 max-w-xs">
                    <div className="font-semibold text-slate-800 line-clamp-1">{p.title}</div>
                    <div className="text-[10px] text-slate-500">{p.district}, {p.state}</div>
                  </td>
                  <td className="py-2 px-2 text-right font-mono font-semibold">₹{p.sanctionedAmountLakhs}L</td>
                  <td className="py-2 px-2 text-right font-mono font-bold text-slate-900">{p.expenditurePercentage}%</td>
                  <td className="py-2 px-2 text-right font-mono">{p.physicalProgressPercentage}%</td>
                  <td className="py-2 px-2 font-semibold">
                    {p.delayDays > 0 ? `+${p.delayDays}d` : 'On Time'}
                  </td>
                  <td className="py-2 px-2 text-center font-bold font-mono text-slate-900">{p.riskScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Official Statutory Attestation */}
        <div className="pt-6 border-t-2 border-slate-300 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs">
          <div className="space-y-1">
            <div className="text-slate-600 text-[11px]">
              System Generated Record • National Project Monitoring & Risk Intelligence Platform
            </div>
            <div className="text-slate-400 text-[10px]">
              Ministry of Statistics and Programme Implementation • Government of India
            </div>
          </div>

          <div className="text-right space-y-1">
            <div className="w-36 border-b border-slate-400 ml-auto pb-6"></div>
            <div className="font-bold text-slate-900">Authorized Signatory</div>
            <div className="text-slate-600 text-[11px]">{currentUserRole}</div>
          </div>
        </div>
      </div>
    </div>
  );
};
