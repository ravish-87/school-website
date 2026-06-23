import React, { useState } from 'react';
import { Mail, Phone, MapPin, CheckCircle, Send, Clock } from 'lucide-react';
import { API_URL } from '../config';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    setErrorMsg(null);

    try {
      const response = await fetch(`${API_URL}/enquiries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit enquiry.');
      }

      setSuccessMsg(data.message);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="contact-page-container animate-fade-in">
      {/* Banner */}
      <div className="contact-banner-header" style={{ backgroundImage: `linear-gradient(rgba(13, 92, 52, 0.82), rgba(7, 59, 33, 0.9)), url(/sports.png)` }}>
        <div className="container banner-inner">
          <h1>Contact Us</h1>
          <p>Get in touch with our helpdesk, admissions team, or leadership office.</p>
        </div>
      </div>

      {/* Grid containing details and form */}
      <section className="section-padding container contact-main-grid">
        {/* Left column: Contact Info */}
        <div className="contact-info-column">
          <h2>Get in Touch</h2>
          <div className="divider-left"></div>
          <p className="contact-intro-text">
            For admissions inquiries, employment, or student verifications, please connect using the channels below or fill out the enquiry form.
          </p>

          <ul className="details-card-stack">
            <li className="info-item-card">
              <MapPin size={24} className="info-icon" />
              <div>
                <h4>Main Campus Address</h4>
                <p>xyz,pin-12345</p>
              </div>
            </li>
            <li className="info-item-card">
              <Phone size={24} className="info-icon" />
              <div>
                <h4>Admissions Desk Hotline</h4>
                <p>87095103, 111111222</p>
              </div>
            </li>
            <li className="info-item-card">
              <Mail size={24} className="info-icon" />
              <div>
                <h4>Electronic Correspondence</h4>
                <p>info@ravi.com, admissions@ravi.com</p>
              </div>
            </li>
            <li className="info-item-card">
              <Clock size={24} className="info-icon" />
              <div>
                <h4>Campus Office Timing</h4>
                <p>Monday to Saturday: 8:00 AM - 2:00 PM</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right column: Form */}
        <div className="contact-form-column premium-card">
          <h3>Submit an Enquiry</h3>
          <div className="divider-left"></div>
          
          {successMsg && (
            <div className="success-banner-alert">
              <CheckCircle size={22} className="alert-green-icon" />
              <div>
                <h4>Form Submitted!</h4>
                <p>{successMsg}</p>
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="error-banner-alert">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="enquiry-native-form">
            <div className="form-group">
              <label>Your Name <span className="req">*</span></label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="Enter full name" 
                className="form-control" 
                required 
              />
            </div>

            <div className="form-grid-2">
              <div className="form-group">
                <label>Email Address <span className="req">*</span></label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  placeholder="example@mail.com" 
                  className="form-control" 
                  required 
                />
              </div>
              <div className="form-group">
                <label>Phone Number <span className="req">*</span></label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="10-digit number" 
                  className="form-control" 
                  required 
                />
              </div>
            </div>

            <div className="form-group">
              <label>Subject <span className="req">*</span></label>
              <input 
                type="text" 
                name="subject" 
                value={formData.subject} 
                onChange={handleChange} 
                placeholder="Subject of enquiry" 
                className="form-control" 
                required 
              />
            </div>

            <div className="form-group">
              <label>Message / Detail Question <span className="req">*</span></label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={handleChange} 
                placeholder="Write your message here..." 
                className="form-control" 
                rows="4" 
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={isSubmitting}>
              <Send size={16} /> {isSubmitting ? 'Submitting...' : 'Submit Message'}
            </button>
          </form>
        </div>
      </section>

      {/* Google Map Full View */}
      <section className="map-view-full">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3615.1764377038173!2d86.6698943150062!3d25.028045983976295!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f13e778dfcb7d9%3A0xe104cf425ef4dfec!2sDelhi%20Public%20School%20Deoghar!5e0!3m2!1sen!2sin!4v1680000000000!5m2!1sen!2sin" 
          width="100%" 
          height="350" 
          style={{ border: 0, display: 'block' }} 
          allowFullScreen="" 
          loading="lazy" 
          title="ABC Public School Full Map"
        ></iframe>
      </section>

      <style>{`
        .contact-banner-header {
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

        .contact-main-grid {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 50px;
          align-items: start;
        }

        .contact-intro-text {
          color: var(--text-light);
          font-size: 1.05rem;
          margin-bottom: 30px;
        }

        .divider-left {
          width: 50px;
          height: 4px;
          background-color: var(--secondary-color);
          margin: 15px 0 25px 0;
          border-radius: 2px;
        }

        .details-card-stack {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .info-item-card {
          background-color: var(--bg-white);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 20px;
          display: flex;
          gap: 15px;
          box-shadow: var(--shadow-sm);
        }

        .info-icon {
          color: var(--primary-color);
          flex-shrink: 0;
          margin-top: 4px;
        }

        .info-item-card h4 {
          font-size: 1.05rem;
          margin-bottom: 4px;
          color: var(--primary-dark);
        }

        .info-item-card p {
          font-size: 0.9rem;
          color: var(--text-light);
        }

        /* Form Column */
        .contact-form-column {
          background-color: var(--bg-white);
        }

        .success-banner-alert {
          background-color: #e8f8f5;
          border: 1px solid #a9dfbf;
          border-radius: var(--border-radius-sm);
          padding: 15px 20px;
          margin-bottom: 25px;
          display: flex;
          gap: 12px;
          align-items: center;
        }

        .alert-green-icon {
          color: var(--success-color);
          flex-shrink: 0;
        }

        .success-banner-alert h4 {
          font-size: 1rem;
          color: var(--primary-dark);
          margin-bottom: 2px;
        }

        .success-banner-alert p {
          font-size: 0.88rem;
          color: var(--text-light);
        }

        .error-banner-alert {
          background-color: #fdf2e9;
          border: 1px solid #fadbd8;
          color: var(--danger-color);
          padding: 12px 16px;
          border-radius: var(--border-radius-sm);
          margin-bottom: 25px;
          font-weight: 600;
          font-size: 0.9rem;
        }

        .btn-block {
          width: 100%;
        }

        @media (max-width: 992px) {
          .contact-main-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
