const { createClient } = require('@libsql/client');
const path = require('path');

const client = createClient({
  url: 'libsql://workos-rkdai.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE1Mjg4ODIsImlkIjoiMDFhMTFmNzEtMTQwMS03NzBmLWE1MmQtNTJmNDljNzM3NTE1Iiwia2lkIjoiN0RHNU9lQ2NLQ1pvZ1VjbUFaV2JKTUhObGFzOWN2b2NBR1VJUmRSUmZEdyIsInJpZCI6IjlhMjVmOGJmLTUxMGQtNGQ5My05YzljLWYxNGZhNDBkMjM5NiJ9.3EfPQ_euLRZQUIBqs7tEE-x6aFfdw6W8ixE6Q6b4Blbyb8inHuWnJbFbspvy3mIrRAiH-LZwVZUgjRFdJ-T7CA'
});

// Load the compiled seedData or execute ts-node / plain data
const fs = require('fs');

const DEFAULT_PROFILE = {
  employeeName: 'Rihan',
  employeeId: 'RKD-ENG-2026-08',
  designation: 'AI Systems & Workflow Builder',
  department: 'Technology, AI & Automation',
  companyName: 'RKD FURNISHING PVT LTD',
  companyAddress: 'Industrial Area, Sector 25, Panipat - 132103, Haryana, India',
  companyWebsite: 'https://rkd.in',
  joiningDate: '2026-03-02',
  relievingDate: '2026-10-15',
  isCurrentlyEmployed: 1,
  managerName: 'Bhupinder Pal Singh',
  managerTitle: 'Director of Operations & Digital Initiatives',
  leavesAllowance: 18,
  responsibilities: JSON.stringify([
    'Architected and deployed end-to-end AI workflow agents for market intelligence, automating research and content generation.',
    'Engineered real-time currency alert PWA with Cloudflare Workers, Turso Edge database, and native Web Push delivery.',
    'Developed Three.js interactive 3D virtual exhibition booth visualizers for international textile client presentations.',
    'Built internal data synchronization pipelines and ERP automation tools reducing manual entry and turnaround times by 80%.',
    'Maintained continuous high-availability deployments on Cloudflare and Vercel infrastructure.'
  ])
};

