import { WorkLog, ProjectModule, EmployeeProfile } from '../types';
import { EXACT_EMPLOYEE_PROFILE, EXACT_MODULES, buildExactVerifiedLogs } from './exactAttendanceData';

export const DEFAULT_PROFILE: EmployeeProfile = EXACT_EMPLOYEE_PROFILE;
export const INITIAL_MODULES: ProjectModule[] = EXACT_MODULES;

export function generateCuratedPastLogs(): WorkLog[] {
  return buildExactVerifiedLogs();
}
