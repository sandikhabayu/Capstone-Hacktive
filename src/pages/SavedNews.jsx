import React, { useState, useEffect } from 'react';
import NewsCard from '../components/NewsCard/NewsCard';
import SearchBar from '../components/SearchBar/SearchBar';
import './NewsPage.css';

const SavedNews = () => {
  const [savedArticles, setSavedArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadSavedArticles();
  }, []);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, savedArticles]);

  const loadSavedArticles = () => {
    const saved = JSON.parse(localStorage.getItem('savedArticles')) || [];
    setSavedArticles(saved);
  };

  const filterArticles = () => {
    if (!searchQuery.trim()) {
      setFilteredArticles(savedArticles);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = savedArticles.filter(article => {
      const title = getTitle(article).toLowerCase();
      const abstract = getAbstract(article).toLowerCase();
      
      return title.includes(query) || abstract.includes(query);
    });
    
    setFilteredArticles(filtered);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const getTitle = (article) => {
    return article.headline?.main || article.title || 'No Title Available';
  };

  const getAbstract = (article) => {
    return article.abstract || article.snippet || 'No description available';
  };

  const removeArticle = (articleToRemove) => {
    const saved = savedArticles.filter(article => {
      const url1 = article.web_url || article.url;
      const url2 = articleToRemove.web_url || articleToRemove.url;
      return url1 !== url2;
    });
    setSavedArticles(saved);
    localStorage.setItem('savedArticles', JSON.stringify(saved));
    alert('Article removed!');
  };

  const displayArticles = searchQuery ? filteredArticles : savedArticles;

  return (
    <div className="news-page">
      <div className="news-header">
        <h1>Saved Articles</h1>
        <SearchBar 
          onSearch={handleSearch}
          placeholder="Search in saved articles..."
        />
      </div>

      {searchQuery && (
        <div className="search-info">
          <p>
            {filteredArticles.length} saved articles found for "{searchQuery}"
            <button 
              onClick={() => setSearchQuery('')}
              className="clear-search-btn"
            >
              Clear search
            </button>
          </p>
        </div>
      )}

      <div className="news-grid">
        {displayArticles.length > 0 ? (
          displayArticles.map((article, index) => (
            <NewsCard
              key={index}
              article={article}
              onRemove={removeArticle}
              isSaved={true}
              showSaveButton={false}
            />
          ))
        ) : (
          <div className="no-articles">
            {searchQuery ? (
              <p>No saved articles found for "{searchQuery}"</p>
            ) : (
              <div className="empty-saved">
                <h3>📚 No saved articles yet</h3>
                <p>Save articles from other sections to see them here!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedNews;