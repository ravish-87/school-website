const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dps_deoghar_secret_key_2026';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ensure upload folders exist
const isRenderDisk = fs.existsSync('/var/data');
const uploadsDir = isRenderDisk ? '/var/data/uploads' : path.join(__dirname, 'uploads');
const admissionsPhotoDir = path.join(uploadsDir, 'admissions', 'photo');
const admissionsAadharDir = path.join(uploadsDir, 'admissions', 'aadhar');
const galleryDir = path.join(uploadsDir, 'gallery');
const downloadsDir = path.join(uploadsDir, 'downloads');

fs.mkdirSync(admissionsPhotoDir, { recursive: true });
fs.mkdirSync(admissionsAadharDir, { recursive: true });
fs.mkdirSync(galleryDir, { recursive: true });
fs.mkdirSync(downloadsDir, { recursive: true });

// Create dummy assets for seeded downloads if they don't exist
const createDummyFile = (filePath, content) => {
  const absolutePath = isRenderDisk ? path.join('/var/data/uploads', path.basename(filePath)) : path.join(__dirname, filePath);
  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    fs.writeFileSync(absolutePath, content);
    console.log(`[Server] Created placeholder file at ${absolutePath}`);
  }
};

createDummyFile('uploads/default_almanac.pdf', 'DPS Deoghar - Academic Almanac 2026-27 (Placeholder PDF Content)');
createDummyFile('uploads/syllabus_primary.pdf', 'DPS Deoghar - Primary School Syllabus Grade 1 to 5 (Placeholder PDF Content)');
createDummyFile('uploads/syllabus_secondary.pdf', 'DPS Deoghar - Secondary School Syllabus Grade 6 to 10 (Placeholder PDF Content)');
createDummyFile('uploads/tc_form.pdf', 'DPS Deoghar - Transfer Certificate Application Form (Placeholder PDF Content)');

// Serve Uploads statically
app.use('/uploads', express.static(uploadsDir));

// Multer Storage Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === 'photo') {
      cb(null, admissionsPhotoDir);
    } else if (file.fieldname === 'aadhar') {
      cb(null, admissionsAadharDir);
    } else if (file.fieldname === 'galleryImage') {
      cb(null, galleryDir);
    } else if (file.fieldname === 'downloadFile') {
      cb(null, downloadsDir);
    } else {
      cb(null, uploadsDir);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only PDF and Image files (JPG, PNG) are allowed!'));
    }
  }
});

// Authentication Middleware
const authenticateAdmin = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ error: 'Access token required' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });
    req.admin = decoded;
    next();
  });
};

// ==========================================
// ROUTES
// ==========================================

// 1. AUTH ROUTES
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const stmt = db.prepare('SELECT * FROM admins WHERE username = ?');
    const admin = stmt.get(username);

    if (!admin || !bcrypt.compareSync(password, admin.password_hash)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, username: admin.username });
  } catch (err) {
    res.status(500).json({ error: 'Login failed: ' + err.message });
  }
});

app.get('/api/auth/verify', authenticateAdmin, (req, res) => {
  res.json({ valid: true, username: req.admin.username });
});


