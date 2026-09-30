import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Project } from '../types/project';
import { RiskDistributionChart } from '../components/charts/RiskDistributionChart';
import { ExpenditureProgressScatter } from '../components/charts/ExpenditureProgressScatter';
import { StateVulnerabilityBarChart } from '../components/charts/StateVulnerabilityBarChart';
import { IndiaGeoMap } from '../components/maps/IndiaGeoMap';
import { RiskBadge, StatusBadge } from '../components/common/RiskBadge';
import {
  ShieldAlert,
  AlertOctagon,
  Clock,
  TrendingDown,
  Copy,
  FolderKanban,
  ArrowRight,
  ExternalLink,
  FileCheck2,
  RefreshCw,
  BellRing,
  UserCheck,
  Check,
  Search,
  Filter,
  BarChart3,
  Users,
  Layers,
  ChevronRight,
  X,
  Building,
  MapPin,
  Calendar,
  AlertTriangle,
  Info,
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const {
    displayedProjects,
    alerts,
    currentUserRole,
    refreshIntelligence,
    isRefreshing,
    createOrUpdateCase,
  } = useApp();

  // Tab State
  const [activeTab, setActiveTab] = useState<'overview' | 'queue' | 'mps' | 'duplicates'>('overview');

  // Filter State for Queue & MPS
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');
  const [selectedRiskTier, setSelectedRiskTier] = useState<string>('All');

  // Quick Inspect Modal
  const [inspectProject, setInspectProject] = useState<Project | null>(null);

  // Assign Review Modal
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedAssignProject, setSelectedAssignProject] = useState<Project | null>(null);
  const [assignedOfficer, setAssignedOfficer] = useState('Shri Arvind Deshmukh (Addl. DM Vigilance)');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // Aggregate metrics
  const totalSanctioned = displayedProjects.reduce((acc, p) => acc + p.sanctionedAmountLakhs, 0);
  const totalExpenditure = displayedProjects.reduce((acc, p) => acc + p.expenditureAmountLakhs, 0);
  const criticalCount = displayedProjects.filter((p) => p.riskTier === 'Critical').length;
  const delayedCount = displayedProjects.filter((p) => p.delayDays > 30).length;
  const duplicatesCount = displayedProjects.filter((p) => p.duplicateMatch && p.duplicateMatch.similarityScore > 75).length;
  const avgUtilization = totalSanctioned > 0 ? Math.round((totalExpenditure / totalSanctioned) * 100) : 0;

  // Star critical case
  const starProject = displayedProjects.find((p) => p.id === 'MPL-2026-1021') || displayedProjects[0];

  // Distinct states for filter
  const stateOptions = useMemo(() => {
    const states = Array.from(new Set(displayedProjects.map((p) => p.location.state))).sort();
    return ['All', ...states];
  }, [displayedProjects]);

  // Filtered projects for queue
  const filteredQueueProjects = useMemo(() => {
    return displayedProjects.filter((p) => {
      const matchesSearch =
        searchQuery === '' ||
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.mpName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.implementingAgency.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesState = selectedState === 'All' || p.location.state === selectedState;
      const matchesTier = selectedRiskTier === 'All' || p.riskTier === selectedRiskTier;

      return matchesSearch && matchesState && matchesTier;
    });
  }, [displayedProjects, searchQuery, selectedState, selectedRiskTier]);

  // Aggregated MP Level Statistics
  const mpSummaryList = useMemo(() => {
    const map = new Map<string, {
      mpName: string;
      constituency: string;
      state: string;
      totalSanctioned: number;
      totalExpenditure: number;
      projectsCount: number;
      criticalCount: number;
      maxRisk: number;
    }>();

    displayedProjects.forEach((p) => {
      const key = `${p.mpName}-${p.constituency}`;
      const existing = map.get(key);
      if (!existing) {
        map.set(key, {
          mpName: p.mpName,
          constituency: p.constituency,
          state: p.location.state,
          totalSanctioned: p.sanctionedAmountLakhs,
          totalExpenditure: p.expenditureAmountLakhs,
          projectsCount: 1,
          criticalCount: p.riskTier === 'Critical' ? 1 : 0,
          maxRisk: p.riskScore,
        });
      } else {
        existing.totalSanctioned += p.sanctionedAmountLakhs;
        existing.totalExpenditure += p.expenditureAmountLakhs;
        existing.projectsCount += 1;
        if (p.riskTier === 'Critical') existing.criticalCount += 1;
        if (p.riskScore > existing.maxRisk) existing.maxRisk = p.riskScore;
      }
    });

    return Array.from(map.values()).sort((a, b) => b.maxRisk - a.maxRisk);
  }, [displayedProjects]);

  // Duplicate pairs
  const duplicatePairs = useMemo(() => {
    return displayedProjects.filter((p) => p.duplicateMatch && p.duplicateMatch.similarityScore >= 70);
  }, [displayedProjects]);

  const handleOpenAssign = (proj: Project) => {
    setSelectedAssignProject(proj);
    setAssignModalOpen(true);
  };

  const handleAssignReview = (e: React.FormEvent) => {
    e.preventDefault();
    const target = selectedAssignProject || starProject;
    if (target) {
      createOrUpdateCase({
        projectId: target.id,
        projectTitle: target.title,
        assignedOfficer,
        status: 'Assigned',
        priority: target.riskTier === 'Critical' ? 'Critical' : 'High',
        notes: `Administrative inquiry order dispatched. Scrutiny initiated for ${target.id} (${target.title}).`,
      });
      setAssignModalOpen(false);
      setToastMsg(`Review case assigned to ${assignedOfficer} for ${target.id}`);
      setTimeout(() => setToastMsg(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with Operational Persona */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Perspective: {currentUserRole}
            </span>
            <span className="text-xs text-slate-400">• 18th Lok Sabha &amp; FY 2024-26 Surveillance</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <span>MPLADS National Risk &amp; Project Intelligence Console</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
            Autonomous multi-vector monitoring of project execution velocity, physical verification compliance, fund utilization anomalies, and duplicate sanctions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => navigate('/alerts')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-red-950/80 hover:bg-red-900 text-red-200 border border-red-800/80 font-semibold rounded-xl text-xs transition-colors shadow-sm"
          >
            <BellRing className="w-3.5 h-3.5 text-red-400" />
            <span>Critical Alerts ({criticalCount})</span>
          </button>

          <button
            onClick={() => navigate('/reports')}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-xs transition-colors shadow-sm"
          >
            <FileCheck2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Generate Executive Report</span>
          </button>

          <button
            onClick={refreshIntelligence}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>Refresh Intelligence</span>
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMsg && (
        <div className="bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs px-4 py-2 rounded-xl flex items-center gap-2 animate-in fade-in shadow-md">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* National Works Execution Stage Pipeline Tracker */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-2.5 border-b border-slate-800/80">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              National Works Pipeline &amp; Public Capital Velocity
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Total Monitored Portfolio: <strong className="text-white">₹{(totalSanctioned / 100).toFixed(2)} Cr</strong> ({displayedProjects.length} Works)
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">1. Administrative Sanction</span>
            <div className="text-base font-bold text-white mt-1">₹{(totalSanctioned / 100).toFixed(2)} Cr</div>
            <span className="text-[11px] text-slate-400">{displayedProjects.length} Works Approved</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">2. Tendered &amp; Contracted</span>
            <div className="text-base font-bold text-indigo-300 mt-1">₹{((totalSanctioned * 0.91) / 100).toFixed(2)} Cr</div>
            <span className="text-[11px] text-slate-400">38 Works Awarded</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">3. Ground Execution</span>
            <div className="text-base font-bold text-cyan-300 mt-1">₹{(totalExpenditure / 100).toFixed(2)} Cr</div>
            <span className="text-[11px] text-cyan-400">29 Works Active</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800/80">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">4. Verified / Inspected</span>
            <div className="text-base font-bold text-emerald-400 mt-1">19 Works</div>
            <span className="text-[11px] text-slate-400">Geo-tagged Photos Validated</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-xl border border-red-900/60 bg-gradient-to-br from-slate-950 to-red-950/20">
            <span className="text-[10px] uppercase font-bold text-red-400 block">5. High Vigilance Scrutiny</span>
            <div className="text-base font-bold text-red-500 mt-1">{criticalCount} Critical Works</div>
            <span className="text-[11px] text-red-300">₹{((criticalCount * 70) / 100).toFixed(2)} Cr Flagged</span>
          </div>
        </div>
      </div>

      {/* 6 Real-World KPI Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* Card 1: Projects Tracked */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold">Works Tracked</span>
            <FolderKanban className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold text-white">{displayedProjects.length}</div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-0.5">
            <span>●</span>
            <span>100% Active Ingest</span>
          </div>
        </div>

        {/* Card 2: Sanctioned Outlay */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold">Approved Outlay</span>
            <span className="text-slate-400 font-mono text-[10px]">INR</span>
          </div>
          <div className="text-2xl font-bold text-white">₹{(totalSanctioned / 100).toFixed(2)} Cr</div>
          <p className="text-[11px] text-slate-400 mt-0.5">Across 42 Parliamentary Works</p>
        </div>

        {/* Card 3: Fund Utilization */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold">Fund Utilization</span>
            <TrendingDown className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-blue-400">{avgUtilization}%</div>
          <p className="text-[11px] text-slate-400 mt-0.5">₹{(totalExpenditure / 100).toFixed(2)} Cr Disbursed</p>
        </div>

        {/* Card 4: Critical Risk */}
        <div className="bg-slate-900 border border-red-900/60 rounded-xl p-3.5 shadow-sm bg-gradient-to-b from-slate-900 to-red-950/20 hover:border-red-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-red-400">Critical Risk</span>
            <AlertOctagon className="w-4 h-4 text-red-500" />
          </div>
          <div className="text-2xl font-bold text-red-500">{criticalCount} Works</div>
          <p className="text-[11px] text-red-300 mt-0.5">Composite Score ≥ 75</p>
        </div>

        {/* Card 5: Duplicate Alerts */}
        <div className="bg-slate-900 border border-amber-900/50 rounded-xl p-3.5 shadow-sm hover:border-amber-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold text-amber-400">Duplicate Alerts</span>
            <Copy className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-amber-400">{duplicatesCount} Works</div>
          <p className="text-[11px] text-amber-300 mt-0.5">&lt; 500m &amp; Similar BOQ</p>
        </div>

        {/* Card 6: Delayed Projects */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3.5 shadow-sm hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-1.5">
            <span className="text-xs font-semibold">Overdue Works</span>
            <Clock className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-2xl font-bold text-orange-400">{delayedCount} Works</div>
          <p className="text-[11px] text-slate-400 mt-0.5">&gt; 30 Days Past Target</p>
        </div>
      </div>

      {/* Navigation Tabs Bar for Comprehensive Government View */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-2">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>Executive Overview &amp; Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('queue')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'queue'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Priority Attention Queue</span>
            <span className="px-1.5 py-0.2 bg-red-950 text-red-300 border border-red-800 rounded-full text-[10px]">
              {criticalCount}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('mps')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'mps'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>MPs &amp; Constituency Allocations</span>
            <span className="px-1.5 py-0.2 bg-slate-800 text-slate-300 rounded-full text-[10px]">
              {mpSummaryList.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('duplicates')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'duplicates'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Duplicate Sanctions Watch</span>
            <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-800 rounded-full text-[10px]">
              {duplicatePairs.length}
            </span>
          </button>
        </div>

        <span className="text-xs text-slate-400 font-medium hidden md:inline">
          Showing {filteredQueueProjects.length} of {displayedProjects.length} records
        </span>
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-in fade-in">
          {/* CRITICAL RISK — PRIORITY REVIEW REQUIRED (Featured Case Card) */}
          {starProject && (
            <div className="bg-gradient-to-r from-red-950/70 via-slate-900 to-slate-900 border-2 border-red-700/70 rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-red-700 text-white text-[10px] font-bold uppercase px-3 py-1 rounded-bl-xl tracking-wider">
                Critical Risk — Priority Review Required
              </div>

              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2.5 py-0.5 rounded border border-slate-800">
                      {starProject.id}
                    </span>
                    <RiskBadge tier={starProject.riskTier} score={starProject.riskScore} size="md" />
                    <span className="text-xs text-slate-400">
                      {starProject.district}, {starProject.state} ({starProject.constituency}) • MP: {starProject.mpName}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {starProject.title}
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                    <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
                      <span className="text-[11px] text-slate-400 block">AI Risk Score</span>
                      <span className="text-lg font-bold text-red-500">
                        {starProject.riskScore} / 100
                      </span>
                    </div>
                    <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
                      <span className="text-[11px] text-slate-400 block">Fund Utilization</span>
                      <span className="text-lg font-bold text-amber-400">
                        {starProject.expenditurePercentage}% (₹{starProject.expenditureAmountLakhs}L)
                      </span>
                    </div>
                    <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
                      <span className="text-[11px] text-slate-400 block">Physical Progress</span>
                      <span className="text-lg font-bold text-slate-200">
                        {starProject.physicalProgressPercentage}%
                      </span>
                    </div>
                    <div className="bg-slate-950/70 border border-slate-800 p-2.5 rounded-lg">
                      <span className="text-[11px] text-slate-400 block">Project Delay</span>
                      <span className="text-lg font-bold text-red-400">
                        +{starProject.delayDays} Days
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed pt-1">
                    <strong className="text-slate-200">Risk Analysis:</strong> Fund utilization is significantly higher than verified physical progress. The project is also substantially delayed (+189 days) and has an 82% similarity score with nearby civil work MPL-2026-1044 within 140 meters.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full lg:w-auto shrink-0">
                  <button
                    onClick={() => navigate(`/projects/${starProject.id}`)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>View Risk Dossier</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => navigate('/duplicate-detection')}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-amber-400" />
                    <span>Compare Similar Project</span>
                  </button>

                  <button
                    onClick={() => handleOpenAssign(starProject)}
                    className="px-4 py-2 bg-red-950 hover:bg-red-900 border border-red-800 text-red-200 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-red-400" />
                    <span>Assign Inquiry Officer</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Expenditure vs Progress Disconnect (Scatter) */}
            <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Expenditure vs Physical Progress Disconnect Matrix
                  </h3>
                  <p className="text-xs text-slate-400">
                    Front-loading anomaly radar: Projects hovering above the diagonal dashed line indicate funds spent exceeding ground delivery.
                  </p>
                </div>
                <span className="text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-mono">
                  Parity Radar
                </span>
              </div>
              <ExpenditureProgressScatter projects={displayedProjects} />
            </div>

            {/* Right: Risk Tier Distribution (Donut) */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">
                  National Risk Profile Distribution
                </h3>
                <p className="text-xs text-slate-400">
                  Categorized via XAI multi-factor scoring model.
                </p>
              </div>
              <RiskDistributionChart projects={displayedProjects} />
              <div className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>High / Critical Share:</span>
                  <span className="font-bold text-red-400">{displayedProjects.length > 0 ? Math.round(((criticalCount) / displayedProjects.length) * 100) : 0}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Avg Delay in Critical Tier:</span>
                  <span className="font-bold text-amber-400">194.2 Days</span>
                </div>
              </div>
            </div>
          </div>

          {/* Geospatial Map Preview */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">
                  National GIS Geo-Intelligence Grid
                </h3>
                <p className="text-xs text-slate-400">
                  Markers colored by risk tier with boundary out-of-bounds indicators. Click any marker to inspect.
                </p>
              </div>
              <button
                onClick={() => navigate('/geo-intelligence')}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
              >
                <span>Full-Screen Map Studio</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
            <IndiaGeoMap projects={displayedProjects} height="420px" />
          </div>

          {/* Bottom Grid: State Vulnerability & Recent Critical Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* State Vulnerabilities */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-white">
                  State-wise Risk &amp; Delay Vulnerability
                </h3>
                <span className="text-xs text-slate-400">Top 8 States</span>
              </div>
              <StateVulnerabilityBarChart projects={displayedProjects} />
            </div>

            {/* Priority Triage Alerts */}
            <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">
                      Active Sentinel Alerts Triage
                    </h3>
                    <p className="text-xs text-slate-400">
                      Pending administrative review &amp; district action.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate('/alerts')}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1"
                  >
                    <span>View All ({alerts.length})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {alerts.slice(0, 4).map((alt) => (
                    <div
                      key={alt.id}
                      onClick={() => navigate(`/projects/${alt.projectId}`)}
                      className="p-3 bg-slate-950/70 hover:bg-slate-800/60 border border-slate-800 rounded-xl cursor-pointer transition-colors space-y-1"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-mono font-bold text-amber-400">{alt.projectId}</span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          alt.severity === 'Critical' ? 'bg-red-950 text-red-400 border border-red-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                        }`}>
                          {alt.severity}
                        </span>
                      </div>
                      <h4 className="text-xs font-semibold text-slate-200 line-clamp-1">
                        {alt.projectTitle}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">
                        {alt.message}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 mt-3 flex justify-between items-center text-xs text-slate-400">
                <span>Automated Analysis Cycle: Active</span>
                <span className="text-emerald-400 font-medium">● 0 Model Exceptions</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRIORITY ATTENTION QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4 animate-in fade-in">
          {/* Queue Filter Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by Project ID, title, MP, district, or contractor..."
                className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-3 py-1.5 rounded-xl text-xs text-slate-300">
                <span className="text-slate-400 text-[11px]">State:</span>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
                >
                  {stateOptions.map((st) => (
                    <option key={st} value={st} className="bg-slate-900 text-white">
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 p-1 rounded-xl text-xs">
                {['All', 'Critical', 'High', 'Medium', 'Low'].map((tier) => (
                  <button
                    key={tier}
                    onClick={() => setSelectedRiskTier(tier)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                      selectedRiskTier === tier
                        ? 'bg-indigo-600 text-white'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Projects Table */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold tracking-wider text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">Project ID &amp; Work Title</th>
                    <th className="py-3 px-4">Constituency / MP</th>
                    <th className="py-3 px-4">Sanctioned</th>
                    <th className="py-3 px-4">Progress vs Spent</th>
                    <th className="py-3 px-4">Delay</th>
                    <th className="py-3 px-4">Risk Index</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredQueueProjects.map((p) => {
                    const isMismatch = p.expenditurePercentage - p.physicalProgressPercentage > 25;
                    return (
                      <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-mono text-[11px] font-bold text-amber-400">{p.id}</div>
                          <div className="text-white font-medium line-clamp-1 mt-0.5">{p.title}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{p.category}</div>
                        </td>

                        <td className="py-3 px-4">
                          <div className="text-slate-200 font-semibold">{p.constituency}</div>
                          <div className="text-[11px] text-slate-400">{p.mpName}</div>
                          <div className="text-[10px] text-slate-500">{p.location.district}, {p.location.state}</div>
                        </td>

                        <td className="py-3 px-4 font-mono">
                          <div className="text-white font-bold">₹{p.sanctionedAmountLakhs}L</div>
                          <div className="text-[11px] text-slate-400">Spent: ₹{p.expenditureAmountLakhs}L</div>
                        </td>

                        <td className="py-3 px-4 min-w-[140px]">
                          <div className="flex justify-between text-[11px] mb-1">
                            <span className="text-slate-400">Physical: <strong className="text-white">{p.physicalProgressPercentage}%</strong></span>
                            <span className={isMismatch ? 'text-red-400 font-bold' : 'text-blue-400'}>
                              Spent: {p.expenditurePercentage}%
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
                            <div
                              className="bg-emerald-500 h-full"
                              style={{ width: `${Math.min(100, p.physicalProgressPercentage)}%` }}
                              title="Physical Progress"
                            />
                          </div>
                          {isMismatch && (
                            <span className="text-[10px] text-red-400 font-semibold mt-1 block">
                              ⚠ +{p.expenditurePercentage - p.physicalProgressPercentage}% Disconnect
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          {p.delayDays > 0 ? (
                            <span className="text-red-400 font-semibold font-mono">+{p.delayDays}d</span>
                          ) : (
                            <span className="text-emerald-400 font-mono">On Schedule</span>
                          )}
                        </td>

                        <td className="py-3 px-4">
                          <RiskBadge tier={p.riskTier} score={p.riskScore} size="sm" />
                        </td>

                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setInspectProject(p)}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                            >
                              Inspect
                            </button>
                            <button
                              onClick={() => navigate(`/projects/${p.id}`)}
                              className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                            >
                              Dossier
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredQueueProjects.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-slate-400 text-xs">
                        No projects match the current filter criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MPS & CONSTITUENCY ALLOCATIONS */}
      {activeTab === 'mps' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white">
                Member of Parliament Allocation &amp; Delivery Intelligence
              </h3>
              <p className="text-xs text-slate-400">
                Consolidated expenditure velocity and high-risk flags across parliamentary constituencies.
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-full">
              {mpSummaryList.length} Constituencies Monitored
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mpSummaryList.map((mp) => {
              const util = mp.totalSanctioned > 0 ? Math.round((mp.totalExpenditure / mp.totalSanctioned) * 100) : 0;
              return (
                <div
                  key={`${mp.mpName}-${mp.constituency}`}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition-all space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">{mp.mpName}</h4>
                      <p className="text-xs text-slate-400">{mp.constituency}, {mp.state}</p>
                    </div>
                    {mp.criticalCount > 0 ? (
                      <span className="px-2 py-0.5 bg-red-950 text-red-400 border border-red-800 text-[10px] font-bold rounded-full">
                        {mp.criticalCount} Critical
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold rounded-full">
                        Clean
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Sanctioned</span>
                      <span className="font-bold text-white">₹{mp.totalSanctioned}L</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Disbursed</span>
                      <span className="font-bold text-blue-400">₹{mp.totalExpenditure}L</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Max Risk</span>
                      <span className={`font-bold ${mp.maxRisk >= 75 ? 'text-red-400' : mp.maxRisk >= 60 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {mp.maxRisk}/100
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                      <span>Fund Utilization Parity:</span>
                      <span className="font-semibold text-white">{util}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${util > 90 ? 'bg-amber-400' : 'bg-indigo-500'}`}
                        style={{ width: `${Math.min(100, util)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-1 text-xs">
                    <span className="text-slate-400 text-[11px]">{mp.projectsCount} Works in Area</span>
                    <button
                      onClick={() => navigate(`/projects?search=${encodeURIComponent(mp.constituency)}`)}
                      className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 text-[11px]"
                    >
                      <span>View Works</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: DUPLICATE SANCTIONS WATCH */}
      {activeTab === 'duplicates' && (
        <div className="space-y-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm flex justify-between items-center">
            <div>
              <h3 className="text-sm font-bold text-white">
                Near-Neighbor &amp; Duplicate Sanction Pairs
              </h3>
              <p className="text-xs text-slate-400">
                Spatial radius analysis (&lt; 500m) cross-referenced against CPWD / State PWD tender descriptions.
              </p>
            </div>
            <button
              onClick={() => navigate('/duplicate-detection')}
              className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-3 py-1.5 rounded-xl transition-colors"
            >
              Open Full Deduplication Studio
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {duplicatePairs.map((proj) => {
              const match = proj.duplicateMatch!;
              return (
                <div key={proj.id} className="bg-slate-900 border border-amber-900/60 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                      {proj.id}
                    </span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-red-950 text-red-400 border border-red-800">
                      {match.similarityScore}% Overlap
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white line-clamp-1">{proj.title}</h4>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Sanctioned: ₹{proj.sanctionedAmountLakhs}L • {proj.location.district}, {proj.location.state}
                    </p>
                  </div>

                  <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800 text-xs space-y-1">
                    <div className="text-[11px] text-slate-400 font-semibold">Matched Concurrent Work:</div>
                    <div className="font-mono font-bold text-amber-300 text-[11px]">{match.matchedProjectId}</div>
                    <div className="text-slate-300 line-clamp-1 text-[11px]">{match.matchedProjectTitle}</div>
                    <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1">
                      <span>Proximity: <strong className="text-white">{match.breakdown.geoProximityMeters}m away</strong></span>
                      <span>Agency: {match.matchedAgency}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-amber-300/90 leading-relaxed">
                    <strong>Detection Reason:</strong> {match.reason}
                  </p>

                  <div className="flex justify-end gap-2 pt-1 border-t border-slate-800">
                    <button
                      onClick={() => navigate(`/projects/${proj.id}`)}
                      className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium"
                    >
                      View Source
                    </button>
                    <button
                      onClick={() => navigate('/duplicate-detection')}
                      className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
                    >
                      Compare Details
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* QUICK INSPECT MODAL */}
      {inspectProject && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start pb-2 border-b border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {inspectProject.id}
                  </span>
                  <RiskBadge tier={inspectProject.riskTier} score={inspectProject.riskScore} size="sm" />
                </div>
                <h3 className="text-sm font-bold text-white mt-1">
                  {inspectProject.title}
                </h3>
              </div>
              <button
                onClick={() => setInspectProject(null)}
                className="p-1 text-slate-400 hover:text-white rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Sanctioned</span>
                <span className="text-base font-bold text-white">₹{inspectProject.sanctionedAmountLakhs}L</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Disbursed</span>
                <span className="text-base font-bold text-blue-400">₹{inspectProject.expenditureAmountLakhs}L ({inspectProject.expenditurePercentage}%)</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Physical Ground</span>
                <span className="text-base font-bold text-slate-200">{inspectProject.physicalProgressPercentage}%</span>
              </div>
              <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Delay</span>
                <span className="text-base font-bold text-red-400">+{inspectProject.delayDays} Days</span>
              </div>
            </div>

            {/* 6-Factor AI Risk Decomposition */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                6-Factor AI Risk Decomposition
              </h4>
              <div className="space-y-2 text-xs">
                {inspectProject.explainableFactors.map((f) => (
                  <div key={f.factor} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold text-slate-200">{f.factor} (Weight: {f.weightPct}%)</span>
                      <span className={`font-mono font-bold ${f.score > 70 ? 'text-red-400' : f.score > 40 ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {f.score} / 100
                      </span>
                    </div>
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-1">
                      <div
                        className={`h-full ${f.score > 70 ? 'bg-red-500' : f.score > 40 ? 'bg-amber-400' : 'bg-emerald-500'}`}
                        style={{ width: `${f.score}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-slate-400">{f.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={() => setInspectProject(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold"
              >
                Close
              </button>
              <button
                onClick={() => {
                  setInspectProject(null);
                  handleOpenAssign(inspectProject);
                }}
                className="px-3.5 py-1.5 bg-red-950 text-red-200 border border-red-800 rounded-lg text-xs font-semibold"
              >
                Assign Inquiry
              </button>
              <button
                onClick={() => {
                  const id = inspectProject.id;
                  setInspectProject(null);
                  navigate(`/projects/${id}`);
                }}
                className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold"
              >
                Open Full Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assign Review Modal */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">
              Assign Administrative Review
            </h3>
            <p className="text-xs text-slate-400">
              Assign an official inquiry officer or technical committee to perform verification for work {(selectedAssignProject || starProject)?.id}.
            </p>
            <form onSubmit={handleAssignReview} className="space-y-3">
              <div>
                <label className="block text-xs text-slate-300 mb-1">
                  Designated Reviewing Officer
                </label>
                <input
                  type="text"
                  value={assignedOfficer}
                  onChange={(e) => setAssignedOfficer(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignModalOpen(false)}
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
