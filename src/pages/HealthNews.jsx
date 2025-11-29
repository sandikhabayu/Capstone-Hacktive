import React from 'react';
import { newsAPI } from '../services/newsAPI';
import NewsPageTemplate from '../components/NewsPageTemplate/NewsPageTemplate';

const HealthNews = ({ stories = [], selectedTopic, loading }) => {
  return (
    <NewsPageTemplate
      pageTitle="Health News"
      fetchFunction={newsAPI.getHealthNews}
      placeholder="Search in health news..."
      stories={stories}
      selectedTopic={selectedTopic}
      loading={loading}
    />
  );
};

export default HealthNews;