import React, { useState, useEffect } from 'react';
import { 
  Lock, LogOut, Users, Bell, Image, Download, Mail, 
  CheckCircle, XCircle, Search, FileText, Upload, Trash2, Calendar, ShieldCheck
} from 'lucide-react';
import { API_URL } from '../config';

export default function AdminDashboard() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [username, setUsername] = useState(localStorage.getItem('adminUser') || '');
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  // Dashboard Tab state
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data states
  const [admissions, setAdmissions] = useState([]);
  const [notices, setNotices] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  
  // Detail views / Modals
  const [selectedAdmission, setSelectedAdmission] = useState(null);
  const [remarks, setRemarks] = useState('');
  
  // Filter search
  const [searchQuery, setSearchQuery] = useState('');
  
  // Create Form States
  const [noticeForm, setNoticeForm] = useState({ title: '', content: '', category: 'General' });
  const [noticeFile, setNoticeFile] = useState(null);
  
  const [galleryForm, setGalleryForm] = useState({ title: '', category: 'Campus' });
  const [galleryFile, setGalleryFile] = useState(null);
  
  const [downloadForm, setDownloadForm] = useState({ title: '' });
  const [downloadFile, setDownloadFile] = useState(null);

  // Verification on startup
  useEffect(() => {
    if (token) {
      fetch(`${API_URL}/auth/verify`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => {
          if (!res.ok) throw new Error('Session expired');
          return res.json();
        })
        .catch(() => {
          handleLogout();
        });
    }
  }, [token]);

  // Fetch data on tab change
  useEffect(() => {
    if (!token) return;

    if (activeTab === 'overview' || activeTab === 'admissions') {
      fetchAdmissions();
    }
    if (activeTab === 'overview' || activeTab === 'notices') {
      fetchNotices();
    }
    if (activeTab === 'gallery') {
      fetchGallery();
    }
    if (activeTab === 'downloads') {
      fetchDownloads();
    }
    if (activeTab === 'enquiries') {
      fetchEnquiries();
    }
  }, [token, activeTab]);

  // Data fetch implementations
  const fetchAdmissions = () => {
    fetch(`${API_URL}/admin/admissions`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setAdmissions(data))
      .catch(err => console.error(err));
  };

  const fetchNotices = () => {
    fetch(`${API_URL}/notices`)
      .then(res => res.json())
      .then(data => setNotices(data))
      .catch(err => console.error(err));
  };

  const fetchGallery = () => {
    fetch(`${API_URL}/gallery`)
      .then(res => res.json())
      .then(data => setGallery(data))
      .catch(err => console.error(err));
  };

  const fetchDownloads = () => {
    fetch(`${API_URL}/downloads`)
      .then(res => res.json())
      .then(data => setDownloads(data))
      .catch(err => console.error(err));
  };

  const fetchEnquiries = () => {
    fetch(`${API_URL}/admin/enquiries`, { headers: { 'Authorization': `Bearer ${token}` } })
      .then(res => res.json())
      .then(data => setEnquiries(data))
      .catch(err => console.error(err));
  };

  // Login handler
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');
      
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', data.username);
      setToken(data.token);
      setUsername(data.username);
    } catch (err) {
      setLoginError(err.message);
    }
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setToken('');
    setUsername('');
    setActiveTab('overview');
  };

  // Update Admission Status
  const handleUpdateStatus = async (status) => {
    if (!selectedAdmission) return;
    try {
      const response = await fetch(`${API_URL}/admin/admissions/${selectedAdmission.id}/status`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status, admin_remarks: remarks })
      });
      
      if (!response.ok) throw new Error('Failed to update status');
      
      alert(`Application marked as ${status}`);
      setSelectedAdmission(prev => ({ ...prev, status, admin_remarks: remarks }));
      fetchAdmissions();
    } catch (err) {
      alert(err.message);
    }
  };

  // Create Notice Board Item
  const handleCreateNotice = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', noticeForm.title);
    data.append('content', noticeForm.content);
    data.append('category', noticeForm.category);
    if (noticeFile) {
      data.append('downloadFile', noticeFile);
    }

    try {
      const res = await fetch(`${API_URL}/admin/notices`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      if (!res.ok) throw new Error('Publish notice failed');
      alert('Notice published successfully!');
      setNoticeForm({ title: '', content: '', category: 'General' });
      setNoticeFile(null);
      fetchNotices();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Notice
  const handleDeleteNotice = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/notices/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete notice failed');
      fetchNotices();
    } catch (err) {
      alert(err.message);
    }
  };

  // Create Gallery Image
  const handleCreateGallery = async (e) => {
    e.preventDefault();
    if (!galleryFile) return alert('Please select an image file');
    
    const data = new FormData();
    data.append('title', galleryForm.title);
    data.append('category', galleryForm.category);
    data.append('galleryImage', galleryFile);

    try {
      const res = await fetch(`${API_URL}/admin/gallery`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      if (!res.ok) throw new Error('Gallery upload failed');
      alert('Image added to gallery!');
      setGalleryForm({ title: '', category: 'Campus' });
      setGalleryFile(null);
      fetchGallery();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Gallery Image
  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Are you sure you want to delete this photo from the gallery?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/gallery/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete photo failed');
      fetchGallery();
    } catch (err) {
      alert(err.message);
    }
  };

  // Create Download Document
  const handleCreateDownload = async (e) => {
    e.preventDefault();
    if (!downloadFile) return alert('Please select a PDF file');
    
    const data = new FormData();
    data.append('title', downloadForm.title);
    data.append('downloadFile', downloadFile);

    try {
      const res = await fetch(`${API_URL}/admin/downloads`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: data
      });
      if (!res.ok) throw new Error('Document upload failed');
      alert('Document added to library!');
      setDownloadForm({ title: '' });
      setDownloadFile(null);
      fetchDownloads();
    } catch (err) {
      alert(err.message);
    }
  };

  // Delete Download Document
  const handleDeleteDownload = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document?')) return;
    try {
      const res = await fetch(`${API_URL}/admin/downloads/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Delete document failed');
      fetchDownloads();
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredAdmissions = admissions.filter(app => 
    app.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.phone.includes(searchQuery)
  );

  // Helper values
  const pendingAdmissionsCount = admissions.filter(a => a.status === 'Pending').length;

  // Render Login Panel
  if (!token) {
    return (
      <div className="admin-login-wrapper container">
        <div className="login-card premium-card glass-panel animate-fade-in">
          <div className="login-header">
            <Lock size={36} className="login-icon" />
            <h2>Administrator Portal</h2>
            <p>Access secure credentials to manage registrations, circulars, and gallery lists.</p>
          </div>

          {loginError && <div className="login-error-banner">❌ {loginError}</div>}

          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Username</label>
              <input 
                type="text" 
                placeholder="Enter username" 
                value={loginData.username} 
                onChange={(e) => setLoginData(prev => ({ ...prev, username: e.target.value }))}
                className="form-control"
                required
              />
            </div>
            <div className="form-group">
              <label>Secret Password</label>
              <input 
                type="password" 
                placeholder="Enter password" 
                value={loginData.password} 
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary btn-block">Log In to Console</button>
          </form>
          <p className="login-demo-notice">Demo access: Use username <strong>admin</strong> & password <strong>admin123</strong></p>
        </div>

        <style>{`
          .admin-login-wrapper {
            max-width: 480px;
            margin: 80px auto;
          }

          .login-card {
            padding: 40px;
            background-color: var(--bg-white);
          }

          .login-header {
            text-align: center;
            margin-bottom: 30px;
          }

          .login-icon {
            color: var(--primary-color);
            margin-bottom: 15px;
          }

          .login-error-banner {
            background-color: #fdedd8;
            color: var(--danger-color);
            padding: 12px;
            border-radius: var(--border-radius-sm);
            margin-bottom: 20px;
            font-weight: 600;
            font-size: 0.9rem;
          }

          .login-demo-notice {
            font-size: 0.82rem;
            color: var(--text-light);
            text-align: center;
            margin-top: 20px;
            background-color: var(--bg-light);
            padding: 8px;
            border-radius: 4px;
          }
        `}</style>
      </div>
    );
  }

  // Render Dashboard Console
  return (
    <div className="admin-dashboard-container animate-fade-in">
      <div className="dashboard-top-header">
        <div className="container header-flex">
          <div>
            <h1>Admin Console</h1>
            <p>Welcome back, <strong>{username}</strong></p>
          </div>
          <button onClick={handleLogout} className="btn btn-outline btn-logout">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </div>

      <div className="container dashboard-main-layout">
        {/* Left Side Navigation Menu */}
        <aside className="dashboard-sidebar">
          <ul className="sidebar-menu">
            <li>
              <button onClick={() => { setActiveTab('overview'); setSelectedAdmission(null); }} className={`sidebar-btn ${activeTab === 'overview' ? 'active' : ''}`}>
                📊 Console Overview
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('admissions'); setSelectedAdmission(null); }} className={`sidebar-btn ${activeTab === 'admissions' ? 'active' : ''}`}>
                🎓 Manage Admissions
                {pendingAdmissionsCount > 0 && <span className="sidebar-count">{pendingAdmissionsCount}</span>}
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('notices'); setSelectedAdmission(null); }} className={`sidebar-btn ${activeTab === 'notices' ? 'active' : ''}`}>
                📢 Manage Notices
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('gallery'); setSelectedAdmission(null); }} className={`sidebar-btn ${activeTab === 'gallery' ? 'active' : ''}`}>
                📸 Manage Gallery
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('downloads'); setSelectedAdmission(null); }} className={`sidebar-btn ${activeTab === 'downloads' ? 'active' : ''}`}>
                📂 Downloads Library
              </button>
            </li>
            <li>
              <button onClick={() => { setActiveTab('enquiries'); setSelectedAdmission(null); }} className={`sidebar-btn ${activeTab === 'enquiries' ? 'active' : ''}`}>
                ✉️ General Enquiries
              </button>
            </li>
          </ul>
        </aside>

        {/* Right Side Working Pane */}
        <main className="dashboard-workspace-pane">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="overview-tab-content">
              <h2>Overview Statistics</h2>
              <div className="divider-left"></div>

              <div className="overview-stats-grid">
                <div className="stat-box-mini">
                  <div className="mini-icon green-icon"><Users size={24} /></div>
                  <div className="mini-details">
                    <h3>{admissions.length}</h3>
                    <p>Total Registrations</p>
                  </div>
                </div>
                <div className="stat-box-mini">
                  <div className="mini-icon gold-icon"><ShieldCheck size={24} /></div>
                  <div className="mini-details">
                    <h3>{pendingAdmissionsCount}</h3>
                    <p>Pending Review</p>
                  </div>
                </div>
                <div className="stat-box-mini">
                  <div className="mini-icon blue-icon"><Bell size={24} /></div>
                  <div className="mini-details">
                    <h3>{notices.length}</h3>
                    <p>Active Circulars</p>
                  </div>
                </div>
                <div className="stat-box-mini">
                  <div className="mini-icon grey-icon"><Mail size={24} /></div>
                  <div className="mini-details">
                    <h3>{enquiries.length}</h3>
                    <p>New Enquiries</p>
                  </div>
                </div>
              </div>

              <div className="recent-activity-splits">
                {/* Recent Admissions */}
                <div className="activity-card-half premium-card">
                  <h3>Recent Registrations</h3>
                  <div className="activity-list">
                    {admissions.slice(0, 5).map(app => (
                      <div key={app.id} className="activity-row">
                        <div>
                          <h4>{app.student_name} (Class {app.admission_class})</h4>
                          <p>Parent: {app.parent_name} | {app.phone}</p>
                        </div>
                        <span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
                      </div>
                    ))}
                    {admissions.length === 0 && <p className="empty-txt">No admissions submitted yet.</p>}
                  </div>
                </div>

                {/* Recent Enquiries */}
                <div className="activity-card-half premium-card">
                  <h3>Recent Enquiries</h3>
                  <div className="activity-list">
                    {enquiries.slice(0, 5).map(enq => (
                      <div key={enq.id} className="activity-row">
                        <div>
                          <h4>{enq.name} - {enq.subject}</h4>
                          <p>{enq.message.substring(0, 70)}...</p>
                        </div>
                      </div>
                    ))}
                    {enquiries.length === 0 && <p className="empty-txt">No enquiries received.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MANAGE ADMISSIONS */}
          {activeTab === 'admissions' && !selectedAdmission && (
            <div className="admissions-tab-content">
              <div className="workspace-header-actions">
                <h2>Manage Admissions</h2>
                <div className="search-bar-wrapper">
                  <Search size={18} className="search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search by student name or Reg No..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="form-control search-input"
                  />
                </div>
              </div>
              <div className="divider-left"></div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Reg No.</th>
                      <th>Student Name</th>
                      <th>Class</th>
                      <th>Parent Name</th>
                      <th>Contact No</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAdmissions.map(app => (
                      <tr key={app.id}>
                        <td><strong>{app.applicationNumber}</strong></td>
                        <td>{app.student_name}</td>
                        <td>{app.admission_class}</td>
                        <td>{app.parent_name}</td>
                        <td>{app.phone}</td>
                        <td>
                          <span className={`badge badge-${app.status.toLowerCase()}`}>{app.status}</span>
                        </td>
                        <td>
                          <button onClick={() => { setSelectedAdmission(app); setRemarks(app.admin_remarks || ''); }} className="btn btn-primary btn-sm">
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredAdmissions.length === 0 && (
                      <tr>
                        <td colSpan="7" style={{ textAlign: 'center', padding: '40px 0' }}>No registrations found matching search.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ADMISSION DETAIL INSPECTOR PANE */}
          {activeTab === 'admissions' && selectedAdmission && (
            <div className="admission-inspector-pane animate-fade-in">
              <div className="inspector-header">
                <button onClick={() => setSelectedAdmission(null)} className="btn btn-outline btn-sm">
                  &larr; Back to List
                </button>
                <h2>Inspect Application: {selectedAdmission.applicationNumber}</h2>
              </div>
              <div className="divider-left"></div>

              <div className="inspector-splits">
                {/* Text Data */}
                <div className="inspector-details-sheet premium-card">
                  <h3>Student & Parent Dossier</h3>
                  <div className="grid-details-layout">
                    <p><strong>Candidate Name:</strong> {selectedAdmission.student_name}</p>
                    <p><strong>Date of Birth:</strong> {selectedAdmission.dob}</p>
                    <p><strong>Gender:</strong> {selectedAdmission.gender}</p>
                    <p><strong>Blood Group:</strong> {selectedAdmission.blood_group || 'Not specified'}</p>
                    <p><strong>Applying Class:</strong> {selectedAdmission.admission_class}</p>
                    <p><strong>Previous School:</strong> {selectedAdmission.previous_school || 'N/A'}</p>
                    <p><strong>Parent/Guardian:</strong> {selectedAdmission.parent_name}</p>
                    <p><strong>Email Address:</strong> {selectedAdmission.email}</p>
                    <p><strong>Mobile Helpline:</strong> {selectedAdmission.phone}</p>
                    <p className="full-row"><strong>Complete Address:</strong> {selectedAdmission.address}</p>
                  </div>
                  
                  {/* File Links */}
                  <div className="inspector-docs-vault">
                    <h4>Attached Verifiable Scans</h4>
                    <div className="docs-link-box">
                      <a href={`http://localhost:5000${selectedAdmission.doc_photo_path}`} target="_blank" rel="noopener noreferrer" className="doc-link-item">
                        📸 View Candidate Photo
                      </a>
                      <a href={`http://localhost:5000${selectedAdmission.doc_aadhar_path}`} target="_blank" rel="noopener noreferrer" className="doc-link-item">
                        📄 View UIDAI Aadhar Card (PDF/Image)
                      </a>
                    </div>
                  </div>
                </div>

                {/* Operations Desk */}
                <div className="inspector-operations-desk premium-card">
                  <h3>Operations Desk</h3>
                  <div className="current-status-tag">
                    <span>Current Status:</span>
                    <span className={`badge badge-${selectedAdmission.status.toLowerCase()}`}>{selectedAdmission.status}</span>
                  </div>

                  <div className="form-group">
                    <label>Internal Administrator Remarks</label>
                    <textarea 
                      value={remarks} 
                      onChange={(e) => setRemarks(e.target.value)} 
                      placeholder="Add selection remarks, scheduled interaction dates, or rejection reason codes..."
                      className="form-control" 
                      rows="4"
                    ></textarea>
                  </div>

                  <div className="operations-button-row">
                    <button onClick={() => handleUpdateStatus('Approved')} className="btn btn-success flex-btn">
                      <CheckCircle size={16} /> Approve Admission
                    </button>
                    <button onClick={() => handleUpdateStatus('Rejected')} className="btn btn-danger flex-btn">
                      <XCircle size={16} /> Reject Application
                    </button>
                    <button onClick={() => handleUpdateStatus('Under Review')} className="btn btn-primary flex-btn">
                      Mark Reviewing
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MANAGE NOTICES */}
          {activeTab === 'notices' && (
            <div className="notices-tab-content">
              <h2>Publish Circulars & Notices</h2>
              <div className="divider-left"></div>

              <div className="tab-layout-grid-splits">
                {/* Publish Form */}
                <form onSubmit={handleCreateNotice} className="publish-form-card premium-card">
                  <h3>New Announcement Form</h3>
                  <div className="form-group">
                    <label>Title / Heading <span className="req">*</span></label>
                    <input 
                      type="text" 
                      value={noticeForm.title} 
                      onChange={(e) => setNoticeForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g., Summer Homework Packets"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Category <span className="req">*</span></label>
                    <select 
                      value={noticeForm.category} 
                      onChange={(e) => setNoticeForm(p => ({ ...p, category: e.target.value }))}
                      className="form-control"
                      required
                    >
                      <option value="General">General Announcement</option>
                      <option value="Academic">Academic circular</option>
                      <option value="Exam">Examination Notice</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Notice Content</label>
                    <textarea 
                      value={noticeForm.content} 
                      onChange={(e) => setNoticeForm(p => ({ ...p, content: e.target.value }))}
                      placeholder="Write brief description..."
                      className="form-control"
                      rows="4"
                      required
                    ></textarea>
                  </div>
                  <div className="form-group">
                    <label>Attachment Document (Optional PDF)</label>
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={(e) => setNoticeFile(e.target.files[0])}
                      className="form-control"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Publish Notice Board</button>
                </form>

                {/* Published List */}
                <div className="existing-items-panel premium-card">
                  <h3>Active Notices</h3>
                  <div className="scrollable-admin-list">
                    {notices.map(notice => (
                      <div key={notice.id} className="admin-item-row">
                        <div>
                          <h4>{notice.title}</h4>
                          <span className={`badge badge-${notice.category.toLowerCase()}`}>{notice.category}</span>
                        </div>
                        <button onClick={() => handleDeleteNotice(notice.id)} className="btn-delete-icon">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {notices.length === 0 && <p className="empty-txt">No notices published.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: MANAGE GALLERY */}
          {activeTab === 'gallery' && (
            <div className="gallery-tab-content">
              <h2>Media Gallery Administration</h2>
              <div className="divider-left"></div>

              <div className="tab-layout-grid-splits">
                {/* Upload Form */}
                <form onSubmit={handleCreateGallery} className="publish-form-card premium-card">
                  <h3>Upload New Campus Photo</h3>
                  <div className="form-group">
                    <label>Photo Caption / Title <span className="req">*</span></label>
                    <input 
                      type="text" 
                      value={galleryForm.title} 
                      onChange={(e) => setGalleryForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g., Science Fair Winners"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Gallery Category <span className="req">*</span></label>
                    <select 
                      value={galleryForm.category} 
                      onChange={(e) => setGalleryForm(p => ({ ...p, category: e.target.value }))}
                      className="form-control"
                      required
                    >
                      <option value="Campus">Infrastructure & Campus</option>
                      <option value="Lab">Science & Computer Labs</option>
                      <option value="Sports">Sports & Games Activities</option>
                      <option value="Event">Cultural Event Celebrations</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Image File <span className="req">*</span></label>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => setGalleryFile(e.target.files[0])}
                      className="form-control"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Add to Gallery Grid</button>
                </form>

                {/* Gallery List */}
                <div className="existing-items-panel premium-card">
                  <h3>Active Images</h3>
                  <div className="scrollable-admin-list">
                    {gallery.map(img => (
                      <div key={img.id} className="admin-item-row">
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <img src={`http://localhost:5000${img.image_path}`} alt="" style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                          <div>
                            <h4>{img.title}</h4>
                            <span className="badge badge-general">{img.category}</span>
                          </div>
                        </div>
                        <button onClick={() => handleDeleteGallery(img.id)} className="btn-delete-icon">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {gallery.length === 0 && <p className="empty-txt">No images uploaded to database yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DOWNLOADS LIBRARY */}
          {activeTab === 'downloads' && (
            <div className="downloads-tab-content">
              <h2>Downloads Library</h2>
              <div className="divider-left"></div>

              <div className="tab-layout-grid-splits">
                {/* Upload Form */}
                <form onSubmit={handleCreateDownload} className="publish-form-card premium-card">
                  <h3>Add Downloadable Document</h3>
                  <div className="form-group">
                    <label>Document Title <span className="req">*</span></label>
                    <input 
                      type="text" 
                      value={downloadForm.title} 
                      onChange={(e) => setDownloadForm(p => ({ ...p, title: e.target.value }))}
                      placeholder="e.g., CBSE Grade X Datesheet 2026"
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>PDF Document File <span className="req">*</span></label>
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={(e) => setDownloadFile(e.target.files[0])}
                      className="form-control"
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary btn-block">Publish PDF Document</button>
                </form>

                {/* Downloads List */}
                <div className="existing-items-panel premium-card">
                  <h3>Active Download Materials</h3>
                  <div className="scrollable-admin-list">
                    {downloads.map(doc => (
                      <div key={doc.id} className="admin-item-row">
                        <div>
                          <h4>{doc.title}</h4>
                          <span className="badge badge-general" style={{ fontFamily: 'monospace' }}>{doc.file_size}</span>
                        </div>
                        <button onClick={() => handleDeleteDownload(doc.id)} className="btn-delete-icon">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    {downloads.length === 0 && <p className="empty-txt">No PDF files uploaded.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GENERAL ENQUIRIES */}
          {activeTab === 'enquiries' && (
            <div className="enquiries-tab-content">
              <h2>General Enquiries Box</h2>
              <div className="divider-left"></div>

              <div className="table-responsive">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>Sender</th>
                      <th>Contact Info</th>
                      <th>Subject</th>
                      <th>Message</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enquiries.map(enq => (
                      <tr key={enq.id}>
                        <td><strong>{enq.name}</strong></td>
                        <td>
                          <div>📞 {enq.phone}</div>
                          <div>✉️ {enq.email}</div>
                        </td>
                        <td><strong>{enq.subject}</strong></td>
                        <td><div className="enquiry-msg-cell">{enq.message}</div></td>
                        <td>{new Date(enq.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                    {enquiries.length === 0 && (
                      <tr>
                        <td colSpan="5" style={{ textAlign: 'center', padding: '40px 0' }}>No enquiry forms received yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>

      <style>{`
        .admin-dashboard-container {
          background-color: #f2f5f3;
          min-height: 100vh;
          padding-bottom: 50px;
        }

        .dashboard-top-header {
          background-color: var(--primary-dark);
          color: var(--bg-white);
          padding: 20px 0;
          box-shadow: var(--shadow-sm);
          border-bottom: 3px solid var(--secondary-color);
        }

        .header-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .header-flex h1 {
          color: var(--bg-white);
          font-size: 1.8rem;
        }

        .header-flex p {
          color: var(--secondary-light);
          font-size: 0.9rem;
        }

        .btn-logout {
          color: var(--secondary-light) !important;
          border-color: var(--secondary-light) !important;
        }

        .btn-logout:hover {
          background-color: var(--secondary-color) !important;
          color: var(--primary-dark) !important;
        }

        /* Dashboard layout */
        .dashboard-main-layout {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 30px;
          margin-top: 40px;
          align-items: start;
        }

        /* Sidebar Navigation */
        .dashboard-sidebar {
          background-color: var(--bg-white);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          overflow: hidden;
        }

        .sidebar-menu {
          list-style: none;
        }

        .sidebar-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          padding: 16px 20px;
          border: none;
          background: none;
          text-align: left;
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--text-dark);
          cursor: pointer;
          transition: var(--transition-fast);
          border-left: 4px solid transparent;
        }

        .sidebar-btn:hover {
          background-color: var(--bg-light);
          color: var(--primary-color);
        }

        .sidebar-btn.active {
          background-color: rgba(26, 86, 219, 0.05);
          color: var(--primary-color);
          border-left-color: var(--primary-color);
        }

        .sidebar-count {
          background-color: var(--danger-color);
          color: var(--bg-white);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 50px;
        }

        /* Workspace Pane */
        .dashboard-workspace-pane {
          background-color: var(--bg-white);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          padding: 40px;
          min-height: 550px;
        }

        .dashboard-workspace-pane h2 {
          font-size: 1.8rem;
          margin-bottom: 15px;
        }

        /* Stats Grid */
        .overview-stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin: 30px 0 40px 0;
        }

        .stat-box-mini {
          background-color: var(--bg-light);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 20px;
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .mini-icon {
          width: 50px;
          height: 50px;
          border-radius: var(--border-radius-sm);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .green-icon { background-color: rgba(46, 204, 113, 0.1); color: #2ece71; }
        .gold-icon { background-color: rgba(243, 156, 18, 0.1); color: #f39c12; }
        .blue-icon { background-color: rgba(41, 128, 185, 0.1); color: #2980b9; }
        .grey-icon { background-color: rgba(127, 140, 141, 0.1); color: #7f8c8d; }

        .mini-details h3 {
          font-size: 1.5rem;
          line-height: 1.1;
        }

        .mini-details p {
          font-size: 0.78rem;
          color: var(--text-light);
          font-weight: 600;
          text-transform: uppercase;
        }

        /* Splits */
        .recent-activity-splits {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .activity-list {
          display: flex;
          flex-direction: column;
          gap: 15px;
          margin-top: 20px;
        }

        .activity-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 10px;
        }

        .activity-row:last-child {
          border-bottom: none;
        }

        .activity-row h4 {
          font-size: 0.95rem;
          color: var(--primary-dark);
        }

        .activity-row p {
          font-size: 0.82rem;
          color: var(--text-light);
        }

        .empty-txt {
          color: var(--text-light);
          font-size: 0.9rem;
          text-align: center;
          padding: 20px 0;
        }

        /* Search Actions */
        .workspace-header-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .search-bar-wrapper {
          position: relative;
          width: 300px;
        }

        .search-icon {
          position: absolute;
          top: 50%;
          left: 14px;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        .search-input {
          padding-left: 40px !important;
          border-radius: 50px !important;
        }

        /* Inspector Details */
        .inspector-header {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 15px;
        }

        .inspector-splits {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 25px;
          margin-top: 25px;
        }

        .grid-details-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 15px;
        }

        .grid-details-layout p {
          font-size: 0.92rem;
          color: var(--text-dark);
        }

        .grid-details-layout p.full-row {
          grid-column: span 2;
        }

        .inspector-docs-vault {
          margin-top: 30px;
          border-top: 1px solid var(--border-color);
          padding-top: 20px;
        }

        .docs-link-box {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 12px;
        }

        .doc-link-item {
          display: inline-flex;
          align-items: center;
          background-color: var(--bg-light);
          border: 1px solid var(--border-color);
          padding: 10px 16px;
          border-radius: var(--border-radius-sm);
          font-weight: 600;
          font-size: 0.88rem;
          color: var(--primary-light);
        }

        .doc-link-item:hover {
          background-color: var(--primary-color);
          color: var(--bg-white);
        }

        .current-status-tag {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 25px;
          font-weight: 600;
        }

        .operations-button-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 20px;
        }

        .flex-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn-success {
          background-color: var(--success-color);
          color: var(--bg-white);
        }

        .btn-success:hover {
          background-color: #27ae60;
        }

        /* Splits Form Layout */
        .tab-layout-grid-splits {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 30px;
          margin-top: 25px;
          align-items: start;
        }

        .scrollable-admin-list {
          max-height: 400px;
          overflow-y: auto;
          margin-top: 15px;
        }

        .admin-item-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--border-color);
          padding: 15px 0;
        }

        .admin-item-row:last-child {
          border-bottom: none;
        }

        .admin-item-row h4 {
          font-size: 0.95rem;
          margin-bottom: 4px;
        }

        .btn-delete-icon {
          background: none;
          border: none;
          color: var(--danger-color);
          cursor: pointer;
          padding: 5px;
          border-radius: 4px;
        }

        .btn-delete-icon:hover {
          background-color: #fdedd8;
        }

        .enquiry-msg-cell {
          max-width: 280px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @media (max-width: 1200px) {
          .dashboard-main-layout {
            grid-template-columns: 1fr;
          }
          .dashboard-sidebar {
            width: 100%;
          }
          .sidebar-menu {
            display: flex;
            flex-wrap: wrap;
          }
          .sidebar-btn {
            border-left: none;
            border-bottom: 3px solid transparent;
            padding: 12px 15px;
          }
          .sidebar-btn.active {
            border-bottom-color: var(--primary-color);
          }
        }

        @media (max-width: 992px) {
          .inspector-splits, .tab-layout-grid-splits {
            grid-template-columns: 1fr;
          }
          .overview-stats-grid {
            grid-template-columns: 1fr 1fr;
          }
          .recent-activity-splits {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
