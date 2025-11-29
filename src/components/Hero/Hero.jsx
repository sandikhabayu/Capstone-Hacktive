import React, { useState, useEffect } from 'react';
import './Hero.css';

const Hero = ({ articles = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  console.log('🎯 Hero Component - Total Articles:', articles.length);
  console.log('🎯 Current Article:', articles[currentSlide]);

  // Auto slide setiap 5 detik
  useEffect(() => {
    if (articles.length > 1) {
      const interval = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % articles.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [articles.length]);

  if (!articles || articles.length === 0) {
    return (
      <div className="hero-section hero-placeholder">
        <div className="hero-overlay">
          <h2>Newsip</h2>
          <span className="hero-label">Tidak Ada Berita</span>
          <h1>Belum ada berita tersedia</h1>
        </div>
      </div>
    );
  }

  const currentArticle = articles[currentSlide];

  const getImageUrl = (article) => {
    // Langsung gunakan imageUrl dari debug yang sudah berhasil
    if (article.multimedia && article.multimedia.length > 0) {
      const image = article.multimedia.find(img => 
        img.format === 'superJumbo' || img.format === 'threeByTwoSmallAt2X'
      );
      if (image) {
        return image.url.startsWith('http') ? image.url : `https://www.nytimes.com/${image.url}`;
      }
      // Fallback ke gambar pertama
      return article.multimedia[0].url.startsWith('http') 
        ? article.multimedia[0].url 
        : `https://www.nytimes.com/${article.multimedia[0].url}`;
    }
    
    // Fallback
    return `https://picsum.photos/1200/600?random=${Math.random()}`;
  };

  const bgImage = getImageUrl(currentArticle);
  console.log('🎯 Background Image URL:', bgImage);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % articles.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + articles.length) % articles.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="hero-section">
      {/* Debug kecil di komponen */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '30px',
        color: 'white',
        padding: '5px 10px',
        fontSize: '12px',
        zIndex: 1000
      }}>
        <h1 style={{fontSize: '25px'}}>Newsip</h1>
      </div>

      {/* Slide utama */}
      <div 
        className="hero-slide active"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="hero-content">
          <div className="hero-overlay">
            <span className="hero-label">Top Stories</span>
            <h1 className="hero-title">
              {currentArticle.title || currentArticle.headline?.main || 'Judul Tidak Tersedia'}
            </h1>
            <p className="hero-abstract">
              {currentArticle.abstract || currentArticle.snippet || ''}
            </p>
            <a 
              href={currentArticle.url || currentArticle.web_url || '#'} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hero-read-btn"
            >
              Read →
            </a>
          </div>
        </div>
      </div>

      {/* Navigation arrows - hanya tampil jika lebih dari 1 slide */}
      {articles.length > 1 && (
        <>
          <button className="hero-nav hero-prev" onClick={prevSlide} aria-label="Previous slide">
            ‹
          </button>
          <button className="hero-nav hero-next" onClick={nextSlide} aria-label="Next slide">
            ›
          </button>
        </>
      )}

      {/* Slide indicators */}
      {articles.length > 1 && (
        <div className="hero-indicators">
          {articles.map((_, index) => (
            <button
              key={index}
              className={`hero-indicator ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Hero;