const INITIAL_MODULES = [
  {
    id: 'mod-1',
    title: 'RKD Research Based Content Agent (RBC v5)',
    category: 'AI Systems',
    status: 'Shipped',
    startDate: '2026-08-10',
    completionDate: '2026-09-18',
    impact: 'Generated 1,000+ targeted posts and scanned 16,000+ global furnishing news feeds automatically',
    techStack: JSON.stringify(['Next.js', 'Vercel Cron', 'Gemini AI', 'Tailwind CSS', 'LinkedIn API']),
    repoOrDocUrl: 'https://rkd-rbc-agents.vercel.app',
    keyFeatures: JSON.stringify([
      'Automated weekly Monday reports at 9:00 AM IST via Vercel Cron',
      'Multi-channel keyword engine for Rugs, Cushions, Floor Coverings, and Area Rugs',
      'One-click LinkedIn and Instagram post formatter with company tone of voice'
    ])
  },
  {
    id: 'mod-2',
    title: 'USD-to-INR Real-Time Price Alert PWA',
    category: 'Automation',
    status: 'Shipped',
    startDate: '2026-09-28',
    completionDate: '2026-10-07',
    impact: 'Saved management 30+ daily manual forex checks with scheduled instant push notifications',
    techStack: JSON.stringify(['Cloudflare Workers', 'Turso SQLite', 'Web Push VAPID', 'Vanilla PWA', 'Google Forex Feed']),
    repoOrDocUrl: 'https://rkd-price-alert.rkd-pirce-alert.workers.dev',
    keyFeatures: JSON.stringify([
      'Real-time forex rate extraction matching Google Finance down to 4 decimal precision',
      'Per-minute Cloudflare cron scheduling with custom user notification IST time preferences',
      'Native iOS 16.4+ and Android PWA installability with OLED black and gold luxury aesthetics'
    ])
  },
  {
    id: 'mod-3',
    title: 'Three.js 3D Virtual Exhibition Stall Generator',
    category: 'Frontend',
    status: 'Shipped',
    startDate: '2026-09-15',
    completionDate: '2026-10-02',
    impact: 'Cut 3D design iteration time for international trade shows from 5 days to 20 minutes',
    techStack: JSON.stringify(['Three.js', 'WebGL', 'React', 'OrbitControls', 'GLTF Loader', 'Tailwind CSS']),
    repoOrDocUrl: 'https://github.com/rkdai/3D-STALL-VIEWER',
    keyFeatures: JSON.stringify([
      'Real-time lighting, rug & cushion texture displacement shaders',
      'Interactive booth walkthrough with camera orbit navigation and dimension inspection',
      'Instant snapshot export in ultra-high resolution for buyer catalogs'
    ])
  },
  {
    id: 'mod-4',
    title: 'Internal ERP Sync & Catalog Export Engine',
    category: 'Backend',
    status: 'Shipped',
    startDate: '2026-04-12',
    completionDate: '2026-06-25',
    impact: 'Reduced manual catalog data entry errors by 85% across 2,400+ SKU inventory items',
    techStack: JSON.stringify(['Node.js', 'PostgreSQL', 'Express', 'ExcelJS', 'Sharp Image Pipeline']),
    repoOrDocUrl: 'https://github.com/rkdai/erp-sync-service',
    keyFeatures: JSON.stringify([
      'Bidirectional SKU price and inventory synchronization with central Panipat warehouse',
      'Automated high-res watermarked PDF catalog generation for overseas exports',
      'Bulk CSV reconciliation and conflict resolution engine'
    ])
  },
  {
    id: 'mod-5',
    title: 'Yarn Dyed Tufted Texture AI Dataset Classifier',
    category: 'AI Systems',
    status: 'Shipped',
    startDate: '2026-07-02',
    completionDate: '2026-08-08',
    impact: 'Trained model on 3,500+ fabric samples to predict weave density and yarn color accuracy',
    techStack: JSON.stringify(['Python', 'PyTorch', 'FastAPI', 'OpenCV', 'Next.js']),
    repoOrDocUrl: 'https://github.com/rkdai/yarn-ai-classifier',
    keyFeatures: JSON.stringify([
      'Automatic visual defect detection on high-speed camera feeds',
      'Color fidelity grading according to Pantone textile standards',
      'Automated batch inspection logging with zero manual sampling'
    ])
  },
  {
    id: 'mod-6',
    title: 'WorkOS Tracker & Experience Engine',
    category: 'Infrastructure',
    status: 'Shipped',
    startDate: '2026-10-01',
    completionDate: '2026-10-09',
    impact: 'Single-source of truth for attendance, modules shipped, and instant certificate generation',
    techStack: JSON.stringify(['Next.js App Router', 'Tailwind CSS v4', 'Lucide React', 'jsPDF', 'PWA']),
    repoOrDocUrl: 'https://github.com/rkdai/workos-tracker',
    keyFeatures: JSON.stringify([
      '5-second quick log flow with keyboard shortcuts (Cmd+K / N)',
      'Formal relieving & experience certificate generator with print-ready A4 styling',
      'Comprehensive performance analytics and CSV/JSON backup sync'
    ])
  }
];

