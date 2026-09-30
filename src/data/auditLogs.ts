export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: string;
  action: string;
  category: 'Risk Escalation' | 'Fund Action' | 'Investigation' | 'Data Ingestion' | 'Security';
  details: string;
  targetId?: string;
  severity: 'Critical' | 'Warning' | 'Info';
  ipAddress: string;
}

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'LOG-8821',
    timestamp: '2026-09-24 11:15:22',
    actor: 'Dr. Rajiv Menon',
    role: 'District Collector / DM',
    action: 'Executive Tranche Freeze',
    category: 'Fund Action',
    details: 'Ordered temporary freeze on subsequent tranche disbursement for project MPL-2026-1021 pending ground inspection.',
    targetId: 'MPL-2026-1021',
    severity: 'Critical',
    ipAddress: '10.14.88.21 (GovNIC)',
  },
  {
    id: 'LOG-8820',
    timestamp: '2026-09-24 10:32:04',
    actor: 'AI Risk Engine v2.4',
    role: 'Automated Sentinel',
    action: 'Risk Tier Escalated to Critical (Score: 91)',
    category: 'Risk Escalation',
    details: 'Multi-dimensional risk score crossed 90 threshold due to 40% expenditure-physical gap and duplicate match.',
    targetId: 'MPL-2026-1021',
    severity: 'Critical',
    ipAddress: '127.0.0.1 (Internal Service)',
  },
  {
    id: 'LOG-8819',
    timestamp: '2026-09-24 09:40:11',
    actor: 'Shri Arvind Deshmukh',
    role: 'Auditor / Vigilance',
    action: 'Assigned Investigator',
    category: 'Investigation',
    details: 'Assigned Addl. DM Vigilance as chief inquiring officer for duplicate works probe in Pune Rural.',
    targetId: 'ALT-2026-001',
    severity: 'Warning',
    ipAddress: '10.14.88.35 (GovNIC)',
  },
  {
    id: 'LOG-8818',
    timestamp: '2026-09-23 16:22:45',
    actor: 'System ETL Worker',
    role: 'Automated Pipeline',
    action: 'DigiGov & PFMS Bulk Sync',
    category: 'Data Ingestion',
    details: 'Successfully ingested 42 project records and 1,840 transaction vouchers from PFMS gateway.',
    targetId: 'SYNC-PFMS-994',
    severity: 'Info',
    ipAddress: '10.12.0.4 (NIC Gateway)',
  },
  {
    id: 'LOG-8817',
    timestamp: '2026-09-22 14:10:00',
    actor: 'Smt. Kavita Sharma',
    role: 'State Nodal Officer',
    action: 'Show Cause Issued',
    category: 'Investigation',
    details: 'Issued formal explanation summons to UP Jal Nigam for Baheri drinking water pipeline duplication.',
    targetId: 'MPL-2026-1017',
    severity: 'Warning',
    ipAddress: '10.18.42.12 (GovNIC)',
  },
  {
    id: 'LOG-8816',
    timestamp: '2026-09-21 11:05:33',
    actor: 'AI Duplicate Detector',
    role: 'Automated Sentinel',
    action: 'High Similarity Match Flagged',
    category: 'Risk Escalation',
    details: 'Identified 86% geographic and scope overlap between MPL-2026-1021 and prior asset MPL-2026-1044.',
    targetId: 'MPL-2026-1021',
    severity: 'Critical',
    ipAddress: '127.0.0.1 (Internal Service)',
  },
  {
    id: 'LOG-8815',
    timestamp: '2026-09-20 18:30:19',
    actor: 'Ministry Admin (MoSPI)',
    role: 'Ministry Officer (MoSPI)',
    action: 'Model Sensitivity Threshold Updated',
    category: 'Security',
    details: 'Adjusted delay penalty sensitivity parameter from 0.18 to 0.20 to align with CAG 2026 audit directives.',
    targetId: 'SYS-CONFIG-01',
    severity: 'Info',
    ipAddress: '10.10.1.1 (Central MoSPI)',
  },
  {
    id: 'LOG-8814',
    timestamp: '2026-09-19 14:48:50',
    actor: 'Security Guardian',
    role: 'System',
    action: 'Role Switched: Ministry Officer -> District Authority',
    category: 'Security',
    details: 'Administrative delegation session switched view context to Pune District Collectorate.',
    targetId: 'SESSION-ADM-01',
    severity: 'Info',
    ipAddress: '192.168.1.104',
  },
];
