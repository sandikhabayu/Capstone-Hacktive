import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { newsAPI } from './services/newsAPI';
import './App.css';
import Navbar from './components/Navbar/Navbar';
import CategoryTabs from './components/CategoryTabs/CategoryTabs';
import Hero from './components/Hero/Hero';
import TrendingSidebar from './components/Sidebar/TrendingSidebar';
import AllNews from './pages/AllNews';
import IndonesiaNews from './pages/IndonesiaNews';
import TechnologyNews from './pages/TechnologyNews';
import HealthNews from './pages/HealthNews';
import SavedNews from './pages/SavedNews';
import Footer from './components/Footer/Footer';

function App() {
  const [topStories, setTopStories] = useState([]);
  const [allStories, setAllStories] = useState([]); // NEW: untuk All News
  const [filteredStories, setFilteredStories] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data untuk Hero dan All News
  useEffect(() => {
    const fetchNewsData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching news data...');
        
        // Fetch semua berita (untuk All News)
        const allNewsData = await newsAPI.getTopStories('home');
        console.log('All stories fetched:', allNewsData?.length);
        
        if (allNewsData && allNewsData.length > 0) {
          setAllStories(allNewsData);
          setFilteredStories(allNewsData);
          
          // Ambil 5 berita pertama dengan gambar untuk Hero
          const heroStories = allNewsData
            .filter(story => 
              story.multimedia?.[0]?.url || story.media?.[0]?.['media-metadata']
            )
            .slice(0, 5);
          
          setTopStories(heroStories);
          console.log('Hero stories:', heroStories.length);
        } else {
          // Fallback ke Most Popular
          const popularNews = await newsAPI.getMostPopular(1);
          setAllStories(popularNews || []);
          setFilteredStories(popularNews || []);
          
          const heroStories = (popularNews || [])
            .filter(story => 
              story.multimedia?.[0]?.url || story.media?.[0]?.['media-metadata']
            )
            .slice(0, 5);
          
          setTopStories(heroStories);
        }
        
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Gagal memuat berita. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  // Handle topic selection dari sidebar
  const handleTopicSelect = async (topic) => {
    setSelectedTopic(topic);
    
    if (!topic) {
      // Clear filter - show all stories
      setFilteredStories(allStories);
      return;
    }

    try {
      console.log(`🔍 Filtering news for: ${topic.name}`, topic.keywords);
      
      // Filter dari allStories berdasarkan keywords
      const filteredFromExisting = allStories.filter(story => {
        const title = (story.title || story.headline?.main || '').toLowerCase();
        const abstract = (story.abstract || story.snippet || '').toLowerCase();
        const section = (story.section || story.section_name || '').toLowerCase();
        
        // Cek apakah ada keyword yang match
        return topic.keywords.some(keyword => 
          title.includes(keyword.toLowerCase()) ||
          abstract.includes(keyword.toLowerCase()) ||
          section.includes(keyword.toLowerCase())
        );
      });

      console.log(`📊 Found ${filteredFromExisting.length} articles`);

      // Jika hasil sedikit, cari via API Search
      let finalResults = filteredFromExisting;
      
      if (filteredFromExisting.length < 5) {
        console.log(`🔍 Searching API for more "${topic.name}" news...`);
        
        try {
          const searchResults = await newsAPI.searchNews(topic.keywords[0]);
          const validSearchResults = (searchResults || [])
            .filter(article => 
              article && (article.title || article.headline?.main)
            )
            .slice(0, 10);
          
          // Gabungkan hasil, hindari duplikat
          const combinedResults = [...filteredFromExisting];
          const existingUrls = new Set(filteredFromExisting.map(article => 
            article.url || article.web_url
          ));
          
          searchResults.forEach(article => {
            const url = article.url || article.web_url;
            if (!existingUrls.has(url)) {
              combinedResults.push(article);
              existingUrls.add(url);
            }
          });
          
          finalResults = combinedResults;
          console.log(`📊 Combined results: ${finalResults.length} articles`);
          
        } catch (searchError) {
          console.warn('API search failed, using existing results:', searchError);
        }
      }

      setFilteredStories(finalResults);
      
    } catch (error) {
      console.error(`Error filtering for ${topic.name}:`, error);
      setFilteredStories(allStories);
    }
  };

  if (loading && topStories.length === 0) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Memuat berita terbaru...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>⚠️ Terjadi Kesalahan</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <div className="container">
          <div className='page-content'>
            {/* Hero dengan 5 berita terpilih */}
            <Hero articles={topStories} />
              <CategoryTabs />
            <div className="content-layout">
              <div className="main-content">
                <Routes>
                  <Route path="/" element={
                    <AllNews 
                      stories={filteredStories} // Gunakan filteredStories yang bisa banyak
                      selectedTopic={selectedTopic}
                      loading={loading && filteredStories.length === 0}
                    />
                  } />
                  <Route path="/indonesia" element={
                    <IndonesiaNews 
                      stories={filteredStories}
                      selectedTopic={selectedTopic}
                      loading={loading}
                    />
                  } />
                  <Route path="/technology" element={
                    <TechnologyNews 
                      stories={filteredStories}
                      selectedTopic={selectedTopic}
                      loading={loading}
                    />
                  } />
                  <Route path="/health" element={
                    <HealthNews 
                      stories={filteredStories}
                      selectedTopic={selectedTopic}
                      loading={loading}
                    />
                  } />
                  <Route path="/saved" element={<SavedNews />} />
                </Routes>
              </div>
              
              <div className="sidebar-content">
                <TrendingSidebar onTopicSelect={handleTopicSelect} />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;