import { WorkLog, ProjectModule, EmployeeProfile } from '../types';

export const DEFAULT_PROFILE: EmployeeProfile = {
  employeeName: 'Rihan',
  employeeId: 'RKD-ENG-2026-08',
  designation: 'AI Systems & Workflow Builder',
  department: 'Technology, AI & Automation',
  companyName: 'RKD FURNISHING PVT LTD',
  companyAddress: 'Industrial Area, Sector 25, Panipat - 132103, Haryana, India',
  companyWebsite: 'https://rkd.in',
  joiningDate: '2026-03-02',
  relievingDate: '2026-10-15',
  isCurrentlyEmployed: true,
  managerName: 'Bhupinder Pal Singh',
  managerTitle: 'Director of Operations & Digital Initiatives',
  leavesAllowance: 18,
  responsibilities: [
    'Architected and deployed end-to-end AI workflow agents for market intelligence, automating research and content generation.',
    'Engineered real-time currency alert PWA with Cloudflare Workers, Turso Edge database, and native Web Push delivery.',
    'Developed Three.js interactive 3D virtual exhibition booth visualizers for international textile client presentations.',
    'Built internal data synchronization pipelines and ERP automation tools reducing manual entry and turnaround times by 80%.',
    'Maintained continuous high-availability deployments on Cloudflare and Vercel infrastructure.'
  ]
};

export const INITIAL_MODULES: ProjectModule[] = [
  {
    id: 'mod-1',
    title: 'RKD Research Based Content Agent (RBC v5)',
    category: 'AI Systems',
    status: 'Shipped',
    startDate: '2026-08-10',
    completionDate: '2026-09-18',
    impact: 'Generated 1,000+ targeted posts and scanned 16,000+ global furnishing news feeds automatically',
    techStack: ['Next.js', 'Vercel Cron', 'Gemini AI', 'Tailwind CSS', 'LinkedIn API'],
    repoOrDocUrl: 'https://rkd-rbc-agents.vercel.app',
    keyFeatures: [
      'Automated weekly Monday reports at 9:00 AM IST via Vercel Cron',
      'Multi-channel keyword engine for Rugs, Cushions, Floor Coverings, and Area Rugs',
      'One-click LinkedIn and Instagram post formatter with company tone of voice'
    ]
  },
  {
    id: 'mod-2',
    title: 'USD-to-INR Real-Time Price Alert PWA',
    category: 'Automation',
    status: 'Shipped',
    startDate: '2026-09-28',
    completionDate: '2026-10-07',
    impact: 'Saved management 30+ daily manual forex checks with scheduled instant push notifications',
    techStack: ['Cloudflare Workers', 'Turso SQLite', 'Web Push VAPID', 'Vanilla PWA', 'Google Forex Feed'],
    repoOrDocUrl: 'https://rkd-price-alert.rkd-pirce-alert.workers.dev',
    keyFeatures: [
      'Real-time forex rate extraction matching Google Finance down to 4 decimal precision',
      'Per-minute Cloudflare cron scheduling with custom user notification IST time preferences',
      'Native iOS 16.4+ and Android PWA installability with OLED black and gold luxury aesthetics'
    ]
  },
  {
    id: 'mod-3',
    title: 'Three.js 3D Virtual Exhibition Stall Generator',
    category: 'Frontend',
    status: 'Shipped',
    startDate: '2026-09-15',
    completionDate: '2026-10-02',
    impact: 'Cut 3D design iteration time for international trade shows from 5 days to 20 minutes',
    techStack: ['Three.js', 'WebGL', 'React', 'OrbitControls', 'GLTF Loader', 'Tailwind CSS'],
    repoOrDocUrl: 'https://github.com/rkdai/3D-STALL-VIEWER',
    keyFeatures: [
      'Real-time lighting, rug & cushion texture displacement shaders',
      'Interactive booth walkthrough with camera orbit navigation and dimension inspection',
      'Instant snapshot export in ultra-high resolution for buyer catalogs'
    ]
  },
  {
    id: 'mod-4',
    title: 'Internal ERP Sync & Catalog Export Engine',
    category: 'Backend',
    status: 'Shipped',
    startDate: '2026-04-12',
    completionDate: '2026-06-25',
    impact: 'Reduced manual catalog data entry errors by 85% across 2,400+ SKU inventory items',
    techStack: ['Node.js', 'PostgreSQL', 'Express', 'ExcelJS', 'Sharp Image Pipeline'],
    repoOrDocUrl: 'https://github.com/rkdai/erp-sync-service',
    keyFeatures: [
      'Bidirectional SKU price and inventory synchronization with central Panipat warehouse',
      'Automated high-res watermarked PDF catalog generation for overseas exports',
      'Bulk CSV reconciliation and conflict resolution engine'
    ]
  },
  {
    id: 'mod-5',
    title: 'Yarn Dyed Tufted Texture AI Dataset Classifier',
    category: 'AI Systems',
    status: 'Shipped',
    startDate: '2026-07-02',
    completionDate: '2026-08-08',
    impact: 'Trained model on 3,500+ fabric samples to predict weave density and yarn color accuracy',
    techStack: ['Python', 'PyTorch', 'FastAPI', 'OpenCV', 'Next.js'],
    repoOrDocUrl: 'https://github.com/rkdai/yarn-ai-classifier',
    keyFeatures: [
      'Automatic visual defect detection on high-speed camera feeds',
      'Color fidelity grading according to Pantone textile standards',
      'Automated batch inspection logging with zero manual sampling'
    ]
  },
  {
    id: 'mod-6',
    title: 'WorkOS Tracker & Experience Engine',
    category: 'Infrastructure',
    status: 'Shipped',
    startDate: '2026-10-01',
    completionDate: '2026-10-09',
    impact: 'Single-source of truth for attendance, modules shipped, and instant certificate generation',
    techStack: ['Next.js App Router', 'Tailwind CSS v4', 'Lucide React', 'jsPDF', 'PWA'],
    repoOrDocUrl: 'https://github.com/rkdai/workos-tracker',
    keyFeatures: [
      '5-second quick log flow with keyboard shortcuts (Cmd+K / N)',
      'Formal relieving & experience certificate generator with print-ready A4 styling',
      'Comprehensive performance analytics and CSV/JSON backup sync'
    ]
  }
];

