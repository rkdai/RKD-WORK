# WorkOS Tracker & Experience Engine

Internal Attendance, Deliverable Tracker, and Experience Certificate Generator for **RKD FURNISHING PVT LTD**.

## Features
- **Daily Attendance & Work Log Engine**: Quick logging with status badges (`Office Present`, `WFH`, `Approved Leave`, `Emergency Leave`), task deliverables, commit/PR links, and blockers.
- **Metrics & Timeline Dashboard**: Real-time KPIs (Total Days, Office vs WFH Split, Leaves Remaining of 18, Reliability %, Shipped Modules), monthly attendance calendar, and search/filter table.
- **Project Modules & Impact Tracker**: Portfolio of major engineering systems built with verified business impact metrics.
- **One-Click Experience Certificate Generator**:
  - Formal Experience & Relieving Certificate (A4 print-ready with corporate letterhead, RKD insignia, and digital seal).
  - Comprehensive Performance & Tenure Report.
  - High-resolution PDF export and zero-clutter print styling.
- **Fast Keyboard Navigation**: Press `Cmd+K` / `Ctrl+K` for command palette, or press `N` to log work in under 5 seconds.
- **PWA Optimized**: Tailored for iPhone 11 and mobile touch screens with bottom navigation and safe-area insets, and laptop/desktop screens.
- **Data Portability**: Full JSON backup/restore and CSV bulk import/export.

## Tech Stack
- Next.js (App Router) + Turbopack
- Tailwind CSS v4
- Lucide React Icons
- jsPDF & html2canvas
- PWA Web App Manifest + Service Worker

## Quick Start
```bash
npm install
npm run dev
```

## Production Build & Static Export
```bash
npm run build
```
Outputs static site to `out/` directory, ready for Cloudflare Workers / Pages deployment.
