import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Award, ArrowRight } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer-section">
      <div className="container footer-grid">
        {/* School Info */}
        <div className="footer-col about-col">
          <div className="footer-logo">
            <span className="logo-main">ABC PUBLIC SCHOOL</span>
            <span className="logo-sub">Affiliation No. 3430369</span>
          </div>
          <p className="footer-desc">
            ABC Public School is committed to providing a holistic educational experience that prepares students for global challenges while keeping them rooted in values and integrity.
          </p>
          <div className="affiliation-badge">
            <Award size={18} className="badge-icon" />
            <span>CBSE Co-Educational Senior Secondary School</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col links-col">
          <h3>Quick Links</h3>
          <ul className="footer-links-list">
            <li>
              <Link to="/about"><ArrowRight size={14} /> About Our School</Link>
            </li>
            <li>
              <Link to="/admissions"><ArrowRight size={14} /> Admissions Guide</Link>
            </li>
            <li>
              <Link to="/gallery"><ArrowRight size={14} /> Campus Photo Gallery</Link>
            </li>
            <li>
              <Link to="/downloads"><ArrowRight size={14} /> Document Downloads</Link>
            </li>
            <li>
              <Link to="/contact"><ArrowRight size={14} /> Get in Touch</Link>
            </li>
            <li>
              <Link to="/admin"><ArrowRight size={14} /> Administrator Login</Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-col contact-col">
          <h3>Contact Details</h3>
          <ul className="footer-contact-list">
            <li>
              <MapPin size={22} className="contact-icon" />
              <span>xyz,pin-12345</span>
            </li>
            <li>
              <Phone size={18} className="contact-icon" />
              <span>87095103, +91 99999 77777</span>
            </li>
            <li>
              <Mail size={18} className="contact-icon" />
              <span>info@ravi.com, admissions@ravi.com</span>
            </li>
          </ul>
        </div>

        {/* Location Map */}
        <div className="footer-col map-col">
          <h3>Our Campus Location</h3>
          <div className="map-frame-wrapper">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.1764377038173!2d86.6698943150062!3d25.028045983976295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f13e778dfcb7d9%3A0xe104cf425ef4dfec!2sDelhi%20Public%20School%20Deoghar!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin" 
              width="100%" 
              height="150" 
              style={{ border: 0, borderRadius: 'var(--border-radius-sm)' }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="ABC Public School Map"
            ></iframe>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container bottom-content">
          <p>&copy; {currentYear} ABC Public School. All Rights Reserved.</p>
        </div>
      </div>

      <style>{`
        .footer-section {
          background-color: var(--primary-dark);
          color: rgba(255, 255, 255, 0.8);
          padding: 70px 0 0 0;
          border-top: 5px solid var(--secondary-color);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1.2fr 1.8fr 2fr;
          gap: 40px;
          margin-bottom: 50px;
        }

        .footer-col h3 {
          color: var(--bg-white);
          font-size: 1.2rem;
          margin-bottom: 25px;
          position: relative;
          padding-bottom: 10px;
        }

        .footer-col h3::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 35px;
          height: 3px;
          background-color: var(--secondary-color);
          border-radius: 1.5px;
        }

        .about-col {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .footer-logo {
          display: flex;
          flex-direction: column;
        }

        .logo-main {
          font-size: 1.4rem;
          font-weight: 800;
          color: var(--bg-white);
          letter-spacing: 0.5px;
        }

        .logo-sub {
          font-size: 0.8rem;
          color: var(--secondary-light);
          font-weight: 600;
        }

        .footer-desc {
          font-size: 0.92rem;
          line-height: 1.5;
        }

        .affiliation-badge {
          display: flex;
          align-items: center;
          gap: 10px;
          background-color: rgba(255, 255, 255, 0.05);
          padding: 10px 15px;
          border-radius: var(--border-radius-sm);
          border-left: 3px solid var(--secondary-color);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--bg-white);
        }

        .badge-icon {
          color: var(--secondary-color);
        }

        .footer-links-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .footer-links-list a {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.92rem;
          color: rgba(255, 255, 255, 0.75);
        }

        .footer-links-list a:hover {
          color: var(--secondary-color);
          transform: translateX(4px);
        }

        .footer-contact-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .footer-contact-list li {
          display: flex;
          gap: 12px;
          font-size: 0.92rem;
        }

        .contact-icon {
          color: var(--secondary-color);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .map-frame-wrapper {
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: var(--border-radius-sm);
          overflow: hidden;
        }

        .footer-bottom {
          background-color: rgba(0, 0, 0, 0.2);
          padding: 24px 0;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 0.88rem;
        }

        .bottom-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 15px;
        }

        @media (max-width: 992px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 576px) {
          .footer-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .bottom-content {
            flex-direction: column;
            text-align: center;
          }
        }
      `}</style>
    </footer>
  );
}
