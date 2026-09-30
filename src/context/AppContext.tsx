import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Project, AlertNotification, UserRole, ReviewCase, InAppNotification } from '../types/project';
import { MOCK_PROJECTS } from '../data/projects';
import { INITIAL_ALERTS } from '../data/alerts';
import { INITIAL_AUDIT_LOGS, AuditLogEntry } from '../data/auditLogs';
import { calculateProjectRisk } from '../services/riskEngine';

const INITIAL_CASES: ReviewCase[] = [
  {
    id: 'CASE-2026-081',
    projectId: 'MPL-2026-1021',
    projectTitle: 'Construction of 4-Lane Bituminous Approach Road & Drain from NH-48 to Shivajinagar Junction',
    riskCategory: 'Financial Disconnect & Potential Duplicate',
    assignedOfficer: 'Shri Arvind Deshmukh (Addl. DM Vigilance)',
    priority: 'Critical',
    createdDate: '2026-09-24',
    status: 'Under Review',
    notes: 'Ground physical progress stalled at 52% while 92% funds disbursed. Overlapping chainage with MPL-2026-1044.',
    evidence: 'Physical audit report #PV-441; satellite imagery comparison.',
    reviewHistory: [
      { date: '2026-09-24 10:32', action: 'Case Created', actor: 'Automated Risk Engine', note: 'Escalated due to Risk Score = 91' },
      { date: '2026-09-24 11:15', action: 'Tranche Frozen', actor: 'Dr. Rajiv Menon (DM)', note: 'Interim payment stop order issued' },
    ],
  },
  {
    id: 'CASE-2026-082',
    projectId: 'MPL-2026-1007',
    projectTitle: 'Desilting and Boulder Pitching of Punpun River Embankment Drainage Canal',
    riskCategory: 'Excavation Verification Risk',
    assignedOfficer: 'Chief Engineer (Minor Irrigation)',
    priority: 'Critical',
    createdDate: '2026-09-23',
    status: 'Assigned',
    notes: '93% budget spent without matching material cross-section changes on satellite radar.',
    evidence: 'Hydrological satellite sweep; payment voucher records.',
    reviewHistory: [
      { date: '2026-09-23 15:15', action: 'Case Created', actor: 'System Monitoring', note: '273 days overdue' },
    ],
  },
  {
    id: 'CASE-2026-083',
    projectId: 'MPL-2026-1029',
    projectTitle: 'Installation of Solar Submersible Deep Tube Wells for Community Irrigation in Shankargarh',
    riskCategory: 'Physical Verification Discrepancy',
    assignedOfficer: 'Sub-Divisional Magistrate (Yamunapar)',
    priority: 'Critical',
    createdDate: '2026-09-22',
    status: 'Inspection',
    notes: '5 out of 8 billed borewells not physically verifiable on site.',
    evidence: 'Field inspection log #SDM-Y-92.',
    reviewHistory: [
      { date: '2026-09-22 11:45', action: 'Case Created', actor: 'System Monitoring', note: 'Physical asset verification flag' },
    ],
  },
];

const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'NOTIF-1',
    title: 'Critical Risk Alert Generated',
    message: 'Project MPL-2026-1021 flagged with 40% financial-physical gap.',
    projectId: 'MPL-2026-1021',
    timestamp: '10 min ago',
    type: 'alert',
    isRead: false,
  },
  {
    id: 'NOTIF-2',
    title: 'Potential Duplicate Work Identified',
    message: '86% overlap detected between MPL-2026-1021 and MPL-2026-1044 in Pune Rural.',
    projectId: 'MPL-2026-1021',
    timestamp: '45 min ago',
    type: 'alert',
    isRead: false,
  },
  {
    id: 'NOTIF-3',
    title: 'Inquiry Case Assigned',
    message: 'Shri Arvind Deshmukh designated to investigate Baheri water pipeline project.',
    projectId: 'MPL-2026-1017',
    timestamp: '2 hours ago',
    type: 'case',
    isRead: true,
  },
  {
    id: 'NOTIF-4',
    title: 'Quarterly Data Sync Completed',
    message: 'Local project repository synchronized with latest district sanction updates.',
    timestamp: '3 hours ago',
    type: 'sync',
    isRead: true,
  },
];

