import React, { useState } from 'react';
import './TrendingSidebar.css';

const TrendingSidebar = ({ onTopicSelect }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  // Kata kunci yang lebih spesifik dan umum di berita
  const topics = [
    { name: "Health", keywords: ["health", "medical", "hospital", "doctor", "medicine"] },
    { name: "Natural Disaster", keywords: ["earthquake", "flood", "hurricane", "tsunami", "disaster"] },
    { name: "Politics", keywords: ["politics", "election", "government", "senate", "congress"] },
    { name: "Donald Trump", keywords: ["trump", "donald trump"] },
    { name: "Business", keywords: ["business", "economy", "market", "stock", "finance"] },
    { name: "Technology", keywords: ["technology", "tech", "ai", "artificial intelligence", "innovation"] },
    { name: "Climate", keywords: ["climate", "environment", "global warming", "sustainability"] },
    { name: "Sports", keywords: ["sports", "basketball", "football", "soccer", "olympics"] },
    { name: "Entertainment", keywords: ["entertainment", "movie", "film", "celebrity", "hollywood"] },
    { name: "Science", keywords: ["science", "research", "discovery", "space", "nasa"] }
  ];

  const handleTopicClick = (topic) => {
    setSelectedTopic(topic);
    
    // Kirim seluruh data topic (nama dan keywords) ke parent
    if (onTopicSelect) {
      onTopicSelect(topic);
    }
    
    console.log('🎯 Topic selected:', topic);
  };

  const handleClearFilter = () => {
    setSelectedTopic(null);
    
    if (onTopicSelect) {
      onTopicSelect(null);
    }
    
    console.log('🎯 Filter cleared');
  };

  return (
    <div className="trending-sidebar">
      <div className="sidebar-header">
        <h3>🔥 Trending Topics</h3>
        {selectedTopic && (
          <button 
            className="clear-filter-btn"
            onClick={handleClearFilter}
            title="Clear filter"
          >
            ✕
          </button>
        )}
      </div>
      
      {selectedTopic && (
        <div className="selected-topic-info">
          <span>Showing:</span>
          <strong>"{selectedTopic.name}"</strong>
          <div className="topic-keywords">
            Keywords: {selectedTopic.keywords.join(', ')}
          </div>
        </div>
      )}
      
      <div className="tags-container">
        {topics.map((topic, index) => (
          <button 
            key={index} 
            className={`tag-btn ${selectedTopic?.name === topic.name ? 'active' : ''}`}
            onClick={() => handleTopicClick(topic)}
            title={`Keywords: ${topic.keywords.join(', ')}`}
          >
            {topic.name}
            {selectedTopic?.name === topic.name && <span className="check-mark">✓</span>}
          </button>
        ))}
      </div>
      
      <div className="sidebar-footer">
        <p>Click any topic to filter news by title and description</p>
      </div>
    </div>
  );
};

export default TrendingSidebar;