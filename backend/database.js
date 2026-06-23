const { DatabaseSync } = require('node:sqlite');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const isRenderDisk = fs.existsSync('/var/data');
const dbDir = isRenderDisk ? '/var/data' : __dirname;
const dbPath = path.join(dbDir, 'school.db');
const db = new DatabaseSync(dbPath);

console.log(`[Database] Initializing SQLite database at: ${dbPath}`);

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS admins (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS admissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_name TEXT NOT NULL,
    dob TEXT NOT NULL,
    gender TEXT NOT NULL,
    blood_group TEXT,
    admission_class TEXT NOT NULL,
    parent_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    previous_school TEXT,
    doc_photo_path TEXT NOT NULL,
    doc_aadhar_path TEXT NOT NULL,
    status TEXT DEFAULT 'Pending',
    admin_remarks TEXT,
    created_at TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS notices (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    category TEXT NOT NULL, -- Academic, General, Exam
    file_path TEXT,
    created_at TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    category TEXT NOT NULL, -- Sports, Campus, Lab, Event
    image_path TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS downloads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TEXT NOT NULL
  )
`);

// Seed default Admin if none exists
try {
  const queryAdmin = db.prepare('SELECT COUNT(*) as count FROM admins');
  const result = queryAdmin.get();
  if (result.count === 0) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    const insertAdmin = db.prepare('INSERT INTO admins (username, password_hash) VALUES (?, ?)');
    insertAdmin.run('admin', passwordHash);
    console.log('[Database] Seeded default administrator user: username "admin", password "admin123"');
  }
} catch (err) {
  console.error('[Database] Seeding error:', err);
}

// Seed default notices if empty
try {
  const queryNotices = db.prepare('SELECT COUNT(*) as count FROM notices');
  const result = queryNotices.get();
  if (result.count === 0) {
    const insertNotice = db.prepare('INSERT INTO notices (title, content, category, created_at) VALUES (?, ?, ?, ?)');
    const now = new Date().toISOString();
    insertNotice.run('Admissions Open for Academic Year 2026-27', 'Online registration forms are now available for classes Nursery to IX. Please read the admissions criteria and guidelines carefully.', 'General', now);
    insertNotice.run('Upcoming Summer Vacation Notice', 'The school will remain closed for summer holidays from June 15th, 2026 to July 10th, 2026. Online homework packets have been uploaded to the portals.', 'Academic', now);
    insertNotice.run('Robotics Competition Winners', 'ABC Public School won 1st and 2nd place at the State Inter-School Robotics Championship. Congratulations to our young innovators!', 'General', now);
    console.log('[Database] Seeded default school notices.');
  }
} catch (err) {
  console.error('[Database] Notices seeding error:', err);
}

// Seed default downloads if empty
try {
  const queryDownloads = db.prepare('SELECT COUNT(*) as count FROM downloads');
  const result = queryDownloads.get();
  if (result.count === 0) {
    const insertDownload = db.prepare('INSERT INTO downloads (title, file_path, file_size, created_at) VALUES (?, ?, ?, ?)');
    const now = new Date().toISOString();
    insertDownload.run('School Almanac & Student Handbook 2026-27', '/uploads/default_almanac.pdf', '1.2 MB', now);
    insertDownload.run('Syllabus - Grade 1 to 5', '/uploads/syllabus_primary.pdf', '850 KB', now);
    insertDownload.run('Syllabus - Grade 6 to 10', '/uploads/syllabus_secondary.pdf', '1.1 MB', now);
    insertDownload.run('Transfer Certificate (TC) Application Form', '/uploads/tc_form.pdf', '240 KB', now);
    console.log('[Database] Seeded default download assets.');
  }
} catch (err) {
  console.error('[Database] Downloads seeding error:', err);
}

module.exports = db;
