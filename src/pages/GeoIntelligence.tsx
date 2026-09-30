import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { IndiaGeoMap } from '../components/maps/IndiaGeoMap';
import { Project } from '../types/project';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  Compass,
  AlertOctagon,
  Layers,
  Filter,
  Eye,
  ExternalLink,
} from 'lucide-react';

export const GeoIntelligence: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useApp();

  const [selectedProjectId, setSelectedProjectId] = useState<string>('MPL-2026-1021');
  const selectedProject = projects.find((p) => p.id === selectedProjectId) || projects[0];

  const geoAnomalyProjects = projects.filter((p) => p.location.geoAnomalyFlag);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5" />
              GIS Satellite Spatial Layer
            </span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Geospatial Intelligence & Spatial Anomaly Radar
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Correlating mobile e-Sakshi geotags, Survey of India constituency bounding polygons, and environmental riverbed buffer zones.
          </p>
        </div>

        <div className="bg-slate-950 px-4 py-2 rounded-xl border border-slate-800 text-xs">
          <span className="text-slate-400 block text-[10px]">Geotagged Assets:</span>
          <span className="font-mono font-bold text-emerald-400 text-base">{projects.length} Works Mapped</span>
        </div>
      </div>

      {/* Main Map + Side Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Map (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
          <IndiaGeoMap
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={(p) => setSelectedProjectId(p.id)}
            height="580px"
          />
        </div>

        {/* Selected Project Telemetry Side Panel (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Geotagged Asset Telemetry
              </span>
              <span className="font-mono font-bold text-amber-400 text-xs bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                {selectedProject.id}
              </span>
            </div>

            <h3 className="text-sm font-bold text-white leading-snug">
              {selectedProject.title}
            </h3>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Coordinates:</span>
                <span className="font-mono text-slate-200">
                  {selectedProject.location.lat.toFixed(4)}° N, {selectedProject.location.lng.toFixed(4)}° E
                </span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Location:</span>
                <span className="text-slate-200">{selectedProject.district}, {selectedProject.state}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>MP:</span>
                <span className="text-slate-200">{selectedProject.mpName}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Sanction:</span>
                <span className="font-bold text-white">₹{selectedProject.sanctionedAmountLakhs} Lakhs</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Ground Progress:</span>
                <span className="font-bold text-slate-200">{selectedProject.physicalProgressPercentage}%</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Expenditure:</span>
                <span className="font-bold text-red-400">{selectedProject.expenditurePercentage}%</span>
              </div>
            </div>

            {/* Boundary Anomaly Alert */}
            {selectedProject.location.geoAnomalyFlag && (
              <div className="bg-red-950/70 border border-red-600/50 p-3 rounded-xl text-xs text-red-300 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-red-400">
                  <AlertOctagon className="w-4 h-4 shrink-0" />
                  <span>Boundary Violation Detected</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  {selectedProject.location.geoAnomalyReason || 'Pin falls inside restricted buffer polygon.'}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800">
            <button
              onClick={() => navigate(`/projects/${selectedProject.id}`)}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Open Project Dossier</span>
            </button>
          </div>
        </div>
      </div>

      {/* Geospatial Boundary Violations List */}
      {geoAnomalyProjects.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <AlertOctagon className="w-4 h-4 text-red-400" />
            <span>Active Boundary Discrepancies & Terrain Flags ({geoAnomalyProjects.length} Flagged)</span>
          </h3>

          <div className="space-y-2">
            {geoAnomalyProjects.map((p) => (
              <div
                key={p.id}
                onClick={() => setSelectedProjectId(p.id)}
                className={`p-3 bg-slate-950/70 hover:bg-slate-800/60 border rounded-xl cursor-pointer transition-colors flex items-center justify-between text-xs ${
                  selectedProjectId === p.id ? 'border-indigo-500' : 'border-slate-800'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-amber-400">{p.id}</span>
                    <span className="text-slate-200 font-semibold">{p.title}</span>
                  </div>
                  <p className="text-[11px] text-red-400 mt-0.5">
                    {p.location.geoAnomalyReason}
                  </p>
                </div>
                <span className="text-[11px] text-indigo-400 shrink-0 font-medium">
                  Inspect On Map →
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
