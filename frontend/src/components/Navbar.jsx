import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ChevronDown, GraduationCap, FileText, Image, Phone, Home, Info, ShieldAlert } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on page change
  useEffect(() => {
    setIsOpen(false);
    setActiveDropdown(null);
  }, [location]);

  const toggleDropdown = (name) => {
    if (activeDropdown === name) {
      setActiveDropdown(null);
    } else {
      setActiveDropdown(name);
    }
  };

  const isActive = (path) => location.pathname === path;
  const isDropdownActive = (paths) => paths.some(path => location.pathname.startsWith(path));

  return (
    <nav className={`navbar-wrapper ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="navbar-top-bar">
        <div className="container top-bar-content">
          <div className="contact-info">
            <span>📞 Admission Helpline: 87095103</span>
            <span className="separator">|</span>
            <span>✉️ info@ravi.com</span>
          </div>
          <div className="top-links">
            <Link to="/admin" className="admin-portal-link">🛡️ Admin Portal</Link>
          </div>
        </div>
      </div>
      
      <div className="main-navbar-container glass-panel">
        <div className="container navbar-flex">
          <Link to="/" className="navbar-logo-area">
            <GraduationCap className="logo-icon" size={32} />
            <div className="logo-text">
              <span className="school-title-main">ABC PUBLIC SCHOOL</span>
              <span className="school-title-sub">(Affiliated to CBSE)</span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <ul className="desktop-nav-menu">
            <li>
              <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
                <Home size={18} /> Home
              </Link>
            </li>
            <li>
              <Link to="/about" className={`nav-link ${isActive('/about') ? 'active' : ''}`}>
                <Info size={18} /> About Us
              </Link>
            </li>
            
            {/* Admissions Dropdown */}
            <li className="nav-item-dropdown">
              <button 
                onClick={() => toggleDropdown('admissions')}
                className={`nav-link dropdown-trigger ${isDropdownActive(['/admissions']) ? 'active' : ''}`}
              >
                🎓 Admissions <ChevronDown size={16} />
              </button>
              <ul className={`dropdown-menu ${activeDropdown === 'admissions' ? 'show' : ''}`}>
                <li><Link to="/admissions">Admissions Overview</Link></li>
                <li><Link to="/admissions#fee-structure">Fee Structure</Link></li>
                <li><Link to="/admissions#register-online">Online Registration</Link></li>
                <li><Link to="/admissions#check-status">Application Status</Link></li>
              </ul>
            </li>

            <li>
              <Link to="/gallery" className={`nav-link ${isActive('/gallery') ? 'active' : ''}`}>
                <Image size={18} /> Gallery
              </Link>
            </li>
            <li>
              <Link to="/downloads" className={`nav-link ${isActive('/downloads') ? 'active' : ''}`}>
                <FileText size={18} /> Downloads
              </Link>
            </li>
            <li>
              <Link to="/contact" className={`nav-link ${isActive('/contact') ? 'active' : ''}`}>
                <Phone size={18} /> Contact
              </Link>
            </li>
          </ul>

          {/* Mobile Menu Toggle */}
          <button className="mobile-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div className={`mobile-nav-drawer ${isOpen ? 'open' : ''}`}>
        <ul className="mobile-nav-list">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About Us</Link>
          </li>
          <li className="mobile-dropdown-parent">
            <button onClick={() => toggleDropdown('mobile-admissions')}>
              Admissions <ChevronDown size={16} />
            </button>
            <ul className={`mobile-dropdown ${activeDropdown === 'mobile-admissions' ? 'show' : ''}`}>
              <li><Link to="/admissions">Admissions Details</Link></li>
              <li><Link to="/admissions#fee-structure">Fee Structure</Link></li>
              <li><Link to="/admissions#register-online">Apply Online</Link></li>
              <li><Link to="/admissions#check-status">Check Status</Link></li>
            </ul>
          </li>
          <li>
            <Link to="/gallery">Gallery</Link>
          </li>
          <li>
            <Link to="/downloads">Downloads</Link>
          </li>
          <li>
            <Link to="/contact">Contact Us</Link>
          </li>
          <li>
            <Link to="/admin" className="mobile-admin-btn">🛡️ Admin Dashboard</Link>
          </li>
        </ul>
      </div>

      {/* Styles for Navbar */}
      <style>{`
        .navbar-wrapper {
          position: sticky;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          transition: var(--transition-normal);
        }
        
        .navbar-top-bar {
          background-color: var(--primary-dark);
          color: var(--bg-white);
          font-size: 0.85rem;
          padding: 8px 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .top-bar-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .contact-info {
          display: flex;
          gap: 15px;
        }

        .separator {
          opacity: 0.4;
        }

        .admin-portal-link {
          font-weight: 600;
          color: var(--secondary-light);
        }

        .admin-portal-link:hover {
          color: var(--secondary-color);
        }
        
        .main-navbar-container {
          background-color: rgba(255, 255, 255, 0.95);
          box-shadow: var(--shadow-sm);
          transition: var(--transition-normal);
        }

        .navbar-scrolled .main-navbar-container {
          background-color: rgba(13, 92, 52, 0.98);
          box-shadow: var(--shadow-md);
        }

        .navbar-scrolled .navbar-top-bar {
          height: 0;
          padding: 0;
          overflow: hidden;
          border-bottom: none;
        }

        .navbar-flex {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 75px;
          transition: var(--transition-normal);
        }

        .navbar-logo-area {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .logo-icon {
          color: var(--primary-color);
          transition: var(--transition-normal);
        }

        .navbar-scrolled .logo-icon {
          color: var(--secondary-color);
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .school-title-main {
          font-size: 1.3rem;
          font-weight: 800;
          letter-spacing: 0.5px;
          color: var(--primary-dark);
          transition: var(--transition-normal);
        }

        .navbar-scrolled .school-title-main {
          color: var(--bg-white);
        }

        .school-title-sub {
          font-size: 0.75rem;
          font-weight: 600;
          letter-spacing: 1px;
          color: var(--secondary-dark);
          margin-top: -2px;
          transition: var(--transition-normal);
        }

        .navbar-scrolled .school-title-sub {
          color: var(--secondary-light);
        }

        .desktop-nav-menu {
          display: flex;
          align-items: center;
          gap: 8px;
          list-style: none;
        }

        .desktop-nav-menu li {
          position: relative;
        }

        .nav-link {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          font-weight: 600;
          color: var(--text-dark);
          border-radius: var(--border-radius-sm);
          font-size: 0.95rem;
        }

        .navbar-scrolled .nav-link {
          color: rgba(255, 255, 255, 0.85);
        }

        .nav-link:hover, .nav-link.active {
          color: var(--primary-color);
          background-color: rgba(13, 92, 52, 0.05);
        }

        .navbar-scrolled .nav-link:hover, .navbar-scrolled .nav-link.active {
          color: var(--primary-dark);
          background-color: var(--secondary-color);
        }

        .dropdown-trigger {
          border: none;
          background: none;
          cursor: pointer;
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          background-color: var(--bg-white);
          min-width: 200px;
          box-shadow: var(--shadow-md);
          border-radius: var(--border-radius-sm);
          border: 1px solid var(--border-color);
          padding: 8px 0;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: var(--transition-fast);
          list-style: none;
        }

        .nav-item-dropdown:hover .dropdown-menu,
        .dropdown-menu.show {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }

        .dropdown-menu li a {
          display: block;
          padding: 10px 20px;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--text-dark);
        }

        .dropdown-menu li a:hover {
          background-color: var(--bg-light);
          color: var(--primary-color);
          padding-left: 24px;
        }

        .mobile-toggle-btn {
          display: none;
          background: none;
          border: none;
          color: var(--primary-dark);
          cursor: pointer;
        }

        .navbar-scrolled .mobile-toggle-btn {
          color: var(--bg-white);
        }

        /* Mobile Nav Drawer styles */
        .mobile-nav-drawer {
          position: fixed;
          top: 110px;
          left: 0;
          width: 100%;
          background-color: var(--bg-white);
          box-shadow: var(--shadow-md);
          border-bottom: 3px solid var(--primary-color);
          transform: translateY(-110%);
          opacity: 0;
          visibility: hidden;
          transition: var(--transition-normal);
          z-index: 999;
          padding: 20px 0;
          max-height: calc(100vh - 110px);
          overflow-y: auto;
        }

        .mobile-nav-drawer.open {
          transform: translateY(0);
          opacity: 1;
          visibility: visible;
        }

        .navbar-scrolled .mobile-nav-drawer {
          top: 75px;
        }

        .mobile-nav-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          padding: 0 24px;
          gap: 15px;
        }

        .mobile-nav-list li a,
        .mobile-dropdown-parent button {
          display: block;
          width: 100%;
          text-align: left;
          padding: 10px 0;
          font-size: 1.1rem;
          font-weight: 600;
          color: var(--text-dark);
          border: none;
          background: none;
          cursor: pointer;
        }

        .mobile-dropdown-parent button {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .mobile-dropdown {
          list-style: none;
          padding-left: 20px;
          border-left: 2px solid var(--secondary-color);
          display: none;
          flex-direction: column;
          gap: 10px;
          margin-top: 5px;
        }

        .mobile-dropdown.show {
          display: flex;
        }

        .mobile-dropdown li a {
          font-size: 0.95rem;
          padding: 5px 0;
          color: var(--text-light);
        }

        .mobile-admin-btn {
          margin-top: 10px;
          background-color: var(--primary-dark);
          color: var(--secondary-light) !important;
          text-align: center !important;
          border-radius: var(--border-radius-sm);
          padding: 12px !important;
        }

        @media (max-width: 992px) {
          .desktop-nav-menu {
            display: none;
          }
          .mobile-toggle-btn {
            display: block;
          }
        }
      `}</style>
    </nav>
  );
}
