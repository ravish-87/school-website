import React from 'react';
import { Award, ShieldCheck, Star, Heart } from 'lucide-react';

export default function About() {
  return (
    <div className="about-page-container animate-fade-in">
      {/* Banner */}
      <div className="about-banner-header" style={{ backgroundImage: `linear-gradient(rgba(26, 86, 219, 0.8), rgba(30, 58, 138, 0.9)), url(/campus.png)` }}>
        <div className="container banner-inner">
          <h1>About Our Institution</h1>
          <p>Excellence in education since inception. Serving Deoghar and the nation with pride.</p>
        </div>
      </div>

      {/* History and Philosophy */}
      <section className="section-padding container">
        <div className="about-intro-grid">
          <div className="intro-text">
            <span className="subtitle-tag">FOUNDATIONAL VALUE</span>
            <h2>Our Legacy & Vision</h2>
            <div className="divider-left"></div>
            <p>
              ABC Public School was established to provide world-class education within an atmosphere that inspires intellectual curiosity and personal growth. We blend modern pedagogy with traditional morals.
            </p>
            <p>
              Located in the scenic and culturally rich city of Deoghar, Jharkhand, our campus offers a serene, distraction-free environment ideal for scholarship. We prepare our pupils to face the challenges of a competitive global economy, while remaining deeply rooted in the cultural values of service and empathy.
            </p>
          </div>
          <div className="intro-badge-grid">
            <div className="value-box">
              <ShieldCheck className="v-icon" size={28} />
              <h4>Honesty & Ethics</h4>
              <p>Developing character with a strong foundation of moral codes.</p>
            </div>
            <div className="value-box">
              <Award className="v-icon" size={28} />
              <h4>Academic Rigor</h4>
              <p>Striving for excellent board outcomes and competitive examination preparation.</p>
            </div>
            <div className="value-box">
              <Star className="v-icon" size={28} />
              <h4>Innovation Focus</h4>
              <p>Integrating artificial intelligence, coding, and design thinking.</p>
            </div>
            <div className="value-box">
              <Heart className="v-icon" size={28} />
              <h4>Holistic Growth</h4>
              <p>Equal emphasis on sports, swimming, creative arts, and leadership.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Messages */}
      <section className="leadership-section section-padding">
        <div className="container">
          <div className="section-header">
            <h2>Messages from the Leadership</h2>
            <p>The visionaries guiding our institution towards new horizons.</p>
          </div>

          <div className="messages-stack">
            {/* PVC Message */}
            <div className="message-card-full">
              <div className="speaker-profile">
                <div className="avatar-mock">RC</div>
                <h3>Dr. Ram</h3>
                <p className="speaker-designation">Pro-Vice Chairman, ABC Public School</p>
              </div>
              <div className="message-body">
                <span className="quote-mark">“</span>
                <p>
                  Education is not just about loading the mind with facts. It is about igniting a passion for learning that lasts a lifetime. At ABC Public School, we strive to build a community of self-directed learners who look at the world with curiosity and compassion. Our state-of-the-art labs, sports academies, and stellar teachers ensure that every child finds their voice and reaches their maximum potential. I welcome you to partner with us in this beautiful journey of raising the leaders of tomorrow.
                </p>
              </div>
            </div>

            {/* Principal Message */}
            <div className="message-card-full reverse">
              <div className="speaker-profile">
                <div className="avatar-mock bg-gold">SM</div>
                <h3>Mrs. Sobha</h3>
                <p className="speaker-designation">Principal, ABC Public School</p>
              </div>
              <div className="message-body">
                <span className="quote-mark">“</span>
                <p>
                  As the Principal of ABC Public School, it is my absolute privilege to lead an institution that is synonymous with academic distinction and all-round development. Our teaching methodology is highly interactive and child-centric, focusing on building conceptual clarity and analytical skills. We encourage students to participate actively in sports, innovation challenges, and literary clubs. Together with a highly motivated team of teachers and supportive parents, we create a ecosystem where excellence is a habit.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Vision and Mission Statement */}
      <section className="section-padding container vision-mission-grid">
        <div className="vision-card glass-panel">
          <h3>Our Vision</h3>
          <p>
            To be a globally recognized center of educational excellence, nurturing creative and critical thinkers who are morally upright, socially responsible, and equipped to contribute actively to a dynamic global society.
          </p>
        </div>
        <div className="mission-card glass-panel">
          <h3>Our Mission</h3>
          <p>
            To provide a safe, nurturing, and stimulating environment that fosters intellectual excellence, physical fitness, aesthetic appreciation, and strong moral values, empowering every student to become a compassionate lifelong learner.
          </p>
        </div>
      </section>

      <style>{`
        .about-banner-header {
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

        /* Intro Section */
        .about-intro-grid {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 50px;
          align-items: center;
        }

        .subtitle-tag {
          color: var(--secondary-dark);
          font-weight: 700;
          font-size: 0.85rem;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .intro-text h2 {
          font-size: 2.2rem;
          margin-top: 5px;
        }

        .intro-text p {
          color: var(--text-light);
          margin-bottom: 20px;
          font-size: 1.05rem;
        }

        .intro-badge-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }

        .value-box {
          background-color: var(--bg-white);
          border: 1px solid var(--border-color);
          border-radius: var(--border-radius-md);
          padding: 24px;
          box-shadow: var(--shadow-sm);
          transition: var(--transition-fast);
        }

        .value-box:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-md);
          border-color: var(--primary-light);
        }

        .v-icon {
          color: var(--primary-color);
          margin-bottom: 12px;
        }

        .value-box h4 {
          margin-bottom: 8px;
          font-size: 1.05rem;
        }

        .value-box p {
          font-size: 0.85rem;
          color: var(--text-light);
          line-height: 1.4;
        }

        /* Leadership Messages */
        .leadership-section {
          background-color: #f2f5f3;
        }

        .messages-stack {
          display: flex;
          flex-direction: column;
          gap: 40px;
          margin-top: 40px;
        }

        .message-card-full {
          background-color: var(--bg-white);
          border-radius: var(--border-radius-md);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          padding: 40px;
          display: flex;
          gap: 40px;
          align-items: center;
        }

        .message-card-full.reverse {
          flex-direction: row-reverse;
        }

        .speaker-profile {
          width: 250px;
          flex-shrink: 0;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .avatar-mock {
          width: 100px;
          height: 100px;
          background-color: var(--primary-dark);
          color: var(--bg-white);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 800;
          margin-bottom: 15px;
          border: 4px solid var(--secondary-color);
        }

        .avatar-mock.bg-gold {
          background-color: var(--secondary-dark);
          border-color: var(--primary-color);
        }

        .speaker-profile h3 {
          font-size: 1.2rem;
          margin-bottom: 5px;
        }

        .speaker-designation {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-light);
        }

        .message-body {
          position: relative;
          padding-left: 20px;
        }

        .quote-mark {
          position: absolute;
          top: -25px;
          left: -15px;
          font-size: 5rem;
          color: rgba(26, 86, 219, 0.1);
          line-height: 1;
          font-family: serif;
        }

        .message-body p {
          font-size: 1.05rem;
          line-height: 1.7;
          color: var(--text-dark);
          font-style: italic;
        }

        /* Vision Mission Grid */
        .vision-mission-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 30px;
        }

        .vision-card, .mission-card {
          padding: 40px;
          border-radius: var(--border-radius-lg);
          border-left: 5px solid var(--primary-color);
          box-shadow: var(--shadow-sm);
          background-color: var(--bg-white);
        }

        .mission-card {
          border-left-color: var(--secondary-color);
        }

        .vision-card h3, .mission-card h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
        }

        .vision-card p, .mission-card p {
          color: var(--text-light);
          font-size: 1.05rem;
        }

        @media (max-width: 992px) {
          .about-intro-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }
          .message-card-full, .message-card-full.reverse {
            flex-direction: column;
            padding: 30px;
            text-align: center;
          }
          .speaker-profile {
            width: 100%;
          }
          .vision-mission-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
