# MPLADS Sentinel AI
### National Project Risk, Anomaly & Monitoring Platform
**Ministry of Statistics and Programme Implementation (MoSPI) | Government of India**

---

## 1. Executive Overview

**MPLADS Sentinel AI** is an advanced operational decision-support and risk intelligence platform engineered for monitoring and safeguarding public capital under the **Members of Parliament Local Area Development Scheme (MPLADS)**.

The platform continuously evaluates project execution velocity, disbursements, physical verification milestones, contractor clustering, and spatial overlaps across parliamentary constituencies to identify emerging irregularities before funds are depleted.

### Key Capabilities

- **Multi-Factor Explainable AI (XAI) Risk Engine:** Transparent, mathematically grounded risk scoring decomposing composite risk across 6 orthogonal dimensions.
- **Physical vs. Financial Disconnect Analysis:** Flags works where cumulative expenditure surges ahead of verified physical inspection milestones.
- **Geospatial & Semantic Duplicate Detection:** Identifies potential double-billing across municipal, state, and central schemes within high-risk geographic proximity (< 500m).
- **Proactive Anomaly Tripwires:** Detects March Rush velocity spikes, vendor clustering, and prolonged milestone stagnation.
- **Operational Case Management & Enforcement:** Complete audit trail tracking case assignment, show-cause notices, tranche freezes, and resolutions.
- **Statutory Reporting Engine:** One-click generation and CSV/Print export of 8 operational report types with administrative attestation.
- **Flexible Data Ingestion:** Production-grade CSV upload parser with strict schema validation, column verification, and immediate composite risk scoring.
- **Role-Based Access Control (RBAC):** Tailored operational views for Ministry Officers, State Nodal Officers, District Authorities, Auditors, and Monitoring Officers.

---

## 2. Core Architecture & Risk Methodology

The Sentinel AI risk score represents an objective composite index from 0 to 100 calculated across 6 weighted governance vectors:

$$\text{Risk Score} = 0.30 \times \text{Fin} + 0.20 \times \text{Delay} + 0.20 \times \text{Cost} + 0.15 \times \text{Duplicate} + 0.10 \times \text{Doc} + 0.05 \times \text{Geo}$$

| Weight | Risk Vector | Description |
|:---:|:---|:---|
| **30%** | **Financial Anomaly** | Evaluates gap between percentage funds spent vs. physical completion percentage. |
| **20%** | **Delay Risk** | Days overdue beyond targeted completion date compared against sector benchmarks. |
| **20%** | **Cost Overrun** | Actual expenditure relative to administrative sanction and revised estimates. |
| **15%** | **Duplicate Similarity** | Semantic and geospatial similarity with other active or completed works. |
| **10%** | **Documentation Discrepancy** | Verification of completion certificates, measurement book records, and geo-photos. |
| **5%** | **Geo Anomaly** | Coordinate boundary validation and distance from declared constituency wards. |

### Risk Classification Tiers

- **Critical Risk (Score ≥ 75):** Immediate executive attention, tranche freeze recommendation, priority field inspection.
- **High Risk (Score 60–74):** Stage-gate review required prior to subsequent tranche release.
- **Medium Risk (Score 40–59):** Routine district vigilance monitoring and milestone verification.
- **Low Risk (Score < 40):** Standard execution track within statutory tolerances.

---

## 3. Technology Stack

- **Framework:** React 18 with TypeScript
- **Bundler & Tooling:** Vite 6
- **Styling & Design System:** Tailwind CSS with custom governance design tokens
- **Data Visualization:** Recharts
- **Iconography:** Lucide React
- **Client Routing:** React Router v6
- **Mapping & GIS:** Custom SVG projection studio with Leaflet integration
- **State & Persistence:** React Context API with `localStorage` state retention

---

## 4. Operational Setup & Deployment

### Prerequisites
- Node.js (v18.x or v20.x or higher)
- npm (v9.x or higher)

### Installation & Execution

```bash
# 1. Install dependencies
npm install

# 2. Launch operational development server
npm run dev

# 3. Build optimized production distribution
npm run build

# 4. Preview production build locally
npm run preview
```

The application will be accessible at `http://localhost:5173/`.

---

## 5. Security & Governance Standards

- **GFR 2017 Compliance:** Configured in alignment with General Financial Rules guidelines for public procurement and works execution.
- **Immutable Audit Logging:** Every administrative action—including role transitions, tranche freezes, case status updates, and intelligence refreshes—is recorded with timestamp, actor, and IP address.
- **Data Privacy & Tenancy:** Role-based views ensure district administrators observe projects within their administrative jurisdiction while ministry officers retain nationwide visibility.
