import React, { useState, useEffect } from 'react';
import { Download, Search, FileText } from 'lucide-react';
import { API_URL } from '../config';

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const defaultDownloads = [
    { id: 101, title: 'School Almanac & Student Handbook 2026-27', file_path: '/uploads/default_almanac.pdf', file_size: '1.2 MB', created_at: new Date().toISOString() },
    { id: 102, title: 'Syllabus - Grade 1 to 5', file_path: '/uploads/syllabus_primary.pdf', file_size: '850 KB', created_at: new Date().toISOString() },
    { id: 103, title: 'Syllabus - Grade 6 to 10', file_path: '/uploads/syllabus_secondary.pdf', file_size: '1.1 MB', created_at: new Date().toISOString() },
    { id: 104, title: 'Transfer Certificate (TC) Application Form', file_path: '/uploads/tc_form.pdf', file_size: '240 KB', created_at: new Date().toISOString() }
  ];

  useEffect(() => {
    fetch(`${API_URL}/downloads`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setDownloads(data);
        } else {
          setDownloads(defaultDownloads);
        }
      })
      .catch(err => {
        console.error('Failed to fetch downloads:', err);
        setDownloads(defaultDownloads);
      });
  }, []);

  const filteredDownloads = downloads.filter(d => 
    d.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="downloads-page-container animate-fade-in">
      {/* Banner */}
      <div className="downloads-banner-header" style={{ backgroundImage: `linear-gradient(rgba(26, 86, 219, 0.82), rgba(30, 58, 138, 0.9)), url(/robotics.png)` }}>
        <div className="container banner-inner">
          <h1>Downloads & Forms Center</h1>
          <p>Find important school documents, syllabus files, and application forms.</p>
        </div>
      </div>

      {/* Main Downloads Section */}
      <section className="section-padding container">
        <div className="search-bar-wrapper">
          <Search size={20} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search documents by title (e.g. Syllabus, Almanac)..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-control search-input"
          />
        </div>

        {/* Downloads Table */}
        <div className="table-responsive">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Document Title</th>
                <th>File Size</th>
                <th>Upload Date</th>
                <th style={{ textAlign: 'right' }}>Download Link</th>
              </tr>
            </thead>
            <tbody>
              {filteredDownloads.map(doc => {
                const downloadLink = doc.file_path.startsWith('/uploads/') ? `http://localhost:5000${doc.file_path}` : doc.file_path;
                return (
                  <tr key={doc.id}>
                    <td className="doc-title-cell">
                      <FileText size={18} className="doc-icon-slate" />
                      <span>{doc.title}</span>
                    </td>
                    <td>{doc.file_size}</td>
                    <td>{formatDate(doc.created_at)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <a href={downloadLink} target="_blank" rel="noopener noreferrer" download className="btn btn-primary btn-download">
                        <Download size={14} /> Download PDF
                      </a>
                    </td>
                  </tr>
                );
              })}
              {filteredDownloads.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '50px 0', color: 'var(--text-light)' }}>
                    No documents found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <style>{`
        .downloads-banner-header {
          background-size: cover;
          background-position: center;
          padding: 100px 0;
          color: var(--bg-white);
          text-align: center;
        }

        .banner-inner h1 {
          font-size: 3rem;
          color: var(--bg-white);
          margin-bottom: 15px;
        }

        .banner-inner p {
          font-size: 1.2rem;
          opacity: 0.9;
          max-width: 600px;
          margin: 0 auto;
        }

        .search-bar-wrapper {
          position: relative;
          max-width: 600px;
          margin: 0 auto 40px auto;
        }

        .search-icon {
          position: absolute;
          top: 50%;
          left: 16px;
          transform: translateY(-50%);
          color: var(--text-light);
        }

        .search-input {
          padding-left: 50px !important;
          border-radius: 50px !important;
          background-color: var(--bg-white) !important;
          box-shadow: var(--shadow-sm);
        }

        .search-input:focus {
          box-shadow: var(--shadow-md) !important;
        }

        .doc-title-cell {
          display: flex;
          align-items: center;
          gap: 12px;
          font-weight: 600;
          color: var(--primary-dark);
        }

        .doc-icon-slate {
          color: var(--text-light);
          flex-shrink: 0;
        }

        .btn-download {
          padding: 8px 16px;
          font-size: 0.85rem;
          border-radius: var(--border-radius-sm);
        }
      `}</style>
    </div>
  );
}