// 2. PUBLIC ENQUIRY
app.post('/api/enquiries', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  if (!name || !email || !phone || !subject || !message) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const stmt = db.prepare(`
      INSERT INTO enquiries (name, email, phone, subject, message, created_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    stmt.run(name, email, phone, subject, message, now);
    res.status(201).json({ message: 'Enquiry submitted successfully. We will contact you soon.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to submit enquiry: ' + err.message });
  }
});


// 3. PUBLIC NOTICES
app.get('/api/notices', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM notices ORDER BY id DESC');
    const list = stmt.all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch notices: ' + err.message });
  }
});


// 4. PUBLIC DOWNLOADS
app.get('/api/downloads', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM downloads ORDER BY id DESC');
    const list = stmt.all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch downloads: ' + err.message });
  }
});


// 5. PUBLIC GALLERY
app.get('/api/gallery', (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM gallery ORDER BY id DESC');
    const list = stmt.all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch gallery: ' + err.message });
  }
});


// 6. ADMISSIONS (PUBLIC REGISTRATION)
app.post('/api/admissions/register', upload.fields([
  { name: 'photo', maxCount: 1 },
  { name: 'aadhar', maxCount: 1 }
]), (req, res) => {
  const {
    student_name, dob, gender, blood_group, admission_class,
    parent_name, email, phone, address, previous_school
  } = req.body;

  if (!student_name || !dob || !gender || !admission_class || !parent_name || !email || !phone || !address) {
    return res.status(400).json({ error: 'Missing required textual fields' });
  }

  if (!req.files || !req.files['photo'] || !req.files['aadhar']) {
    return res.status(400).json({ error: 'Both Student Photo and Aadhar Card files are required' });
  }

  try {
    // Save relative paths to access via server static middleware
    const photoPath = '/uploads/admissions/photo/' + req.files['photo'][0].filename;
    const aadharPath = '/uploads/admissions/aadhar/' + req.files['aadhar'][0].filename;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO admissions (
        student_name, dob, gender, blood_group, admission_class,
        parent_name, email, phone, address, previous_school,
        doc_photo_path, doc_aadhar_path, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending', ?)
    `);

    const result = stmt.run(
      student_name, dob, gender, blood_group, admission_class,
      parent_name, email, phone, address, previous_school || '',
      photoPath, aadharPath, now
    );

    // Generate a formal application number e.g., DPSDG/2026/10000 + id
    const appId = result.lastInsertRowid;
    const formattedAppNumber = `DPSDG/2026/${10000 + appId}`;

    res.status(201).json({
      message: 'Admission form registered successfully!',
      applicationId: appId,
      applicationNumber: formattedAppNumber
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to process admission form: ' + err.message });
  }
});

// ADMISSION STATUS CHECK (PUBLIC)
app.get('/api/admissions/status', (req, res) => {
  const { query } = req.query; // can search by Email, Phone or Application Number (e.g. DPSDG/2026/10005)
  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required (Email, Phone or Application Number)' });
  }

  try {
    let admission = null;
    if (query.startsWith('DPSDG/2026/')) {
      const parts = query.split('/');
      const idStr = parts[parts.length - 1];
      const id = parseInt(idStr, 10) - 10000;
      const stmt = db.prepare('SELECT * FROM admissions WHERE id = ?');
      admission = stmt.get(id);
    } else {
      const stmt = db.prepare('SELECT * FROM admissions WHERE email = ? OR phone = ? ORDER BY id DESC');
      admission = stmt.get(query, query);
    }

    if (!admission) {
      return res.status(404).json({ error: 'No admission registration found for details provided' });
    }

    const applicationNumber = `DPSDG/2026/${10000 + admission.id}`;

    res.json({
      id: admission.id,
      applicationNumber,
      student_name: admission.student_name,
      admission_class: admission.admission_class,
      parent_name: admission.parent_name,
      status: admission.status,
      admin_remarks: admission.admin_remarks || 'Your application is under verification.',
      created_at: admission.created_at
    });
  } catch (err) {
    res.status(500).json({ error: 'Database check failed: ' + err.message });
  }
});


// ==========================================
// ADMIN LOGGED-IN ENDPOINTS (JWT SECURED)
// ==========================================

// 7. ADMIN - ADMISSIONS MANAGEMENT
app.get('/api/admin/admissions', authenticateAdmin, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM admissions ORDER BY id DESC');
    const list = stmt.all();

    // Map formatted application number to each record
    const mapped = list.map(item => ({
      ...item,
      applicationNumber: `DPSDG/2026/${10000 + item.id}`
    }));

    res.json(mapped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve registrations: ' + err.message });
  }
});

app.put('/api/admin/admissions/:id/status', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  const { status, admin_remarks } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required' });
  }

  try {
    const stmt = db.prepare(`
      UPDATE admissions
      SET status = ?, admin_remarks = ?
      WHERE id = ?
    `);
    const result = stmt.run(status, admin_remarks || '', id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Admission application not found' });
    }

    res.json({ message: 'Admission application status updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update application: ' + err.message });
  }
});


