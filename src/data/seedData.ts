import { WorkLog, ProjectModule, EmployeeProfile } from '../types';
import { GITHUB_VERIFIED_MODULES, buildVerifiedLogsFromCommits } from './githubReposData';
import allGithubCommits from '../../all-github-commits.json';

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
    'Architected & delivered RKD CRM (78 commits) with bidirectional Gmail OAuth2 sync, multi-step email automations, and 27 Claude AI MCP tools.',
    'Engineered RKD CPR Crochet Data Importer PWA using Gemini 2.5 Flash Vision AI to digitize handwritten factory registers with Supabase & Google Sheets sync.',
    'Built RKD Scrapling V5 Buyer Intelligence Factory with zero-API-cost web scraping, LinkedIn profiling, and executive OSINT enrichment.',
    'Developed RKD RBC Agents & Mobile PWA for autonomous furnishing market research, VAPID Web Push, and dual LinkedIn company page posting.',
    'Deployed RKD Price Alert PWA on Cloudflare Workers with minute-level cron triggers, Turso edge persistence, and live Google Finance feeds.',
    'Constructed WorkOS Tracker & Experience Engine with instant A4 relieving certificate generation, PWA offline caching, and Turso cloud synchronization.'
  ]
};

export const INITIAL_MODULES: ProjectModule[] = GITHUB_VERIFIED_MODULES;

// Curated daily work logs covering March 2, 2026 to October 9, 2026 based on all 7 GitHub repositories and commits
export function generateCuratedPastLogs(): WorkLog[] {
  return buildVerifiedLogsFromCommits(allGithubCommits);
}
