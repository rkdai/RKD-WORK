export type WorkStatus = 'Office Present' | 'WFH' | 'Approved Leave' | 'Emergency Leave';

export interface WorkLog {
  id: string;
  date: string; // YYYY-MM-DD
  status: WorkStatus;
  tasks: string;
  link?: string;
  notes?: string;
  hours: number;
}

export type ModuleCategory = 'AI Systems' | 'Automation' | 'Frontend' | 'Backend' | 'Infrastructure';
export type ModuleStatus = 'Shipped' | 'In Progress' | 'Maintenance';

export interface ProjectModule {
  id: string;
  title: string;
  category: ModuleCategory;
  status: ModuleStatus;
  startDate: string;
  completionDate?: string;
  impact: string;
  techStack: string[];
  repoOrDocUrl?: string;
  keyFeatures: string[];
}

export interface EmployeeProfile {
  employeeName: string;
  employeeId: string;
  designation: string;
  department: string;
  companyName: string;
  companyAddress: string;
  companyWebsite: string;
  joiningDate: string; // YYYY-MM-DD
  relievingDate?: string; // YYYY-MM-DD or empty for currently employed
  isCurrentlyEmployed: boolean;
  managerName: string;
  managerTitle: string;
  leavesAllowance: number;
  responsibilities: string[];
}

export interface TursoSyncConfig {
  databaseUrl: string;
  authToken: string;
  enabled: boolean;
  lastSyncedAt?: string;
}
