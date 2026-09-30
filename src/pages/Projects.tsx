import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Project, RiskTier, ProjectCategory } from '../types/project';
import { RiskBadge, StatusBadge } from '../components/common/RiskBadge';
import {
  Search,
  Filter,
  ArrowUpDown,
  Download,
  Eye,
  Snowflake,
  ExternalLink,
  MapPin,
  RefreshCw,
} from 'lucide-react';

export const Projects: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { projects, freezeProjectTranche } = useApp();

  const initialSearch = searchParams.get('search') || '';

  // Filter states
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch);
  const [selectedState, setSelectedState] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedRiskTier, setSelectedRiskTier] = useState<string>('All');
  const [selectedFY, setSelectedFY] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'riskScore' | 'delayDays' | 'expenditure' | 'amount'>('riskScore');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Extract unique states & categories
  const states = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.state)))], [projects]);
  const categories = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.category)))], [projects]);
  const financialYears = useMemo(() => ['All', ...Array.from(new Set(projects.map((p) => p.financialYear)))], [projects]);

  // Filtered and sorted projects
  const filteredProjects = useMemo(() => {
    return projects
      .filter((p) => {
        if (selectedState !== 'All' && p.state !== selectedState) return false;
        if (selectedCategory !== 'All' && p.category !== selectedCategory) return false;
        if (selectedRiskTier !== 'All' && p.riskTier !== selectedRiskTier) return false;
        if (selectedFY !== 'All' && p.financialYear !== selectedFY) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = p.id.toLowerCase().includes(q);
          const matchTitle = p.title.toLowerCase().includes(q);
          const matchMp = p.mpName.toLowerCase().includes(q);
          const matchDistrict = p.district.toLowerCase().includes(q);
          const matchAgency = p.implementingAgency.toLowerCase().includes(q);
          if (!matchId && !matchTitle && !matchMp && !matchDistrict && !matchAgency) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        let diff = 0;
        if (sortBy === 'riskScore') diff = a.riskScore - b.riskScore;
        else if (sortBy === 'delayDays') diff = a.delayDays - b.delayDays;
        else if (sortBy === 'expenditure') diff = a.expenditurePercentage - b.physicalProgressPercentage;
        else if (sortBy === 'amount') diff = a.sanctionedAmountLakhs - b.sanctionedAmountLakhs;
        return sortOrder === 'desc' ? -diff : diff;
      });
  }, [projects, selectedState, selectedCategory, selectedRiskTier, selectedFY, searchQuery, sortBy, sortOrder]);

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'ID,Title,State,District,MP,Category,Sanctioned(L),Spent(L),Progress(%),Delay(Days),RiskScore,RiskTier',
        ...filteredProjects.map(
          (p) =>
            `"${p.id}","${p.title.replace(/"/g, '""')}","${p.state}","${p.district}","${p.mpName}","${p.category}",${p.sanctionedAmountLakhs},${p.expenditureAmountLakhs},${p.physicalProgressPercentage},${p.delayDays},${p.riskScore},"${p.riskTier}"`
        ),
      ].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `MPLADS_Sentinel_Projects_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-5">
      {/* Top Title & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            MPLADS Project Registry & Forensic Analysis
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Total {filteredProjects.length} of {projects.length} works matching active filters.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-xs font-semibold transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Panel */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search bar */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ID, keyword, MP or District..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* State Filter */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All States (National)</option>
              {states.filter((s) => s !== 'All').map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Sectors</option>
              {categories.filter((c) => c !== 'All').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Risk Tier Filter */}
          <div>
            <select
              value={selectedRiskTier}
              onChange={(e) => setSelectedRiskTier(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Risk Tiers</option>
              <option value="Critical">Critical Risk (≥75)</option>
              <option value="High">High Risk (55-74)</option>
              <option value="Medium">Medium Risk (35-54)</option>
              <option value="Low">Low Risk (&lt;35)</option>
            </select>
          </div>

          {/* Financial Year */}
          <div>
            <select
              value={selectedFY}
              onChange={(e) => setSelectedFY(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800/90 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="All">All Financial Years</option>
              {financialYears.filter((fy) => fy !== 'All').map((fy) => (
                <option key={fy} value={fy}>
                  FY {fy}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Sorting Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Sort by:</span>
            <div className="flex gap-1">
              {[
                { label: 'Risk Score', key: 'riskScore' },
                { label: 'Delay Days', key: 'delayDays' },
                { label: 'Spend vs Progress Gap', key: 'expenditure' },
                { label: 'Sanction Outlay', key: 'amount' },
              ].map(({ label, key }) => (
                <button
                  key={key}
                  onClick={() => {
                    if (sortBy === key) {
                      setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'));
                    } else {
                      setSortBy(key as any);
                      setSortOrder('desc');
                    }
                  }}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    sortBy === key
                      ? 'bg-indigo-600 text-white font-bold'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {label} {sortBy === key ? (sortOrder === 'desc' ? '↓' : '↑') : ''}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                setSelectedState('All');
                setSelectedCategory('All');
                setSelectedRiskTier('All');
                setSelectedFY('All');
                setSearchQuery('');
              }}
              className="text-[11px] text-slate-400 hover:text-slate-200 underline"
            >
              Reset Filters
            </button>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Project ID & Title</th>
                <th className="py-3 px-3">Location & MP</th>
                <th className="py-3 px-3">Sector</th>
                <th className="py-3 px-3 text-right">Sanction / Spent</th>
                <th className="py-3 px-3">Progress vs Spend</th>
                <th className="py-3 px-3">Delay</th>
                <th className="py-3 px-3">Risk Assessment</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {filteredProjects.map((project) => {
                const isCritical = project.riskTier === 'Critical';
                const disconnect = project.expenditurePercentage - project.physicalProgressPercentage;

                return (
                  <tr
                    key={project.id}
                    className={`hover:bg-slate-800/50 transition-colors ${
                      project.id === 'MPL-2026-1021'
                        ? 'bg-red-950/30 ring-1 ring-inset ring-red-500/30'
                        : ''
                    }`}
                  >
                    {/* ID and Title */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="font-mono font-bold text-amber-400 text-xs">
                          {project.id}
                        </span>
                        {project.duplicateMatch && (
                          <span className="bg-red-950 text-red-400 border border-red-800 text-[9px] font-bold px-1.5 py-0.2 rounded">
                            {project.duplicateMatch.similarityScore}% DUPLICATE
                          </span>
                        )}
                      </div>
                      <div
                        onClick={() => navigate(`/projects/${project.id}`)}
                        className="font-medium text-slate-100 line-clamp-1 hover:text-indigo-400 cursor-pointer"
                        title={project.title}
                      >
                        {project.title}
                      </div>
                    </td>

                    {/* Location */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="font-semibold text-slate-200">
                        {project.district}, {project.state}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {project.mpName}
                      </div>
                    </td>

                    {/* Sector */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[11px] border border-slate-700">
                        {project.category}
                      </span>
                    </td>

                    {/* Financials */}
                    <td className="py-3 px-3 text-right whitespace-nowrap font-mono">
                      <div className="font-bold text-slate-100">
                        ₹{project.expenditureAmountLakhs.toFixed(1)}L
                      </div>
                      <div className="text-[10px] text-slate-400">
                        of ₹{project.sanctionedAmountLakhs.toFixed(1)}L
                      </div>
                    </td>

                    {/* Progress vs Spend Bar */}
                    <td className="py-3 px-3 min-w-[140px]">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-slate-400">Prog: <strong className="text-slate-200">{project.physicalProgressPercentage}%</strong></span>
                        <span className="text-slate-400">Exp: <strong className={disconnect > 25 ? 'text-red-400' : 'text-blue-400'}>{project.expenditurePercentage}%</strong></span>
                      </div>
                      <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden flex">
                        <div
                          className="bg-emerald-500 h-full"
                          style={{ width: `${project.physicalProgressPercentage}%` }}
                          title={`Physical Progress: ${project.physicalProgressPercentage}%`}
                        />
                        {disconnect > 0 && (
                          <div
                            className="bg-red-500/80 h-full animate-pulse"
                            style={{ width: `${Math.min(100 - project.physicalProgressPercentage, disconnect)}%` }}
                            title={`Disbursement Disconnect: +${disconnect}%`}
                          />
                        )}
                      </div>
                    </td>

                    {/* Delay */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      {project.delayDays > 0 ? (
                        <span className={`font-semibold ${project.delayDays > 120 ? 'text-red-400' : 'text-amber-400'}`}>
                          +{project.delayDays}d
                        </span>
                      ) : (
                        <span className="text-emerald-400 font-semibold">On Time</span>
                      )}
                    </td>

                    {/* Risk Badge */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <RiskBadge tier={project.riskTier} score={project.riskScore} size="sm" />
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => navigate(`/projects/${project.id}`)}
                          className="p-1.5 bg-indigo-600/80 hover:bg-indigo-600 text-white rounded-lg transition-colors"
                          title="View Full Forensic Dossier"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        {isCritical && (
                          <button
                            onClick={() => freezeProjectTranche(project.id)}
                            className="p-1.5 bg-red-950 hover:bg-red-900 text-red-300 border border-red-800 rounded-lg transition-colors"
                            title="Freeze Payment Tranche"
                          >
                            <Snowflake className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filteredProjects.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-xs">
              No projects matched the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
