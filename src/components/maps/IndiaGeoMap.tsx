import React, { useState } from 'react';
import { Project } from '../../types/project';
import { useNavigate } from 'react-router-dom';
import { MapPin, AlertOctagon, AlertTriangle, CheckCircle2, Compass, Layers, ZoomIn, ZoomOut, Eye } from 'lucide-react';

interface IndiaGeoMapProps {
  projects: Project[];
  selectedProjectId?: string;
  onSelectProject?: (project: Project) => void;
  height?: string;
}

export const IndiaGeoMap: React.FC<IndiaGeoMapProps> = ({
  projects,
  selectedProjectId,
  onSelectProject,
  height = '540px',
}) => {
  const navigate = useNavigate();
  const [activeTier, setActiveTier] = useState<string>('All');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [hoveredProject, setHoveredProject] = useState<Project | null>(null);
  const [activePopup, setActivePopup] = useState<Project | null>(
    projects.find((p) => p.id === selectedProjectId) || null
  );

  const filteredProjects = projects.filter((p) => {
    if (activeTier === 'All') return true;
    return p.riskTier === activeTier;
  });

  // Normalized map coordinates for India (Bounding Box: Lat ~8 to 36, Lng ~68 to 97)
  const mapCoordsToPercent = (lat: number, lng: number) => {
    const minLat = 7.5;
    const maxLat = 35.5;
    const minLng = 68.0;
    const maxLng = 97.0;

    const x = ((lng - minLng) / (maxLng - minLng)) * 100;
    const y = 100 - ((lat - minLat) / (maxLat - minLat)) * 100; // Invert latitude for SVG/CSS screen coords

    return {
      x: Math.max(5, Math.min(95, x)),
      y: Math.max(5, Math.min(95, y)),
    };
  };

  const getMarkerColor = (tier: string) => {
    switch (tier) {
      case 'Critical':
        return '#ef4444';
      case 'High':
        return '#f97316';
      case 'Medium':
        return '#eab308';
      case 'Low':
        return '#10b981';
      default:
        return '#64748b';
    }
  };

  return (
    <div
      className="relative w-full rounded-2xl bg-slate-950 border border-slate-800 shadow-xl overflow-hidden select-none"
      style={{ height }}
    >
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-lg max-w-xs">
        <div className="flex items-center gap-2 mb-2">
          <Compass className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-slate-100 uppercase tracking-wider">
            National GIS Surveillance Grid
          </h3>
        </div>
        <p className="text-[11px] text-slate-400 mb-3 leading-tight">
          Plotting {filteredProjects.length} geocoded projects across Indian States & Constituencies.
        </p>

        {/* Filter Badges */}
        <div className="flex flex-wrap gap-1">
          {['All', 'Critical', 'High', 'Medium', 'Low'].map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={`text-[10px] px-2 py-0.5 rounded-full font-semibold transition-all ${
                activeTier === tier
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {tier}
            </button>
          ))}
        </div>
      </div>

      {/* Legend & Controls Overlay */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-2.5 shadow-lg flex items-center gap-3 text-[11px] text-slate-300">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500/50" />
          <span>Critical</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-orange-500 inline-block shadow-sm shadow-orange-500/50" />
          <span>High</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block" />
          <span>Medium</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block shadow-sm shadow-emerald-500/50" />
          <span>Low</span>
        </div>
      </div>

      {/* Zoom controls */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5">
        <button
          onClick={() => setZoomLevel((z) => Math.min(2, z + 0.25))}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 shadow-md transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(0.75, z - 0.25))}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 shadow-md transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoomLevel(1);
            setActivePopup(null);
          }}
          className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 shadow-md transition-colors"
          title="Reset View"
        >
          <Layers className="w-4 h-4" />
        </button>
      </div>

      {/* Canvas GIS Container with Grid */}
      <div
        className="w-full h-full relative transition-transform duration-300 flex items-center justify-center overflow-hidden"
        style={{
          transform: `scale(${zoomLevel})`,
          backgroundImage: `
            radial-gradient(circle at 50% 50%, rgba(30, 41, 59, 0.4) 0%, rgba(15, 23, 42, 0.9) 100%),
            linear-gradient(to right, rgba(51, 65, 85, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(51, 65, 85, 0.15) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
        }}
      >
        {/* Subtle SVG outline representation of India territory */}
        <svg
          viewBox="0 0 1000 1100"
          className="w-full h-full opacity-20 pointer-events-none absolute inset-0 text-indigo-400 stroke-current fill-indigo-950/20"
        >
          {/* Schematic stylized polygon representing India subcontinent boundaries */}
          <path
            d="M 330 110 L 390 120 L 440 180 L 420 230 L 460 260 L 580 290 L 680 300 L 760 310 L 840 280 L 890 320 L 860 380 L 790 390 L 730 420 L 680 430 L 600 480 L 570 540 L 590 620 L 580 720 L 520 840 L 480 940 L 470 990 L 460 950 L 410 820 L 370 730 L 330 630 L 290 530 L 240 450 L 220 380 L 260 310 L 300 240 Z"
            strokeWidth="3"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Project Markers */}
        {filteredProjects.map((project) => {
          const { x, y } = mapCoordsToPercent(project.location.lat, project.location.lng);
          const isSelected = selectedProjectId === project.id || activePopup?.id === project.id;
          const isCritical = project.riskTier === 'Critical';

          return (
            <div
              key={project.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform hover:scale-125"
              style={{ left: `${x}%`, top: `${y}%` }}
              onClick={() => {
                setActivePopup(project);
                if (onSelectProject) onSelectProject(project);
              }}
              onMouseEnter={() => setHoveredProject(project)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Outer pulsing beacon for critical and selected items */}
              {(isCritical || isSelected) && (
                <div
                  className="absolute -inset-2 rounded-full animate-ping opacity-60"
                  style={{ backgroundColor: getMarkerColor(project.riskTier) }}
                />
              )}

              {/* Pin icon */}
              <div
                className={`relative flex items-center justify-center rounded-full shadow-lg border-2 transition-all ${
                  isSelected
                    ? 'w-7 h-7 ring-4 ring-white border-white scale-125'
                    : 'w-5 h-5 border-slate-900'
                }`}
                style={{ backgroundColor: getMarkerColor(project.riskTier) }}
              >
                {project.location.geoAnomalyFlag ? (
                  <AlertOctagon className="w-3 h-3 text-white" />
                ) : (
                  <span className="text-[9px] font-bold text-slate-950">
                    {project.riskScore}
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Active Selected Card / Popup */}
        {activePopup && (
          <div
            className="absolute z-30 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-xl p-4 shadow-2xl text-slate-100 max-w-sm w-full animate-in zoom-in-95 duration-200"
            style={{
              left: `${Math.min(75, Math.max(25, mapCoordsToPercent(activePopup.location.lat, activePopup.location.lng).x))}%`,
              top: `${Math.min(70, Math.max(30, mapCoordsToPercent(activePopup.location.lat, activePopup.location.lng).y))}%`,
              transform: 'translate(-50%, -110%)',
            }}
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-500/30">
                {activePopup.id}
              </span>
              <button
                onClick={() => setActivePopup(null)}
                className="text-slate-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>

            <h4 className="text-xs font-bold text-white line-clamp-2 mb-1">
              {activePopup.title}
            </h4>

            <p className="text-[11px] text-slate-300 mb-2 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-400 shrink-0" />
              <span>{activePopup.district}, {activePopup.state} ({activePopup.constituency})</span>
            </p>

            <div className="grid grid-cols-2 gap-2 bg-slate-800/80 p-2 rounded-lg text-[11px] mb-3">
              <div>
                <span className="text-slate-400 block">Risk Score:</span>
                <span className="font-bold text-red-400 text-sm">{activePopup.riskScore} / 100</span>
              </div>
              <div>
                <span className="text-slate-400 block">Delay:</span>
                <span className="font-bold text-amber-400 text-sm">+{activePopup.delayDays} days</span>
              </div>
              <div>
                <span className="text-slate-400 block">Expenditure:</span>
                <span className="font-semibold text-slate-200">{activePopup.expenditurePercentage}%</span>
              </div>
              <div>
                <span className="text-slate-400 block">Progress:</span>
                <span className="font-semibold text-slate-200">{activePopup.physicalProgressPercentage}%</span>
              </div>
            </div>

            {activePopup.location.geoAnomalyFlag && (
              <div className="bg-red-950/60 border border-red-500/40 text-red-300 text-[10px] p-2 rounded mb-3 flex items-start gap-1.5">
                <AlertOctagon className="w-3.5 h-3.5 text-red-400 shrink-0 mt-0.5" />
                <span>{activePopup.location.geoAnomalyReason || 'Geotag bounds violation detected'}</span>
              </div>
            )}

            <button
              onClick={() => navigate(`/projects/${activePopup.id}`)}
              className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              Open Full Forensic Dossier
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