// 8. ADMIN - NOTICE BOARD MANAGEMENT
app.post('/api/admin/notices', authenticateAdmin, upload.single('downloadFile'), (req, res) => {
  const { title, content, category } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Title, content and category are required' });
  }

  try {
    let filePath = null;
    if (req.file) {
      filePath = '/uploads/downloads/' + req.file.filename;
    }
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO notices (title, content, category, file_path, created_at)
      VALUES (?, ?, ?, ?, ?)
    `);
    stmt.run(title, content, category, filePath, now);

    res.status(201).json({ message: 'Notice published successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to publish notice: ' + err.message });
  }
});

app.delete('/api/admin/notices/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  try {
    // Delete file physically if associated
    const selectStmt = db.prepare('SELECT file_path FROM notices WHERE id = ?');
    const notice = selectStmt.get(id);

    if (notice && notice.file_path && notice.file_path.startsWith('/uploads/')) {
      const absPath = path.join(__dirname, notice.file_path);
      if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
    }

    const stmt = db.prepare('DELETE FROM notices WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Notice not found' });
    }

    res.json({ message: 'Notice deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete notice: ' + err.message });
  }
});


// 9. ADMIN - GALLERY MANAGEMENT
app.post('/api/admin/gallery', authenticateAdmin, upload.single('galleryImage'), (req, res) => {
  const { title, category } = req.body;
  if (!title || !category) {
    return res.status(400).json({ error: 'Title and category are required' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'An image file upload is required' });
  }

  try {
    const imagePath = '/uploads/gallery/' + req.file.filename;
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO gallery (title, category, image_path, created_at)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(title, category, imagePath, now);

    res.status(201).json({ message: 'Gallery image uploaded successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save gallery image: ' + err.message });
  }
});

app.delete('/api/admin/gallery/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  try {
    const selectStmt = db.prepare('SELECT image_path FROM gallery WHERE id = ?');
    const photo = selectStmt.get(id);

    if (photo && photo.image_path) {
      const absPath = path.join(__dirname, photo.image_path);
      if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
    }

    const stmt = db.prepare('DELETE FROM gallery WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Photo not found in gallery' });
    }

    res.json({ message: 'Photo deleted from gallery' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete photo: ' + err.message });
  }
});


// 10. ADMIN - DOWNLOADS MANAGEMENT
app.post('/api/admin/downloads', authenticateAdmin, upload.single('downloadFile'), (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'A file upload is required' });
  }

  try {
    const filePath = '/uploads/downloads/' + req.file.filename;
    const sizeInBytes = req.file.size;
    let sizeFormatted = `${(sizeInBytes / 1024).toFixed(1)} KB`;
    if (sizeInBytes > 1024 * 1024) {
      sizeFormatted = `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
    }
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO downloads (title, file_path, file_size, created_at)
      VALUES (?, ?, ?, ?)
    `);
    stmt.run(title, filePath, sizeFormatted, now);

    res.status(201).json({ message: 'File uploaded to downloads library' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload download document: ' + err.message });
  }
});

app.delete('/api/admin/downloads/:id', authenticateAdmin, (req, res) => {
  const { id } = req.params;
  try {
    const selectStmt = db.prepare('SELECT file_path FROM downloads WHERE id = ?');
    const download = selectStmt.get(id);

    if (download && download.file_path && download.file_path.startsWith('/uploads/')) {
      const absPath = path.join(__dirname, download.file_path);
      if (fs.existsSync(absPath)) fs.unlinkSync(absPath);
    }

    const stmt = db.prepare('DELETE FROM downloads WHERE id = ?');
    const result = stmt.run(id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Download item not found' });
    }

    res.json({ message: 'Download item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete download: ' + err.message });
  }
});


// 11. ADMIN - VIEW GENERAL ENQUIRIES
app.get('/api/admin/enquiries', authenticateAdmin, (req, res) => {
  try {
    const stmt = db.prepare('SELECT * FROM enquiries ORDER BY id DESC');
    const list = stmt.all();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch enquiries: ' + err.message });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`[Server] School backend running on port ${PORT}`);
});