function generateLogs() {
  const logs = [];
  const start = new Date(2026, 2, 2); // March 2, 2026
  const end = new Date(2026, 9, 9); // October 9, 2026

  const dailyTasksPlan = {
    '2026-03-02': { status: 'Office Present', task: 'Onboarding, workstation setup, and architecture review for RKD digital infrastructure' },
    '2026-03-06': { status: 'Office Present', task: 'Audited legacy Excel catalog format and identified repetitive data entry pain points' },
    '2026-03-13': { status: 'WFH', task: 'Prototyped initial automated SKU parser for Panipat textile collections' },
    '2026-03-25': { status: 'Approved Leave', task: 'Approved Personal Leave', notes: 'Prior approval taken for family commitment' },
    '2026-04-03': { status: 'Office Present', task: 'Built core ExcelJS pipeline for automated bulk product catalog transformation' },
    '2026-04-17': { status: 'Office Present', task: 'Integrated sharp image processing pipeline to compress and watermark 4K fabric samples' },
    '2026-04-28': { status: 'WFH', task: 'Drafted schema for ERP bidirectional sync and inventory delta tracking' },
    '2026-05-08': { status: 'Office Present', task: 'Tested ERP inventory sync on staging with 500 bathmat SKUs; fixed race condition in stock update' },
    '2026-05-22': { status: 'Office Present', task: 'Shipped production deployment of Internal ERP Sync & Catalog Export Engine v1' },
    '2026-06-05': { status: 'Approved Leave', task: 'Approved Summer Leave', notes: 'Planned annual leave' },
    '2026-06-19': { status: 'Office Present', task: 'Setup automated weekly Monday report trigger and initial email rendering templates' },
    '2026-07-03': { status: 'Office Present', task: 'Initiated Yarn Dyed Tufted AI dataset collection; gathered first 800 high-res texture photographs' },
    '2026-07-16': { status: 'WFH', task: 'Trained OpenCV edge detection script for weave density calculation and defect identification' },
    '2026-07-28': { status: 'Emergency Leave', task: 'Emergency Health Leave', notes: 'Sudden fever, recovered within 24h' },
    '2026-08-04': { status: 'Office Present', task: 'Finalized and validated Yarn AI classifier with 94.2% accuracy against physical swatches' },
    '2026-08-14': { status: 'Office Present', task: 'Architected RKD Research Based Content Agent (RBC v5) pipeline with Gemini 1.5' },
    '2026-08-25': { status: 'WFH', task: 'Configured automated news scrapers for global furnishing trends and consumer sentiment' },
    '2026-09-04': { status: 'Office Present', task: 'Shipped RBC Agent v5 to production; automated 1,000+ posts generation and Vercel Cron' },
    '2026-09-15': { status: 'Office Present', task: 'Started Three.js 3D Virtual Exhibition Stall Generator; setup WebGL canvas and lighting rigs' },
    '2026-09-22': { status: 'Office Present', task: 'Implemented camera orbit controls, floor rug displacement shaders, and lighting presets' },
    '2026-09-29': { status: 'Office Present', task: 'Architected USD to INR Price Alert PWA; designed OLED black and gold luxury UI system' },
    '2026-10-02': { status: 'Approved Leave', task: 'National Holiday (Gandhi Jayanti)', notes: 'Company holiday' },
    '2026-10-06': { status: 'Office Present', task: 'Integrated Web Push (VAPID) and Turso SQLite database on Cloudflare Workers edge' },
    '2026-10-07': { status: 'Office Present', task: 'Connected real-time Google Finance forex feed; deployed PWA with 5-minute sync to production' },
    '2026-10-08': { status: 'Office Present', task: 'Configured team access for 6 users (Rajesh, Kunal, Aman, Himanshu, Ryan, Bhupinder)' },
    '2026-10-09': { status: 'Office Present', task: 'Engineered WorkOS Tracker & Experience Engine with instant certificate generation & PWA' },
  };

  const genericOfficeTasks = [
    'Refactored frontend component lifecycle and state caching for reduced layout shifts',
    'Audited Cloudflare edge worker latencies and optimized response headers for PWA assets',
    'Designed responsive mobile layout breakpoints and touched up dark theme color tokens',
    'Constructed automated database schema migrations and validation middleware',
    'Reviewed security audit rules, CORS headers, and edge route rate-limiting configurations',
    'Refactored data synchronization handlers and implemented optimistic offline state updates',
    'Built automated tabular reporting engine and unit tests for KPI aggregations',
    'Polished UI typography, micro-interactions, and command palette navigation hooks'
  ];

  const genericWfhTasks = [
    'Remote sprint: Engineered data transform utilities and wrote comprehensive test suites',
    'Remote sprint: Profiled bundle size, tree-shook unused packages, and improved Lighthouse metrics',
    'Remote sprint: Drafted comprehensive system architecture documentation and API schemas',
    'Remote sprint: Researched Web Push service worker lifecycle events across iOS Safari versions'
  ];

  let curr = new Date(start);
  let dayIndex = 0;

  while (curr <= end) {
    const dayOfWeek = curr.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Weekdays
      const yyyy = curr.getFullYear();
      const mm = String(curr.getMonth() + 1).padStart(2, '0');
      const dd = String(curr.getDate()).padStart(2, '0');
      const dateStr = `${yyyy}-${mm}-${dd}`;

      let status = 'Office Present';
      let tasks = genericOfficeTasks[dayIndex % genericOfficeTasks.length];
      let notes = 'Daily sprint deliverables completed and verified.';
      let link = 'https://github.com/rkdai';
      let hours = 8.5;

      if (dailyTasksPlan[dateStr]) {
        status = dailyTasksPlan[dateStr].status;
        tasks = dailyTasksPlan[dateStr].task;
        notes = dailyTasksPlan[dateStr].notes || notes;
        link = dailyTasksPlan[dateStr].link || link;
        hours = status.includes('Leave') ? 0 : 8.5;
      } else if (dayOfWeek === 3 || dayOfWeek === 5) {
        if (dayIndex % 3 === 0) {
          status = 'WFH';
          tasks = genericWfhTasks[dayIndex % genericWfhTasks.length];
          notes = 'Working remotely; synced via daily Slack updates.';
          hours = 8.0;
        }
      }

      logs.push({
        id: `log-${dateStr}`,
        date: dateStr,
        status,
        tasks,
        link,
        notes,
        hours
      });
      dayIndex++;
    }
    curr.setDate(curr.getDate() + 1);
  }
  return logs;
}

