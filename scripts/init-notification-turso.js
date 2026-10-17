const { createClient } = require('@libsql/client');

const client = createClient({
  url: 'libsql://workos-rkdai.aws-ap-south-1.turso.io',
  authToken: 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3OTE1Mjg4ODIsImlkIjoiMDFhMTFmNzEtMTQwMS03NzBmLWE1MmQtNTJmNDljNzM3NTE1Iiwia2lkIjoiN0RHNU9lQ2NLQ1pvZ1VjbUFaV2JKTUhObGFzOWN2b2NBR1VJUmRSUmZEdyIsInJpZCI6IjlhMjVmOGJmLTUxMGQtNGQ5My05YzljLWYxNGZhNDBkMjM5NiJ9.3EfPQ_euLRZQUIBqs7tEE-x6aFfdw6W8ixE6Q6b4Blbyb8inHuWnJbFbspvy3mIrRAiH-LZwVZUgjRFdJ-T7CA'
});

async function main() {
  console.log('Creating notification_settings table in Turso...');
  await client.execute(`
    CREATE TABLE IF NOT EXISTS notification_settings (
      id TEXT PRIMARY KEY,
      reminder_time TEXT DEFAULT '10:00',
      is_enabled INTEGER DEFAULT 1,
      last_notified_date TEXT,
      updated_at TEXT
    );
  `);
  await client.execute(`
    INSERT INTO notification_settings (id, reminder_time, is_enabled, updated_at)
    VALUES ('primary', '10:00', 1, datetime('now'))
    ON CONFLICT(id) DO NOTHING;
  `);

  const res = await client.execute('SELECT * FROM notification_settings');
  console.log('notification_settings in Turso:', res.rows);
}

main().catch(console.error);
