import React from 'react';
import { newsAPI } from '../services/newsAPI';
import NewsPageTemplate from '../components/NewsPageTemplate/NewsPageTemplate';

const AllNews = ({ stories = [], selectedTopic, loading }) => {
  const fetchAllNews = async () => {
    try {
      console.log('🔄 Fetching all news data...');
      
      // Coba Top Stories dulu - dapatkan lebih banyak data
      let newsData = await newsAPI.getTopStories('home');
      
      // Jika Top Stories gagal atau sedikit, coba Most Popular
      if (!newsData || newsData.length < 10) {
        console.log('Top stories insufficient, trying most popular...');
        const popularData = await newsAPI.getMostPopular(7); // 7 days
        if (popularData && popularData.length > 0) {
          // Gabungkan data jika perlu
          newsData = newsData ? [...newsData, ...popularData] : popularData;
        }
      }
      
      // Hapus duplikat berdasarkan URL
      if (newsData && newsData.length > 0) {
        const uniqueArticles = [];
        const urlSet = new Set();
        
        newsData.forEach(article => {
          const url = article.url || article.web_url;
          if (url && !urlSet.has(url)) {
            urlSet.add(url);
            uniqueArticles.push(article);
          }
        });
        
        console.log(`✅ Loaded ${uniqueArticles.length} unique articles`);
        return uniqueArticles;
      }
      
      return newsData || [];
      
    } catch (error) {
      console.error('Error fetching all news:', error);
      throw error;
    }
  };

  return (
    <NewsPageTemplate
      pageTitle="All News"
      fetchFunction={fetchAllNews}
      placeholder="Search in all news..."
      stories={stories}
      selectedTopic={selectedTopic}
      loading={loading}
    />
  );
};

export default AllNews;