async function main() {
  console.log('Inserting profile into Turso...');
  await client.execute({
    sql: `INSERT INTO employee_profile (id, employeeName, employeeId, designation, department, companyName, companyAddress, companyWebsite, joiningDate, relievingDate, isCurrentlyEmployed, managerName, managerTitle, leavesAllowance, responsibilities)
          VALUES ('primary', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(id) DO UPDATE SET
            employeeName=excluded.employeeName,
            employeeId=excluded.employeeId,
            designation=excluded.designation,
            department=excluded.department,
            companyName=excluded.companyName,
            companyAddress=excluded.companyAddress,
            companyWebsite=excluded.companyWebsite,
            joiningDate=excluded.joiningDate,
            relievingDate=excluded.relievingDate,
            isCurrentlyEmployed=excluded.isCurrentlyEmployed,
            managerName=excluded.managerName,
            managerTitle=excluded.managerTitle,
            leavesAllowance=excluded.leavesAllowance,
            responsibilities=excluded.responsibilities;`,
    args: [
      DEFAULT_PROFILE.employeeName,
      DEFAULT_PROFILE.employeeId,
      DEFAULT_PROFILE.designation,
      DEFAULT_PROFILE.department,
      DEFAULT_PROFILE.companyName,
      DEFAULT_PROFILE.companyAddress,
      DEFAULT_PROFILE.companyWebsite,
      DEFAULT_PROFILE.joiningDate,
      DEFAULT_PROFILE.relievingDate,
      DEFAULT_PROFILE.isCurrentlyEmployed,
      DEFAULT_PROFILE.managerName,
      DEFAULT_PROFILE.managerTitle,
      DEFAULT_PROFILE.leavesAllowance,
      DEFAULT_PROFILE.responsibilities
    ]
  });

  console.log('Inserting modules into Turso...');
  for (const m of INITIAL_MODULES) {
    await client.execute({
      sql: `INSERT INTO project_modules (id, title, category, status, startDate, completionDate, impact, techStack, repoOrDocUrl, keyFeatures)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              title=excluded.title,
              category=excluded.category,
              status=excluded.status,
              startDate=excluded.startDate,
              completionDate=excluded.completionDate,
              impact=excluded.impact,
              techStack=excluded.techStack,
              repoOrDocUrl=excluded.repoOrDocUrl,
              keyFeatures=excluded.keyFeatures;`,
      args: [
        m.id,
        m.title,
        m.category,
        m.status,
        m.startDate,
        m.completionDate || null,
        m.impact,
        m.techStack,
        m.repoOrDocUrl || null,
        m.keyFeatures
      ]
    });
  }

  console.log('Inserting logs into Turso...');
  const logs = generateLogs();
  for (const l of logs) {
    await client.execute({
      sql: `INSERT INTO work_logs (id, date, status, tasks, link, notes, hours)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(date) DO UPDATE SET
              status=excluded.status,
              tasks=excluded.tasks,
              link=excluded.link,
              notes=excluded.notes,
              hours=excluded.hours;`,
      args: [l.id, l.date, l.status, l.tasks, l.link || null, l.notes || null, l.hours]
    });
  }

  const logsRes = await client.execute('SELECT COUNT(*) as c FROM work_logs;');
  const modRes = await client.execute('SELECT COUNT(*) as c FROM project_modules;');
  console.log(`Turso Seeded! Logs: ${logsRes.rows[0].c}, Modules: ${modRes.rows[0].c}`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
