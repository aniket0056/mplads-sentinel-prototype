import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppLayout } from './components/layout/AppLayout';

// Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Projects } from './pages/Projects';
import { ProjectDetails } from './pages/ProjectDetails';
import { RiskMonitor } from './pages/RiskMonitor';
import { AnomalyDetection } from './pages/AnomalyDetection';
import { FinancialAnalytics } from './pages/FinancialAnalytics';
import { DelayMonitoring } from './pages/DelayMonitoring';
import { DuplicateDetection } from './pages/DuplicateDetection';
import { GeoIntelligence } from './pages/GeoIntelligence';
import { Alerts } from './pages/Alerts';
import { Reports } from './pages/Reports';
import { DataUpload } from './pages/DataUpload';
import { ModelInsights } from './pages/ModelInsights';
import { AuditTrail } from './pages/AuditTrail';
import { Settings } from './pages/Settings';

export function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public / Auth */}
          <Route path="/login" element={<Login />} />

          {/* Protected Layout */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetails />} />
            <Route path="/risk-monitor" element={<RiskMonitor />} />
            <Route path="/anomalies" element={<AnomalyDetection />} />
            <Route path="/financial" element={<FinancialAnalytics />} />
            <Route path="/delays" element={<DelayMonitoring />} />
            <Route path="/duplicate-detection" element={<DuplicateDetection />} />
            <Route path="/geo-intelligence" element={<GeoIntelligence />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/data-upload" element={<DataUpload />} />
            <Route path="/model-insights" element={<ModelInsights />} />
            <Route path="/audit-trail" element={<AuditTrail />} />
            <Route path="/settings" element={<Settings />} />
          </Route>

          {/* Catch-all fallback */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
