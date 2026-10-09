import { WorkLog, ProjectModule, EmployeeProfile, TursoSyncConfig } from '../types';

/**
 * Utility to execute SQL queries on Turso via HTTP Pipeline v2 API
 * Works cleanly inside browser and service workers without native WebSocket / TCP bindings!
 */
export async function executeTursoHttp(
  config: TursoSyncConfig,
  statements: { sql: string; args?: any[] }[]
): Promise<any[]> {
  if (!config.databaseUrl || !config.authToken) {
    throw new Error('Turso database URL and Auth Token are required.');
  }

  // Convert libsql:// or http:// to https://
  let baseUrl = config.databaseUrl.trim();
  if (baseUrl.startsWith('libsql://')) {
    baseUrl = 'https://' + baseUrl.slice(9);
  } else if (baseUrl.startsWith('http://')) {
    baseUrl = 'https://' + baseUrl.slice(7);
  }
  baseUrl = baseUrl.replace(/\/+$/, '');

  const pipelineUrl = `${baseUrl}/v2/pipeline`;

  const requests = statements.map((st) => {
    const namedArgs: any[] = [];
    const positionalArgs = (st.args || []).map((val) => {
      if (val === null || val === undefined) return { type: 'null' };
      if (typeof val === 'number') {
        if (Number.isInteger(val)) return { type: 'integer', value: String(val) };
        return { type: 'float', value: val };
      }
      if (typeof val === 'boolean') return { type: 'integer', value: val ? '1' : '0' };
      return { type: 'text', value: String(val) };
    });

    return {
      type: 'execute',
      stmt: {
        sql: st.sql,
        args: positionalArgs,
        named_args: namedArgs,
      },
    };
  });

  const response = await fetch(pipelineUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.authToken.trim()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ requests }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Turso HTTP Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  const results = data.results || [];
  
  // Transform results into clean JSON row objects
  return results.map((res: any) => {
    if (res.type === 'error') {
      throw new Error(`Turso SQL Error: ${res.error?.message || JSON.stringify(res)}`);
    }
    const result = res.response?.result;
    if (!result || !result.cols || !result.rows) {
      return { rows: [] };
    }
    const colNames: string[] = result.cols.map((c: any) => c.name);
    const rows = result.rows.map((row: any[]) => {
      const rowObj: Record<string, any> = {};
      row.forEach((colVal: any, idx: number) => {
        const colName = colNames[idx];
        if (colVal.type === 'null') {
          rowObj[colName] = null;
        } else if (colVal.type === 'integer') {
          rowObj[colName] = parseInt(colVal.value, 10);
        } else if (colVal.type === 'float') {
          rowObj[colName] = parseFloat(colVal.value);
        } else {
          rowObj[colName] = colVal.value;
        }
      });
      return rowObj;
    });
    return { rows, affected: result.affected_row_count };
  });
}

/**
 * Sync entire local state with Turso database
 */
export async function pullFromTurso(config: TursoSyncConfig): Promise<{
  logs?: WorkLog[];
  modules?: ProjectModule[];
  profile?: EmployeeProfile;
}> {
  const results = await executeTursoHttp(config, [
    { sql: 'SELECT * FROM employee_profile WHERE id = ?', args: ['primary'] },
    { sql: 'SELECT * FROM project_modules ORDER BY startDate ASC' },
    { sql: 'SELECT * FROM work_logs ORDER BY date DESC' },
  ]);

  let profile: EmployeeProfile | undefined;
  if (results[0]?.rows?.[0]) {
    const p = results[0].rows[0];
    profile = {
      employeeName: p.employeeName,
      employeeId: p.employeeId,
      designation: p.designation,
      department: p.department,
      companyName: p.companyName,
      companyAddress: p.companyAddress,
      companyWebsite: p.companyWebsite,
      joiningDate: p.joiningDate,
      relievingDate: p.relievingDate || undefined,
      isCurrentlyEmployed: Boolean(p.isCurrentlyEmployed),
      managerName: p.managerName,
      managerTitle: p.managerTitle,
      leavesAllowance: Number(p.leavesAllowance) || 18,
      responsibilities: p.responsibilities ? JSON.parse(p.responsibilities) : [],
    };
  }

  const modules: ProjectModule[] = (results[1]?.rows || []).map((m: any) => ({
    id: m.id,
    title: m.title,
    category: m.category,
    status: m.status,
    startDate: m.startDate,
    completionDate: m.completionDate || undefined,
    impact: m.impact,
    techStack: m.techStack ? JSON.parse(m.techStack) : [],
    repoOrDocUrl: m.repoOrDocUrl || undefined,
    keyFeatures: m.keyFeatures ? JSON.parse(m.keyFeatures) : [],
  }));

  const logs: WorkLog[] = (results[2]?.rows || []).map((l: any) => ({
    id: l.id,
    date: l.date,
    status: l.status,
    tasks: l.tasks,
    link: l.link || undefined,
    notes: l.notes || undefined,
    hours: Number(l.hours) || 8.0,
  }));

  return { profile, modules, logs };
}

/**
 * Push an updated or new log to Turso
 */
export async function pushLogToTurso(config: TursoSyncConfig, log: WorkLog): Promise<void> {
  await executeTursoHttp(config, [
    {
      sql: `INSERT INTO work_logs (id, date, status, tasks, link, notes, hours)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(date) DO UPDATE SET
              status=excluded.status,
              tasks=excluded.tasks,
              link=excluded.link,
              notes=excluded.notes,
              hours=excluded.hours;`,
      args: [log.id, log.date, log.status, log.tasks, log.link || null, log.notes || null, log.hours],
    },
  ]);
}

/**
 * Delete a log from Turso
 */
export async function deleteLogFromTurso(config: TursoSyncConfig, id: string): Promise<void> {
  await executeTursoHttp(config, [
    {
      sql: 'DELETE FROM work_logs WHERE id = ?',
      args: [id],
    },
  ]);
}
