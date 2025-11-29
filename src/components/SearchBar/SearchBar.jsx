import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, placeholder = "Search news..." }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="search-bar">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-container">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="search-input"
          />
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="clear-btn"
            >
              ✕
            </button>
          )}
        </div>
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchBar;