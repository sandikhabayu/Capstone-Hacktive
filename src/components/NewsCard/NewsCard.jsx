import React, { useState, useEffect } from 'react';
import './NewsCard.css';

const NewsCard = ({ article, onSave, onRemove, isSaved }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const url = resolveImageUrl(article);
    setImageUrl(url);
  }, [article]);

  // ============================================
  //  FUNGSI INTI: FIX GAMBAR SEMUA API NYTIMES
  // ============================================
  const resolveImageUrl = (article) => {

    // -----------------------------
    // CASE 1: Article Search API
    // -----------------------------
    if (article.multimedia && Array.isArray(article.multimedia) && article.multimedia.length > 0) {
      const priority = [
        "superJumbo", "jumbo", "xlarge", "wide",
        "blog480", "blog533", "popup", "thumbnail"
      ];

      for (let type of priority) {
        const match = article.multimedia.find(m => m.subtype === type);
        if (match && match.url) {
          return fixRelativeUrl(match.url);
        }
      }

      // fallback → ambil pertama
      if (article.multimedia[0].url) {
        return fixRelativeUrl(article.multimedia[0].url);
      }
    }

    // -----------------------------
    // CASE 2: Top Stories API
    // -----------------------------
    if (article.multimedia && article.multimedia[0]?.url) {
      return article.multimedia[0].url; // sudah absolute
    }

    // -----------------------------
    // CASE 3: Most Popular API
    // -----------------------------
    if (article.media?.[0]?.["media-metadata"]) {
      const metadata = article.media[0]["media-metadata"];
      const best = metadata[metadata.length - 1];
      return best?.url || null;
    }

    // -----------------------------
    // Tanpa gambar → biarkan null (akan diganti placeholder)
    // -----------------------------
    return null;
  };

  // FIX URL RELATIVE dari Article Search API
  const fixRelativeUrl = (url) => {
    if (!url.startsWith("http")) {
      return "https://www.nytimes.com/" + url;
    }
    return url;
  };

  // ============================================
  //  PLACEHOLDER IMAGE
  // ============================================
  const generatePlaceholder = () => {
    return `https://picsum.photos/500/300?random=${Math.random()}`;
  };

  const getTitle = () => {
    return (
      article.headline?.main ||
      article.title ||
      article.snippet ||
      "News Article"
    );
  };

  const getAbstract = () => {
    return (
      article.abstract ||
      article.snippet ||
      "Click 'Read More' to view the full article."
    );
  };

  const getArticleUrl = () => {
    return article.web_url || article.url || "#";
  };

  const getSource = () => {
    return (
      article.source ||
      article.section_name ||
      article.section ||
      "The New York Times"
    );
  };

  const getDate = () => {
    const date =
      article.pub_date ||
      article.published_date ||
      article.created_date;

    return date ? new Date(date).toLocaleDateString() : "Unknown date";
  };

  // url final
  const finalImage = imageUrl || generatePlaceholder();

  return (
    <div className="news-card">
      <div className="news-image-container">
        <img
          src={finalImage}
          alt={getTitle()}
          className="news-image"
          onError={(e) => (e.target.src = generatePlaceholder())}
        />
      </div>

      <div className="news-content">
        <h3 className="news-title">{getTitle()}</h3>
        <p className="news-abstract">{getAbstract()}</p>

        <div className="news-meta">
          <span className="news-source">{getSource()}</span>
          <span className="news-date">{getDate()}</span>
        </div>

        <div className="news-actions">
          <a
            href={getArticleUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="read-more"
          >
            Read on NYTimes
          </a>

          {isSaved ? (
            <button onClick={() => onRemove(article)} className="remove-btn">
              Remove
            </button>
          ) : (
            <button onClick={() => onSave(article)} className="save-btn">
              Save
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
