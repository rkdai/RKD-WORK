const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://workos-rkdai.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE1Mjg4ODIsImlkIjoiMDFhMTFmNzEtMTQwMS03NzBmLWE1MmQtNTJmNDljNzM3NTE1Iiwia2lkIjoiN0RHNU9lQ2NLQ1pvZ1VjbUFaV2JKTUhObGFzOWN2b2NBR1VJUmRSUmZEdyIsInJpZCI6IjlhMjVmOGJmLTUxMGQtNGQ5My05YzljLWYxNGZhNDBkMjM5NiJ9.3EfPQ_euLRZQUIBqs7tEE-x6aFfdw6W8ixE6Q6b4Blbyb8inHuWnJbFbspvy3mIrRAiH-LZwVZUgjRFdJ-T7CA'
});

async function init() {
  await client.execute(`
    CREATE TABLE IF NOT EXISTS work_logs (
      id TEXT PRIMARY KEY,
      date TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL,
      tasks TEXT NOT NULL,
      link TEXT,
      notes TEXT,
      hours REAL DEFAULT 8.0,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS project_modules (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      shippedDate TEXT,
      description TEXT NOT NULL,
      impact TEXT NOT NULL,
      techStack TEXT,
      repoUrl TEXT,
      demoUrl TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE IF NOT EXISTS employee_profile (
      id TEXT PRIMARY KEY DEFAULT 'primary',
      name TEXT NOT NULL,
      designation TEXT NOT NULL,
      employeeId TEXT NOT NULL,
      companyName TEXT NOT NULL,
      joiningDate TEXT NOT NULL,
      relievingDate TEXT NOT NULL,
      leavesAllowance INTEGER DEFAULT 18,
      responsibilities TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Turso tables created successfully');
}

init().catch(e => { console.error(e); process.exit(1); });
