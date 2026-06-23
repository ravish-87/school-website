const { DatabaseSync } = require('node:sqlite');
const path = require('path');

try {
  const db = require('./database');
  console.log(`[Test] Connected to SQLite database via initializer.`);

  // Check tables
  const tables = ['admins', 'admissions', 'notices', 'gallery', 'downloads', 'enquiries'];
  console.log('[Test] Verifying tables existence...');
  
  for (const table of tables) {
    const stmt = db.prepare(`SELECT name FROM sqlite_master WHERE type='table' AND name=?`);
    const row = stmt.get(table);
    if (row) {
      console.log(`✅ Table "${table}" exists.`);
    } else {
      console.error(`❌ Table "${table}" is missing!`);
      process.exit(1);
    }
  }

  // Count check
  const adminCount = db.prepare('SELECT COUNT(*) as count FROM admins').get().count;
  const noticesCount = db.prepare('SELECT COUNT(*) as count FROM notices').get().count;
  const downloadsCount = db.prepare('SELECT COUNT(*) as count FROM downloads').get().count;

  console.log(`[Test] Seed statistics:`);
  console.log(`- Admins registered: ${adminCount}`);
  console.log(`- Active Notices: ${noticesCount}`);
  console.log(`- Download Documents: ${downloadsCount}`);

  if (adminCount > 0 && noticesCount > 0 && downloadsCount > 0) {
    console.log('🎉 Database verification successful! All checks passed.');
    process.exit(0);
  } else {
    console.error('❌ Verification failed: some seeded data is missing.');
    process.exit(1);
  }
} catch (err) {
  console.error('[Test] Verification encountered error:', err);
  process.exit(1);
}
