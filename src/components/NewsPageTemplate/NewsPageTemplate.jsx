import React, { useState, useEffect } from 'react';
import NewsCard from '../NewsCard/NewsCard';
import SearchBar from '../SearchBar/SearchBar';
import './NewsPageTemplate.css';

const NewsPageTemplate = ({ 
  pageTitle, 
  fetchFunction, 
  placeholder = "Search news...",
  stories = [],
  selectedTopic,
  loading: propLoading 
}) => {
  const [localArticles, setLocalArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [displayedArticles, setDisplayedArticles] = useState([]); // NEW
  const [localLoading, setLocalLoading] = useState(true);
  const [savedArticles, setSavedArticles] = useState([]);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [articlesToShow, setArticlesToShow] = useState(12); // NEW: initial count

  const loading = propLoading !== undefined ? propLoading : localLoading;
  const displayStories = stories && stories.length > 0 ? stories : localArticles;

  useEffect(() => {
    if (!fetchFunction) return;
    
    if (!stories || stories.length === 0) {
      fetchNews();
    } else {
      setLocalLoading(false);
    }
    loadSavedArticles();
  }, [fetchFunction, stories]);

  useEffect(() => {
    filterArticles();
  }, [searchQuery, displayStories, selectedTopic]);

  useEffect(() => {
    // Update displayed articles ketika filteredArticles atau articlesToShow berubah
    const articlesToDisplay = searchQuery ? filteredArticles : displayStories;
    setDisplayedArticles(articlesToDisplay.slice(0, articlesToShow));
  }, [filteredArticles, displayStories, articlesToShow, searchQuery]);

  const fetchNews = async () => {
    if (!fetchFunction) return;
    
    try {
      setLocalLoading(true);
      setError('');
      const newsData = await fetchFunction();
      setLocalArticles(newsData || []);
    } catch (error) {
      console.error(`Error fetching ${pageTitle}:`, error);
      setError(`Failed to load ${pageTitle}. Please try again later.`);
    } finally {
      setLocalLoading(false);
    }
  };

  const filterArticles = () => {
    let results = displayStories;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      results = displayStories.filter(article => {
        const title = getTitle(article).toLowerCase();
        const abstract = getAbstract(article).toLowerCase();
        const source = getSource(article).toLowerCase();
        
        return title.includes(query) || 
               abstract.includes(query) || 
               source.includes(query);
      });
    }

    setFilteredArticles(results);
    setArticlesToShow(12); // Reset ke initial count ketika filter berubah
  };

  // NEW: Load more function
  const loadMoreArticles = () => {
    setArticlesToShow(prev => prev + 12);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Helper functions (tetap sama)
  const getTitle = (article) => {
    return article.headline?.main || article.title || 'No Title Available';
  };

  const getAbstract = (article) => {
    return article.abstract || article.snippet || 'No description available';
  };

  const getSource = (article) => {
    return article.source || article.section_name || 'The New York Times';
  };

  const loadSavedArticles = () => {
    const saved = JSON.parse(localStorage.getItem('savedArticles')) || [];
    setSavedArticles(saved);
  };

  const saveArticle = (article) => {
    const saved = [...savedArticles, article];
    setSavedArticles(saved);
    localStorage.setItem('savedArticles', JSON.stringify(saved));
    alert('Article saved!');
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

  const isArticleSaved = (article) => {
    return savedArticles.some(saved => {
      const url1 = saved.web_url || saved.url;
      const url2 = article.web_url || article.url;
      return url1 === url2;
    });
  };

  const totalArticles = searchQuery ? filteredArticles : displayStories;
  const hasMoreArticles = displayedArticles.length < totalArticles.length;

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading {pageTitle}...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Error</h2>
        <p>{error}</p>
        <button onClick={fetchNews} className="retry-btn">
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="news-page">
      <div className="news-header">
        <h1>
          {pageTitle}
          {selectedTopic && (
            <span className="topic-keywords-badge">
              {selectedTopic.keywords?.slice(0, 2).join(', ')}
              {selectedTopic.keywords?.length > 2 && '...'}
            </span>
          )}
        </h1>
        <SearchBar 
          onSearch={handleSearch} 
          placeholder={placeholder}
        />
      </div>

      {/* Filter Info */}
      <div className="filter-info">
        {selectedTopic && !searchQuery && (
          <div className="topic-filter-info">
            <div className="filter-details">
              <strong>Filter:</strong> {selectedTopic.name}
              <span className="results-count">
                Showing {displayedArticles.length} of {totalArticles.length} articles
              </span>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="clear-filter-btn"
            >
              Clear Filter
            </button>
          </div>
        )}

        {searchQuery && (
          <div className="search-info">
            <span style={{color: 'black'}}>
              Showing {displayedArticles.length} of {totalArticles.length} results for "<strong>{searchQuery}</strong>"
            </span>
            <button 
              onClick={() => setSearchQuery('')}
              className="clear-search-btn"
            >
              Clear Search
            </button>
          </div>
        )}

        {selectedTopic && searchQuery && (
          <div className="combined-filter-info">
            <span style={{color: 'black'}}>
              Showing {displayedArticles.length} of {totalArticles.length} results for "<strong>{searchQuery}</strong>" in {selectedTopic.name}
            </span>
            <div>
              <button 
                onClick={() => setSearchQuery('')}
                className="clear-search-btn"
              >
                Clear Search
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="clear-filter-btn"
              >
                Clear Topic
              </button>
            </div>
          </div>
        )}

        {!selectedTopic && !searchQuery && (
          <div className="results-info">
            <span>Showing {displayedArticles.length} of {totalArticles.length} articles</span>
          </div>
        )}
      </div>

      {/* News Grid */}
      <div className="news-grid">
        {displayedArticles.length > 0 ? (
          <>
            {displayedArticles.map((article, index) => (
              <NewsCard
                key={`${article.url || article.web_url || index}`}
                article={article}
                onSave={saveArticle}
                onRemove={removeArticle}
                isSaved={isArticleSaved(article)}
                featured={index === 0 && !selectedTopic && !searchQuery}
              />
            ))}
          </>
        ) : (
          <div className="no-articles">
            <h3>📰 No articles found</h3>
            <p>
              {selectedTopic && searchQuery 
                ? `No articles found for "${searchQuery}" in ${selectedTopic.name}`
                : selectedTopic 
                ? `No articles found for ${selectedTopic.name}`
                : searchQuery 
                ? `No articles found for "${searchQuery}"`
                : `No ${pageTitle.toLowerCase()} available at the moment.`
              }
            </p>
            {(selectedTopic || searchQuery) && (
              <button 
                onClick={() => window.location.reload()}
                className="retry-btn"
              >
                Show All {pageTitle}
              </button>
            )}
            {!selectedTopic && !searchQuery && (
              <button 
                onClick={fetchNews}
                className="retry-btn"
              >
                Try Again
              </button>
            )}
          </div>
        )}
      </div>

      {/* Load More Button */}
      {hasMoreArticles && displayedArticles.length > 0 && (
        <div className="load-more-container">
          <button 
            onClick={loadMoreArticles}
            className="load-more-btn"
          >
            Load More Articles ({totalArticles.length - displayedArticles.length} remaining)
          </button>
        </div>
      )}
    </div>
  );
};

export default NewsPageTemplate;