interface AppContextType {
  currentUserRole: UserRole;
  setCurrentUserRole: (role: UserRole) => void;
  projects: Project[];
  alerts: AlertNotification[];
  cases: ReviewCase[];
  notifications: InAppNotification[];
  auditLogs: AuditLogEntry[];
  lastDataSync: string;
  lastAiAnalysis: string;
  systemStatus: string;
  isRefreshing: boolean;
  refreshToast: string | null;
  refreshIntelligence: () => void;
  updateAlertStatus: (
    id: string,
    status: AlertNotification['status'],
    notes?: string,
    assignedTo?: string
  ) => void;
  createOrUpdateCase: (newCase: Partial<ReviewCase> & { projectId: string; projectTitle: string }) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  freezeProjectTranche: (projectId: string) => void;
  addAuditEntry: (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress'>) => void;
  addUploadedProjects: (newProjects: Project[]) => void;
  displayedProjects: Project[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial states with localStorage persistence where available
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(() => {
    return (localStorage.getItem('mplads_role') as UserRole) || 'Ministry Officer';
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('mplads_projects');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return MOCK_PROJECTS;
  });

  const [alerts, setAlerts] = useState<AlertNotification[]>(() => {
    const saved = localStorage.getItem('mplads_alerts');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_ALERTS;
  });

  const [cases, setCases] = useState<ReviewCase[]>(() => {
    const saved = localStorage.getItem('mplads_cases');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_CASES;
  });

  const [notifications, setNotifications] = useState<InAppNotification[]>(() => {
    const saved = localStorage.getItem('mplads_notifications');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem('mplads_audit_logs');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [lastDataSync] = useState<string>('29 Sep 2026 • 19:48 IST');
  const [lastAiAnalysis, setLastAiAnalysis] = useState<string>('29 Sep 2026 • 19:50 IST');
  const [systemStatus] = useState<string>('Operational');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [refreshToast, setRefreshToast] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('mplads_role', currentUserRole);
  }, [currentUserRole]);

  useEffect(() => {
    localStorage.setItem('mplads_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('mplads_alerts', JSON.stringify(alerts));
  }, [alerts]);

  useEffect(() => {
    localStorage.setItem('mplads_cases', JSON.stringify(cases));
  }, [cases]);

  useEffect(() => {
    localStorage.setItem('mplads_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('mplads_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  const addAuditEntry = (entry: Omit<AuditLogEntry, 'id' | 'timestamp' | 'ipAddress'>) => {
    const newEntry: AuditLogEntry = {
      id: `LOG-${Math.floor(8822 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      ipAddress: '10.14.88.21 (GovNIC)',
      ...entry,
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  };

  const refreshIntelligence = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      // Recalculate project risk scores using riskEngine
      setProjects((prev) =>
        prev.map((p) => {
          const calc = calculateProjectRisk(p);
          return {
            ...p,
            riskScore: calc.riskScore,
            riskTier: calc.riskTier,
            riskBreakdown: calc.breakdown,
            explainableFactors: calc.explainableFactors,
          };
        })
      );

      const now = new Date();
      const timeStr = `${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} IST`;
      setLastAiAnalysis(`Today • ${timeStr}`);
      setIsRefreshing(false);
      setRefreshToast('Risk intelligence refreshed successfully.');

      addAuditEntry({
        actor: currentUserRole,
        role: currentUserRole,
        action: 'Risk Analysis Refreshed',
        category: 'Risk Escalation',
        details: 'Comprehensive risk indicators and anomaly scores recalculated across all monitored projects.',
        severity: 'Info',
      });

      setTimeout(() => setRefreshToast(null), 4000);
    }, 700);
  };

  const updateAlertStatus = (
    id: string,
    status: AlertNotification['status'],
    notes?: string,
    assignedTo?: string
  ) => {
    setAlerts((prev) =>
      prev.map((alt) => {
        if (alt.id === id) {
          return {
            ...alt,
            status,
            actionTakenNotes: notes || alt.actionTakenNotes,
            assignedTo: assignedTo || alt.assignedTo,
          };
        }
        return alt;
      })
    );

    addAuditEntry({
      actor: currentUserRole,
      role: currentUserRole,
      action: `Alert Status Updated: ${status}`,
      category: 'Investigation',
      details: `Alert ${id} transitioned to ${status}. ${notes ? `Notes: ${notes}` : ''}`,
      targetId: id,
      severity: status === 'Escalated' || status === 'Resolved' ? 'Critical' : 'Warning',
    });
  };

  const createOrUpdateCase = (newCaseData: Partial<ReviewCase> & { projectId: string; projectTitle: string }) => {
    const existingIndex = cases.findIndex((c) => c.projectId === newCaseData.projectId);
    const nowStr = new Date().toISOString().substring(0, 10);

    if (existingIndex >= 0) {
      setCases((prev) => {
        const copy = [...prev];
        copy[existingIndex] = {
          ...copy[existingIndex],
          ...newCaseData,
          reviewHistory: [
            {
              date: new Date().toISOString().replace('T', ' ').substring(0, 16),
              action: `Status Updated to ${newCaseData.status || copy[existingIndex].status}`,
              actor: currentUserRole,
              note: newCaseData.notes || 'Review details updated.',
            },
            ...copy[existingIndex].reviewHistory,
          ],
        };
        return copy;
      });
    } else {
      const newCase: ReviewCase = {
        id: `CASE-2026-${Math.floor(100 + Math.random() * 900)}`,
        projectId: newCaseData.projectId,
        projectTitle: newCaseData.projectTitle,
        riskCategory: newCaseData.riskCategory || 'Administrative Review',
        assignedOfficer: newCaseData.assignedOfficer || 'Shri Arvind Deshmukh (Addl. DM Vigilance)',
        priority: newCaseData.priority || 'Critical',
        createdDate: nowStr,
        status: newCaseData.status || 'Assigned',
        notes: newCaseData.notes || 'Initiated administrative review based on AI risk flags.',
        evidence: newCaseData.evidence || 'Field inspection photos and measurement book.',
        reviewHistory: [
          {
            date: new Date().toISOString().replace('T', ' ').substring(0, 16),
            action: 'Case Created',
            actor: currentUserRole,
            note: 'Formal inquiry record generated',
          },
        ],
      };
      setCases((prev) => [newCase, ...prev]);
    }

    addAuditEntry({
      actor: currentUserRole,
      role: currentUserRole,
      action: 'Administrative Review Case Updated',
      category: 'Investigation',
      details: `Review case for project ${newCaseData.projectId} updated with status: ${newCaseData.status || 'Under Review'}.`,
      targetId: newCaseData.projectId,
      severity: 'Warning',
    });
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const freezeProjectTranche = (projectId: string) => {
    setProjects((prev) =>
      prev.map((p) => {
        if (p.id === projectId) {
          return {
            ...p,
            status: 'Suspended' as const,
          };
        }
        return p;
      })
    );

    addAuditEntry({
      actor: currentUserRole,
      role: currentUserRole,
      action: 'Payment Tranche Frozen',
      category: 'Fund Action',
      details: `Executive tranche stop order executed for ${projectId}. Treasury disbursement account suspended.`,
      targetId: projectId,
      severity: 'Critical',
    });
  };

  const addUploadedProjects = (newProjects: Project[]) => {
    setProjects((prev) => [...newProjects, ...prev]);
    addAuditEntry({
      actor: currentUserRole,
      role: currentUserRole,
      action: 'Data Ingestion Complete',
      category: 'Data Ingestion',
      details: `Imported ${newProjects.length} validated project records into MPLADS Sentinel repository.`,
      severity: 'Info',
    });
  };

  // Filter projects depending on the active role view
  const displayedProjects = React.useMemo(() => {
    if (currentUserRole === 'State Nodal Officer') {
      // Focus on state level (e.g. Maharashtra)
      return projects.filter((p) => p.state === 'Maharashtra');
    }
    if (currentUserRole === 'District Authority') {
      // Focus on district level (e.g. Pune)
      return projects.filter((p) => p.district === 'Pune');
    }
    // Ministry Officer, Auditor, Monitoring Officer view all
    return projects;
  }, [projects, currentUserRole]);

  return (
    <AppContext.Provider
      value={{
        currentUserRole,
        setCurrentUserRole,
        projects,
        alerts,
        cases,
        notifications,
        auditLogs,
        lastDataSync,
        lastAiAnalysis,
        systemStatus,
        isRefreshing,
        refreshToast,
        refreshIntelligence,
        updateAlertStatus,
        createOrUpdateCase,
        markNotificationRead,
        markAllNotificationsRead,
        freezeProjectTranche,
        addAuditEntry,
        addUploadedProjects,
        displayedProjects,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
