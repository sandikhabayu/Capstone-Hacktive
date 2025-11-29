import React from 'react';
import { newsAPI } from '../services/newsAPI';
import NewsPageTemplate from '../components/NewsPageTemplate/NewsPageTemplate';

const IndonesiaNews = ({ stories = [], selectedTopic, loading }) => {
  return (
    <NewsPageTemplate
      pageTitle="Indonesia News"
      fetchFunction={newsAPI.getIndonesiaNews}
      placeholder="Search in Indonesia news..."
      stories={stories}
      selectedTopic={selectedTopic}
      loading={loading}
    />
  );
};

export default IndonesiaNews;