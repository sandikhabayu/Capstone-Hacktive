import React from 'react';
import { newsAPI } from '../services/newsAPI';
import NewsPageTemplate from '../components/NewsPageTemplate/NewsPageTemplate';

const TechnologyNews = ({ stories = [], selectedTopic, loading }) => {
  return (
    <NewsPageTemplate
      pageTitle="Technology News"
      fetchFunction={newsAPI.getTechnologyNews}
      placeholder="Search in technology news..."
      stories={stories}
      selectedTopic={selectedTopic}
      loading={loading}
    />
  );
};

export default TechnologyNews;