import axios from 'axios';

const API_KEY = '7UlI9qIEuSTKT9d2JsXJIKNZS7CV8cW9';
const BASE_URL = 'https://api.nytimes.com/svc';

export const newsAPI = {
  getHeroStories: async () => {
  try {
    const stories = await newsAPI.getTopStories('home');
    // Filter hanya berita dengan gambar dan ambil 3-5 untuk slider
    return stories
      .filter(story => story.multimedia?.[0]?.url || story.media?.[0]?.['media-metadata'])
      .slice(0, 5);
  } catch (error) {
    console.error('Error fetching hero stories:', error);
    return [];
  }
},
  
  // Top Stories - untuk All News
  getTopStories: async (section = 'home') => {
    try {
      const response = await axios.get(
        `${BASE_URL}/topstories/v2/${section}.json?api-key=${API_KEY}`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching top stories:', error);
      throw error;
    }
  },

  // Most Popular - alternatif untuk All News
  getMostPopular: async (period = 7) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/mostpopular/v2/viewed/${period}.json?api-key=${API_KEY}`
      );
      return response.data.results;
    } catch (error) {
      console.error('Error fetching most popular:', error);
      throw error;
    }
  },

  // Article Search untuk berita spesifik (Indonesia, Technology, Health)
  getArticlesByQuery: async (query = '', sort = 'newest') => {
    try {
      const response = await axios.get(
        `${BASE_URL}/search/v2/articlesearch.json?q=${query}&sort=${sort}&api-key=${API_KEY}`
      );
      return response.data.response.docs || [];
    } catch (error) {
      console.error(`Error fetching articles for query "${query}":`, error);
      throw error;
    }
  },

  // Content API untuk kategori tertentu
  getContentBySection: async (section = 'all') => {
    try {
      const response = await axios.get(
        `${BASE_URL}/news/v3/content/all/${section}.json?api-key=${API_KEY}`
      );
      return response.data.results || [];
    } catch (error) {
      console.error(`Error fetching content for section "${section}":`, error);
      throw error;
    }
  },

  // ===============================
  // TECHNOLOGY — BEST SOURCE: CONTENT API
  // ===============================
  getTechnologyNews: async () => {
    const res = await axios.get(
      `${BASE_URL}/news/v3/content/nyt/technology.json?api-key=${API_KEY}`
    );

    return normalizeArticles(res.data.results).slice(0, 30);
  },

  // ===============================
  // HEALTH — BEST SOURCE: CONTENT API
  // ===============================
  getHealthNews: async () => {
    const res = await axios.get(
      `${BASE_URL}/news/v3/content/nyt/health.json?api-key=${API_KEY}`
    );

    return normalizeArticles(res.data.results).slice(0, 30);
  },

  // ===============================
  // INDONESIA NEWS — Hybrid
  // Karena tidak ada category khusus Indonesia
  // ===============================
  getIndonesiaNews: async () => {
    let articles = [];

    // 1. Ambil dari section ASIA (paling dekat dengan Indonesia)
    try {
      const asia = await axios.get(
        `${BASE_URL}/news/v3/content/nyt/world/asia.json?api-key=${API_KEY}`
      );
      articles.push(...asia.data.results);
    } catch (e) {
      console.warn("Asia news missing");
    }

    // 2. Tambahan query khusus Indonesia via Article Search
    const keywords = ["indonesia", "jakarta", "bali", "jokowi", "nusantara"];

    for (let q of keywords) {
      try {
        const res = await axios.get(
          `${BASE_URL}/search/v2/articlesearch.json?q=${q}&sort=newest&api-key=${API_KEY}`
        );
        articles.push(...res.data.response.docs);
      } catch (e) {
        console.warn(`Search error for '${q}'`);
      }
    }

    // Remove duplicates by URL
    const unique = removeDuplicates(articles);
    return normalizeArticles(unique).slice(0, 30);
  },

  // ===============================
  // GENERIC SEARCH
  // ===============================
  searchNews: async (query) => {
    const res = await axios.get(
      `${BASE_URL}/search/v2/articlesearch.json?q=${query}&sort=newest&api-key=${API_KEY}`
    );
    return normalizeArticles(res.data.response.docs);
  },
};

//
// ==========================================================
//  HELPER FUNCTIONS — STANDARDIZE ALL ARTICLE STRUCTURES
// ==========================================================
//
const normalizeArticles = (articles = []) => {
  return articles.map((a) => {
    const image = extractImage(a);

    return {
      title: a.title || a.headline?.main || a.headline?.name || "",
      abstract: a.abstract || a.snippet || "",
      url: a.url || a.web_url || "#",
      source: a.source || a.section || a.section_name || "NYTimes",
      date:
        a.published_date ||
        a.pub_date ||
        a.created_date ||
        a.updated_date ||
        null,
      multimedia: a.multimedia || a.media || null,
      image: image, // ← FINAL IMAGE URL
      raw: a, // for debugging
    };
  });
};

//
// IMAGE EXTRACTOR — 100% BEST QUALITY POSSIBLE
//
const extractImage = (article) => {
  // 1. Content API (technology, health, asia)
  if (article.multimedia && Array.isArray(article.multimedia)) {
    const best = article.multimedia.find((m) => m.url);
    if (best) return best.url;
  }

  // 2. Most Popular API
  if (article.media?.[0]?.["media-metadata"]) {
    const metadata = article.media[0]["media-metadata"];
    return metadata[metadata.length - 1]?.url || null;
  }

  // 3. Article Search API
  if (article.multimedia?.length > 0) {
    const pick = article.multimedia.find((m) => m.url);
    if (pick) {
      return pick.url.startsWith("http")
        ? pick.url
        : "https://www.nytimes.com/" + pick.url;
    }
  }

  return null; // fallback to placeholder in NewsCard
};

//
// Remove duplicated articles by URL
//
const removeDuplicates = (arr) => {
  const map = new Map();
  arr.forEach((a) => {
    const url = a.url || a.web_url;
    if (!map.has(url)) map.set(url, a);
  });
  return [...map.values()];
};