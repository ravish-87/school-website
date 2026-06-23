import React, { useState, useEffect } from 'react';
import { Image, Layers } from 'lucide-react';
import { API_URL } from '../config';

export default function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');

  const defaultPhotos = [
    { id: 101, title: 'School Entrance & Main Block', category: 'Campus', image_path: '/campus.png' },
    { id: 102, title: 'Student Robotics Training', category: 'Lab', image_path: '/robotics.png' },
    { id: 103, title: 'Annual Football Championship', category: 'Sports', image_path: '/sports.png' },
    { id: 104, title: 'Central Library & Reading Area', category: 'Campus', image_path: '/campus.png' },
    { id: 105, title: 'Coding Competition Winners', category: 'Event', image_path: '/robotics.png' },
    { id: 106, title: 'Sports Practice Session', category: 'Sports', image_path: '/sports.png' }
  ];

  useEffect(() => {
    fetch(`${API_URL}/gallery`)
      .then(res => res.json())
      .then(data => {
        if (data && data.length > 0) {
          setPhotos(data);
        } else {
          setPhotos(defaultPhotos);
        }
      })
      .catch(err => {
        console.error('Failed to fetch gallery images:', err);
        setPhotos(defaultPhotos);
      });
  }, []);

  const filteredPhotos = photos.filter(photo => activeFilter === 'All' || photo.category === activeFilter);

  return (
    <div className="gallery-page-container animate-fade-in">
      {/* Banner */}
      <div className="gallery-banner-header" style={{ backgroundImage: `linear-gradient(rgba(13, 92, 52, 0.82), rgba(7, 59, 33, 0.9)), url(/campus.png)` }}>
        <div className="container banner-inner">
          <h1>Campus Media Gallery</h1>
          <p>Peek into the everyday life, infrastructure, and events at ABC Public School.</p>
        </div>
      </div>

      {/* Gallery Filter Tab */}
      <section className="section-padding container">
        <div className="gallery-filter-bar">
          {['All', 'Campus', 'Lab', 'Sports', 'Event'].map(filter => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`filter-btn ${activeFilter === filter ? 'active' : ''}`}>
              {filter}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="photos-grid-layout">
          {filteredPhotos.map(photo => {
            const imgSrc = photo.image_path.startsWith('/uploads/') ? `http://localhost:5000${photo.image_path}` : photo.image_path;
            return (
              <div key={photo.id} className="photo-gallery-card">
                <div className="img-container">
                  <img src={imgSrc} alt={photo.title} />
                  <span className="category-tag-over">{photo.category}</span>
                </div>
                <div className="photo-details">
                  <h4>{photo.title}</h4>
                </div>
              </div>
            );
          })}
        </div>

        {filteredPhotos.length === 0 && (
          <div className="no-photos-panel">
            <Image size={48} className="no-photo-icon" />
            <p>No photos available in this category yet.</p>
          </div>
        )}
      </section>

      <style>{`
        .gallery-banner-header {
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

        .gallery-filter-bar {
          display: flex;
          justify-content: center;
          gap: 15px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .gallery-filter-bar .filter-btn {
          background-color: var(--bg-white);
          border: 1px solid var(--border-color);
          color: var(--text-light);
          padding: 10px 24px;
          border-radius: 50px;
          font-weight: 600;
          cursor: pointer;
          transition: var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }

        .gallery-filter-bar .filter-btn:hover,
        .gallery-filter-bar .filter-btn.active {
          background-color: var(--primary-color);
          color: var(--bg-white);
          border-color: var(--primary-color);
          transform: translateY(-2px);
        }

        /* Photos Grid */
        .photos-grid-layout {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 30px;
        }

        .photo-gallery-card {
          background-color: var(--bg-white);
          border-radius: var(--border-radius-md);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--border-color);
          transition: var(--transition-normal);
        }

        .photo-gallery-card:hover {
          transform: translateY(-6px);
          box-shadow: var(--shadow-md);
        }

        .img-container {
          position: relative;
          height: 250px;
          overflow: hidden;
          background-color: #eee;
        }

        .img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: var(--transition-normal);
        }

        .photo-gallery-card:hover .img-container img {
          transform: scale(1.08);
        }

        .category-tag-over {
          position: absolute;
          top: 15px;
          left: 15px;
          background-color: var(--secondary-color);
          color: var(--primary-dark);
          font-size: 0.75rem;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 4px;
          box-shadow: var(--shadow-sm);
          text-transform: uppercase;
        }

        .photo-details {
          padding: 20px;
        }

        .photo-details h4 {
          font-size: 1.05rem;
          color: var(--primary-dark);
          font-weight: 600;
        }

        .no-photos-panel {
          padding: 80px 0;
          text-align: center;
          color: var(--text-light);
        }

        .no-photo-icon {
          color: var(--border-color);
          margin-bottom: 15px;
        }

        @media (max-width: 992px) {
          .photos-grid-layout {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 576px) {
          .photos-grid-layout {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
