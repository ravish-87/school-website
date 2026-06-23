import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Calendar, Bell, ChevronLeft, ChevronRight, Award, Compass, Heart, Users } from 'lucide-react';
import { API_URL } from '../config';

export default function Home() {
  const [notices, setNotices] = useState([]);
  const [activeTab, setActiveTab] = useState('All');
  const [currentSlide, setCurrentSlide] = useState(0);

  const heroSlides = [
    {
      image: '/campus.png',
      title: 'Inspiring Minds, Shaping Futures',
      subtitle: 'Welcome to ABC Public School, where academic excellence meets holistic character development.'
    },
    {
      image: '/robotics.png',
      title: 'Futuristic Robotics & Innovation Lab',
      subtitle: 'Fostering hands-on stem education, critical thinking, and advanced technology integration from junior classes.'
    },
    {
      image: '/sports.png',
      title: 'State-of-the-Art Sports Infrastructure',
      subtitle: 'Nurturing physical fitness, leadership skills, and team spirit through comprehensive sports training.'
    }
  ];

  useEffect(() => {
    // Auto slide hero
    const slideInterval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, []);

  useEffect(() => {
    fetch(`${API_URL}/notices`)
      .then(res => res.json())
      .then(data => setNotices(data))
      .catch(err => {
        console.error('Failed to fetch notices:', err);
        // Fallbacks if backend is offline
        setNotices([
          { id: 1, title: 'Admissions Open for Session 2026-27', content: 'Online registration forms are now available for classes Nursery to IX.', category: 'General', created_at: new Date().toISOString() },
          { id: 2, title: 'Summer Vacation Notice', content: 'School closes for summer holidays from June 15th to July 10th.', category: 'Academic', created_at: new Date().toISOString() }
        ]);
      });
  }, []);

  const nextSlide = () => setCurrentSlide((currentSlide + 1) % heroSlides.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + heroSlides.length) % heroSlides.length);

  const filteredNotices = notices.filter(n => activeTab === 'All' || n.category === activeTab);

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="home-page-container">
      {/* News Ticker Ticker */}
      <div className="ticker-container">
        <div className="ticker-label">Announcements</div>
        <div className="ticker-wrapper">
          <div className="ticker-items">
            {notices.map(notice => (
              <span key={notice.id} className="ticker-item">
                <Link to="/downloads">{notice.title}</Link>
              </span>
            ))}
            {notices.length === 0 && <span className="ticker-item">Welcome to ABC Public School! Admissions are open for classes Nursery to IX.</span>}
          </div>
        </div>
      </div>

      {/* Hero Carousel */}
      <div className="hero-carousel-section">
        {heroSlides.map((slide, idx) => (
          <div key={idx} className={`hero-slide ${idx === currentSlide ? 'active' : ''}`} style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.4)), url(${slide.image})` }}>
            <div className="container slide-content animate-fade-in">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
              <div className="hero-actions">
                <Link to="/admissions" className="btn btn-secondary">Apply Online Now</Link>
                <Link to="/about" className="btn btn-outline-white">Explore School</Link>
              </div>
            </div>
          </div>
        ))}
        
        <button onClick={prevSlide} className="carousel-nav-btn prev-btn"><ChevronLeft size={24} /></button>
        <button onClick={nextSlide} className="carousel-nav-btn next-btn"><ChevronRight size={24} /></button>

        <div className="carousel-dots">
          {heroSlides.map((_, idx) => (
            <span key={idx} onClick={() => setCurrentSlide(idx)} className={`dot ${idx === currentSlide ? 'active' : ''}`}></span>
          ))}
        </div>
      </div>

      {/* Quick Access Grid */}
      <div className="container quick-access-grid">
        <Link to="/admissions" className="quick-card card-green">
          <div className="card-icon">🎓</div>
          <h3>Admission Portal</h3>
          <p>Read admission criteria, fee structure, and submit student forms online.</p>
          <span className="card-action-text">Apply Online <ArrowRight size={16} /></span>
        </Link>
        <Link to="/downloads" className="quick-card card-gold">
          <div className="card-icon">📚</div>
          <h3>Download Almanac</h3>
          <p>Get copy of Syllabus, TC request format, and School almanac calendar.</p>
          <span className="card-action-text">Downloads <ArrowRight size={16} /></span>
        </Link>
        <Link to="/gallery" className="quick-card card-blue">
          <div className="card-icon">🖼️</div>
          <h3>Virtual Tour</h3>
          <p>Explore our beautiful infrastructure, sports field, and laboratory facilities.</p>
          <span className="card-action-text">View Gallery <ArrowRight size={16} /></span>
        </Link>
      </div>

      {/* Welcome Messages */}
      <section className="section-padding welcome-section">
        <div className="container welcome-grid">
          <div className="welcome-image-area">
            <img src="/campus.png" alt="ABC Public School Entrance" className="welcome-main-img" />
            <div className="welcome-years-tag">
              <span className="years-num">10+</span>
              <span className="years-txt">Years of Excellence</span>
            </div>
          </div>
          <div className="welcome-text-area">
            <h2>Welcome to ABC Public School</h2>
            <div className="divider-left"></div>
            <p className="welcome-intro">
              ABC Public School is a premier temple of learning.
            </p>
            <p className="welcome-body">
              Spread across a state-of-the-art green campus, our institution focuses on child-centric, research-oriented instruction. We maintain a healthy student-teacher ratio, smart classrooms, and top-tier labs. We focus on academic rigor as well as physical education, coding, and creative arts, ensuring our students become global leaders.
            </p>
            <div className="leadership-signature">
              <div>
                <h4>Dr. Ram Chandra</h4>
                <p>Pro-Vice Chairman, ABC Public School</p>
              </div>
              <Link to="/about" className="btn btn-primary">Read Leadership Messages</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Notice Board & Circulars Section */}
      <section className="notices-section section-padding">
        <div className="container">
          <div className="section-header">
            <h2>Notice Board & Circulars</h2>
            <p>Stay updated with the latest circulars, announcements, and schedules.</p>
          </div>

          <div className="notices-dashboard-wrapper">
            <div className="notices-filter-tabs">
              {['All', 'General', 'Academic', 'Exam'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)} className={`filter-tab-btn ${activeTab === tab ? 'active' : ''}`}>
                  {tab} Notices
                </button>
              ))}
            </div>

            <div className="notices-list-container">
              {filteredNotices.map(notice => (
                <div key={notice.id} className="notice-item-card">
                  <div className="notice-meta">
                    <span className="notice-date-badge">
                      <Calendar size={14} /> {formatDate(notice.created_at)}
                    </span>
                    <span className={`notice-category-badge badge-${notice.category.toLowerCase()}`}>
                      {notice.category}
                    </span>
                  </div>
                  <div className="notice-content">
                    <h3>{notice.title}</h3>
                    <p>{notice.content}</p>
                    {notice.file_path && (
                      <a href={`http://localhost:5000${notice.file_path}`} target="_blank" rel="noopener noreferrer" className="notice-download-btn">
                        📂 Download Attachment (PDF)
                      </a>
                    )}
                  </div>
                </div>
              ))}
              {filteredNotices.length === 0 && (
                <div className="no-notices-found">
                  <Bell size={48} className="bell-icon" />
                  <p>No circulars found under this category.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values & Statistics */}
      <section className="stats-section">
        <div className="container stats-flex">
          <div className="stat-card">
            <Users size={36} className="stat-icon" />
            <div className="stat-value">2,200+</div>
            <div className="stat-label">Enrolled Students</div>
          </div>
          <div className="stat-card">
            <Award size={36} className="stat-icon" />
            <div className="stat-value">100%</div>
            <div className="stat-label">CBSE Pass Rate</div>
          </div>
          <div className="stat-card">
            <Compass size={36} className="stat-icon" />
            <div className="stat-value">35+</div>
            <div className="stat-label">Co-curricular Clubs</div>
          </div>
          <div className="stat-card">
            <Heart size={36} className="stat-icon" />
            <div className="stat-value">95+</div>
            <div className="stat-label">Expert Educators</div>
          </div>
        </div>
      </section>

      {/* Campus Tour Showcase preview */}
      <section className="section-padding tour-section">
        <div className="container">
          <div className="section-header">
            <h2>Campus Tour</h2>
            <p>An environment curated for deep concentration, active learning, and creative play.</p>
          </div>
          <div className="tour-gallery-preview">
            <div className="tour-img-card">
              <img src="/campus.png" alt="Campus Building" />
              <div className="img-overlay"><h4>Academic Block</h4></div>
            </div>
            <div className="tour-img-card">
              <img src="/robotics.png" alt="Robotics Innovation Lab" />
              <div className="img-overlay"><h4>Robotics Lab</h4></div>
            </div>
            <div className="tour-img-card">
              <img src="/sports.png" alt="Sports Field" />
              <div className="img-overlay"><h4>Sports Ground</h4></div>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '40px' }}>
            <Link to="/gallery" className="btn btn-primary">View Full Campus Gallery</Link>
          </div>
        </div>
      </section>

      {/* Styles */}
      <style>{`
        .hero-carousel-section {
          position: relative;
          height: 600px;
          overflow: hidden;
        }

        .hero-slide {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-size: cover;
          background-position: center;
          opacity: 0;
          transition: opacity 1s ease-in-out;
          display: flex;
          align-items: center;
          z-index: 1;
        }

        .hero-slide.active {
          opacity: 1;
          z-index: 2;
        }

        .slide-content {
          color: var(--bg-white);
          max-width: 800px;
        }

        .slide-content h1 {
          font-size: 3.5rem;
          color: var(--bg-white);
          text-shadow: 0 2px 4px rgba(0,0,0,0.5);
          margin-bottom: 20px;
        }

        .slide-content p {
          font-size: 1.25rem;
          text-shadow: 0 1px 3px rgba(0,0,0,0.5);
          margin-bottom: 30px;
          opacity: 0.95;
        }

        .hero-actions {
          display: flex;
          gap: 15px;
        }

        .btn-outline-white {
          background-color: transparent;
          color: var(--bg-white);
          border: 2px solid var(--bg-white);
        }

        .btn-outline-white:hover {
          background-color: var(--bg-white);
          color: var(--primary-dark);
        }

        .carousel-nav-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(0, 0, 0, 0.4);
          color: var(--bg-white);
          border: none;
          width: 50px;
          height: 50px;
          border-radius: 50%;
          cursor: pointer;
          z-index: 3;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: var(--transition-fast);
        }

        .carousel-nav-btn:hover {
          background-color: var(--primary-color);
        }

        .prev-btn { left: 20px; }
        .next-btn { right: 20px; }

        .carousel-dots {
          position: absolute;
          bottom: 30px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 3;
          display: flex;
          gap: 10px;
        }

        .carousel-dots .dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          transition: var(--transition-fast);
        }

        .carousel-dots .dot.active {
          background-color: var(--secondary-color);
          width: 25px;
          border-radius: 6px;
        }

        /* Quick Access */
        .quick-access-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
          margin-top: -60px;
          position: relative;
          z-index: 5;
        }

        .quick-card {
          background-color: var(--bg-white);
          padding: 30px;
          border-radius: var(--border-radius-md);
          box-shadow: 0 10px 30px rgba(0,0,0,0.08);
          color: var(--text-dark);
          transition: var(--transition-normal);
          border-bottom: 5px solid transparent;
        }

        .quick-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0,0,0,0.12);
        }

        .card-green { border-bottom-color: var(--primary-color); }
        .card-gold { border-bottom-color: var(--secondary-color); }
        .card-blue { border-bottom-color: var(--accent-color); }

        .card-icon {
          font-size: 2.5rem;
          margin-bottom: 20px;
        }

        .quick-card h3 {
          font-size: 1.25rem;
          margin-bottom: 12px;
        }

        .quick-card p {
          color: var(--text-light);
          font-size: 0.92rem;
          margin-bottom: 20px;
        }

        .card-action-text {
          display: flex;
          align-items: center;
          gap: 6px;
          font-weight: 700;
          color: var(--primary-color);
          font-size: 0.9rem;
        }

        /* Welcome Section */
        .welcome-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 50px;
          align-items: center;
        }

        .welcome-image-area {
          position: relative;
        }

        .welcome-main-img {
          width: 100%;
          border-radius: var(--border-radius-lg);
          box-shadow: var(--shadow-lg);
        }

        .welcome-years-tag {
          position: absolute;
          bottom: -20px;
          right: -20px;
          background-color: var(--secondary-color);
          color: var(--primary-dark);
          padding: 20px 30px;
          border-radius: var(--border-radius-md);
          display: flex;
          flex-direction: column;
          align-items: center;
          box-shadow: var(--shadow-md);
        }

        .years-num {
          font-size: 2.2rem;
          font-weight: 800;
          line-height: 1;
        }

        .years-txt {
          font-size: 0.8rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .divider-left {
          width: 60px;
          height: 4px;
          background-color: var(--secondary-color);
          margin: 15px 0 25px 0;
          border-radius: 2px;
        }

        .welcome-intro {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--primary-color);
          margin-bottom: 15px;
        }

        .welcome-body {
          color: var(--text-light);
          margin-bottom: 30px;
        }

        .leadership-signature {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--border-color);
          padding-top: 25px;
          flex-wrap: wrap;
          gap: 15px;
        }

        .leadership-signature h4 {
          color: var(--primary-dark);
          font-size: 1.1rem;
        }

        .leadership-signature p {
          font-size: 0.85rem;
          color: var(--text-light);
          font-weight: 500;
        }

        /* Notices Board Widget */
        .notices-section {
          background-color: #f2f5f3;
        }

        .notices-dashboard-wrapper {
          background-color: var(--bg-white);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-sm);
          overflow: hidden;
          border: 1px solid var(--border-color);
        }

        .notices-filter-tabs {
          display: flex;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-light);
        }

        .filter-tab-btn {
          flex: 1;
          padding: 16px;
          border: none;
          background: none;
          font-weight: 600;
          cursor: pointer;
          color: var(--text-light);
          transition: var(--transition-fast);
        }

        .filter-tab-btn:hover {
          color: var(--primary-color);
          background-color: rgba(13, 92, 52, 0.02);
        }

        .filter-tab-btn.active {
          color: var(--primary-color);
          background-color: var(--bg-white);
          border-bottom: 3px solid var(--primary-color);
        }

        .notices-list-container {
          padding: 15px;
          max-height: 450px;
          overflow-y: auto;
        }

        .notice-item-card {
          padding: 20px;
          border-bottom: 1px solid var(--border-color);
          transition: var(--transition-fast);
        }

        .notice-item-card:last-child {
          border-bottom: none;
        }

        .notice-item-card:hover {
          background-color: rgba(13, 92, 52, 0.01);
        }

        .notice-meta {
          display: flex;
          gap: 15px;
          margin-bottom: 10px;
          font-size: 0.82rem;
          font-weight: 600;
        }

        .notice-date-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          color: var(--text-light);
        }

        .notice-category-badge {
          font-size: 0.75rem;
          padding: 2px 8px;
          border-radius: 4px;
        }

        .badge-general { background-color: #ebf5fb; color: #2980b9; }
        .badge-academic { background-color: #e8f8f5; color: #2ecc71; }
        .badge-exam { background-color: #fdedd8; color: #e74c3c; }

        .notice-content h3 {
          font-size: 1.15rem;
          margin-bottom: 8px;
        }

        .notice-content p {
          color: var(--text-light);
          font-size: 0.95rem;
          margin-bottom: 10px;
        }

        .notice-download-btn {
          display: inline-flex;
          align-items: center;
          font-size: 0.85rem;
          color: var(--primary-light);
          font-weight: 600;
        }

        .notice-download-btn:hover {
          color: var(--primary-dark);
          text-decoration: underline;
        }

        .no-notices-found {
          padding: 50px;
          text-align: center;
          color: var(--text-light);
        }

        .bell-icon {
          color: var(--border-color);
          margin-bottom: 15px;
        }

        /* Stats */
        .stats-section {
          background: linear-gradient(135deg, var(--primary-dark), var(--primary-color));
          color: var(--bg-white);
          padding: 60px 0;
        }

        .stats-flex {
          display: flex;
          justify-content: space-around;
          flex-wrap: wrap;
          gap: 30px;
        }

        .stat-card {
          text-align: center;
          flex: 1;
          min-width: 200px;
        }

        .stat-icon {
          color: var(--secondary-color);
          margin-bottom: 15px;
          animation: pulseBorder 3s infinite ease-in-out;
        }

        .stat-value {
          font-size: 2.8rem;
          font-weight: 800;
          color: var(--bg-white);
          line-height: 1.1;
        }

        .stat-label {
          color: var(--secondary-light);
          font-weight: 600;
          font-size: 0.95rem;
          text-transform: uppercase;
          margin-top: 5px;
        }

        /* Tour Gallery Preview */
        .tour-gallery-preview {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }

        .tour-img-card {
          position: relative;
          height: 250px;
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
        }

        .tour-img-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-normal);
        }

        .tour-img-card:hover img {
          transform: scale(1.1);
        }

        .img-overlay {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(transparent, rgba(0,0,0,0.8));
          padding: 20px;
          color: var(--bg-white);
        }

        .img-overlay h4 {
          color: var(--bg-white);
          font-size: 1.1rem;
        }

        @media (max-width: 992px) {
          .slide-content h1 { font-size: 2.5rem; }
          .quick-access-grid {
            grid-template-columns: 1fr;
            margin-top: -30px;
            padding: 0 20px;
          }
          .welcome-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .tour-gallery-preview {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
