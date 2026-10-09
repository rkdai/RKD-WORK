const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://workos-rkdai.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE1Mjg4ODIsImlkIjoiMDFhMTFmNzEtMTQwMS03NzBmLWE1MmQtNTJmNDljNzM3NTE1Iiwia2lkIjoiN0RHNU9lQ2NLQ1pvZ1VjbUFaV2JKTUhObGFzOWN2b2NBR1VJUmRSUmZEdyIsInJpZCI6IjlhMjVmOGJmLTUxMGQtNGQ5My05YzljLWYxNGZhNDBkMjM5NiJ9.3EfPQ_euLRZQUIBqs7tEE-x6aFfdw6W8ixE6Q6b4Blbyb8inHuWnJbFbspvy3mIrRAiH-LZwVZUgjRFdJ-T7CA'
});

async function run() {
  await client.execute(`DROP TABLE IF EXISTS employee_profile;`);
  await client.execute(`DROP TABLE IF EXISTS project_modules;`);
  await client.execute(`DROP TABLE IF EXISTS work_logs;`);

  await client.execute(`
    CREATE TABLE work_logs (
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
    CREATE TABLE project_modules (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      status TEXT NOT NULL,
      startDate TEXT,
      completionDate TEXT,
      impact TEXT NOT NULL,
      techStack TEXT,
      repoOrDocUrl TEXT,
      keyFeatures TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await client.execute(`
    CREATE TABLE employee_profile (
      id TEXT PRIMARY KEY DEFAULT 'primary',
      employeeName TEXT NOT NULL,
      employeeId TEXT NOT NULL,
      designation TEXT NOT NULL,
      department TEXT NOT NULL,
      companyName TEXT NOT NULL,
      companyAddress TEXT NOT NULL,
      companyWebsite TEXT NOT NULL,
      joiningDate TEXT NOT NULL,
      relievingDate TEXT,
      isCurrentlyEmployed INTEGER DEFAULT 1,
      managerName TEXT NOT NULL,
      managerTitle TEXT NOT NULL,
      leavesAllowance INTEGER DEFAULT 18,
      responsibilities TEXT NOT NULL,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log('Tables aligned with exact TypeScript schemas!');
}

run().catch(console.error);