// Curated daily work logs covering March 2, 2026 to October 9, 2026
export function generateCuratedPastLogs(): WorkLog[] {
  const logs: WorkLog[] = [];
  const start = new Date(2026, 2, 2); // March 2, 2026
  const end = new Date(2026, 9, 9); // October 9, 2026

  const dailyTasksPlan: Record<string, { status: WorkLog['status']; task: string; link?: string; notes?: string }> = {
    // Selected highlights and milestones
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
    'Refactored API error handling and strengthened edge request validation',
    'Optimized database indexes and cleaned up orphan records in production DB',
    'Collaborated with design team on textile color palettes and export specifications',
    'Conducted unit testing and edge case verification for background cron tasks',
    'Enhanced mobile responsiveness and safe-area padding for iOS touch screens',
    'Audited Lighthouse performance metrics and reduced bundle payload by 28%',
    'Implemented automated health check endpoint and error alerting webhooks'
  ];

  const genericWfhTasks = [
    'Deep work: Wrote automated end-to-end integration test suites',
    'Refactored data pipeline caching layer to avoid redundant third-party API hits',
    'Documented API architecture, deployment SOPs, and user credential management',
    'Reviewed security policies, rotated API secrets, and audited database permissions'
  ];

  let taskCounter = 0;
  const current = new Date(start);

  while (current <= end) {
    const dayOfWeek = current.getDay(); // 0 is Sunday, 6 is Saturday
    const dateStr = current.toISOString().slice(0, 10);

    // Skip Sundays and every alternate Saturday (typical corporate schedule)
    if (dayOfWeek !== 0 && !(dayOfWeek === 6 && (current.getDate() % 2 === 0))) {
      if (dailyTasksPlan[dateStr]) {
        const item = dailyTasksPlan[dateStr];
        logs.push({
          id: `log-${dateStr}`,
          date: dateStr,
          status: item.status,
          tasks: item.task,
          link: item.link || (item.status !== 'Approved Leave' && item.status !== 'Emergency Leave' ? `https://github.com/rkdai/repo/commit/${dateStr.replace(/-/g, '').slice(2)}` : undefined),
          notes: item.notes,
          hours: item.status === 'Approved Leave' || item.status === 'Emergency Leave' ? 0 : (item.status === 'Office Present' ? 8.5 : 8.0)
        });
      } else {
        // Generate realistic day
        const isWfh = (taskCounter % 6 === 0);
        const status: WorkLog['status'] = isWfh ? 'WFH' : 'Office Present';
        const tasks = isWfh 
          ? genericWfhTasks[taskCounter % genericWfhTasks.length] 
          : genericOfficeTasks[taskCounter % genericOfficeTasks.length];

        logs.push({
          id: `log-${dateStr}`,
          date: dateStr,
          status,
          tasks,
          link: `https://github.com/rkdai/internal-systems/commit/${Math.random().toString(16).slice(2, 9)}`,
          hours: isWfh ? 8.0 : 8.5
        });
        taskCounter++;
      }
    }

    current.setDate(current.getDate() + 1);
  }

  // Sort descending by date (most recent first)
  return logs.sort((a, b) => b.date.localeCompare(a.date));
}
