import React, { useState, useEffect } from "react";

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Default location is 'India'
  const [location, setLocation] = useState("India"); 
  const [searchInput, setSearchInput] = useState("");

  // 1. Fetch News based on Location
  const fetchNews = async (searchLocation) => {
    setLoading(true);
    setError(null);
    try {
      // We add the location to the search query (q=agriculture AND location)
      const query = `agriculture ${searchLocation}`;
      const response = await fetch(
        `https://gnews.io/api/v4/search?q=${query}&lang=en&country=in&max=6&apikey=8b23c0a5cda11a47f24f85cf0a0b4e05`
      );
      const data = await response.json();
      
      if (data.articles && data.articles.length > 0) {
        setArticles(data.articles);
      } else {
        setError(`No news found for "${searchLocation}".`);
        setArticles([]);
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load news. API limit might be reached.");
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchNews("India");
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(searchInput);
      fetchNews(searchInput);
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>📰 Agriculture News Hub</h1>

      {/* --- SEARCH BAR --- */}
      <div style={styles.searchContainer}>
        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Enter State or District (e.g., Karnataka)"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            style={styles.input}
          />
          <button type="submit" style={styles.searchBtn}>Find Local News</button>
        </form>
      </div>

      {/* --- YOUTUBE SECTION --- */}
      <div style={styles.videoSection}>
        <h2>📺 Featured Channels</h2>
        <div style={styles.channelGrid}>
          
          {/* Default Channel 1 */}
          <div style={styles.channelCard}>
            <img 
              src="https://yt3.googleusercontent.com/ytc/AIdro_mK4Nf2rRk_M7sZp0V5_5q5o_5q5o_5q5o=s176-c-k-c0x00ffffff-no-rj" 
              alt="DD Kisan"
              style={{width: '50px', borderRadius: '50%'}}
            />
            <div>
                <h3>DD Kisan</h3>
                <a href="https://www.youtube.com/@DDKisan" target="_blank" rel="noreferrer" style={styles.link}>Visit Channel</a>
            </div>
          </div>

          {/* Default Channel 2 */}
          <div style={styles.channelCard}>
            <img 
              src="https://yt3.googleusercontent.com/ytc/APkrFKY_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y_Y=s176-c-k-c0x00ffffff-no-rj" 
              alt="Krishi Jagran" 
              style={{width: '50px', borderRadius: '50%'}}
            />
            <div>
                <h3>Krishi Jagran</h3>
                <a href="https://www.youtube.com/@krishijagran" target="_blank" rel="noreferrer" style={styles.link}>Visit Channel</a>
            </div>
          </div>

        </div>

        {/* Dynamic Location Search for YouTube */}
        <div style={styles.dynamicVideo}>
            <h3>📍 Local Videos for: <span style={{color: '#2e7d32'}}>{location}</span></h3>
            <p>Find trending agriculture videos in your specific location:</p>
            <a 
                href={`https://www.youtube.com/results?search_query=agriculture+news+${location}+farming`} 
                target="_blank" 
                rel="noreferrer"
                style={styles.youtubeSearchBtn}
            >
                ▶️ Click to Watch {location} Agri News on YouTube
            </a>
        </div>
      </div>

      <hr style={{margin: '30px 0', border: '1px solid #ddd'}} />

      {/* --- GNEWS ARTICLES SECTION --- */}
      <h2>🗞️ Latest Articles in {location}</h2>
      
      {loading && <p>Loading latest updates...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      <div style={styles.newsGrid}>
        {!loading && !error && articles.map((article, index) => (
            <div key={index} style={styles.card}>
            {article.image && (
                <img src={article.image} alt="news" style={styles.newsImg} />
            )}
            <div style={{padding: '15px'}}>
                <h3 style={styles.newsTitle}>{article.title}</h3>
                <p style={styles.newsDesc}>{article.description}</p>
                <div style={styles.cardFooter}>
                    <span style={{fontSize: '0.8rem', color: '#666'}}>
                        {new Date(article.publishedAt).toLocaleDateString()}
                    </span>
                    <a href={article.url} target="_blank" rel="noopener noreferrer" style={styles.readMore}>
                        Read full story →
                    </a>
                </div>
            </div>
            </div>
        ))}
      </div>
    </div>
  );
};

// --- Internal CSS Styles ---
const styles = {
  container: {
    padding: "40px",
    backgroundColor: "#f4f6f8",
    minHeight: "100vh",
    color: "#333",
  },
  header: {
    textAlign: 'center',
    color: '#2e7d32',
    marginBottom: '30px'
  },
  searchContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '40px'
  },
  searchForm: {
    display: 'flex',
    gap: '10px',
    width: '100%',
    maxWidth: '600px'
  },
  input: {
    flex: 1,
    padding: '12px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '1rem'
  },
  searchBtn: {
    padding: '12px 25px',
    backgroundColor: '#2e7d32',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  videoSection: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
    marginBottom: '30px'
  },
  channelGrid: {
    display: 'flex',
    gap: '20px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  channelCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '15px',
    border: '1px solid #eee',
    borderRadius: '8px',
    flex: 1,
    minWidth: '250px'
  },
  dynamicVideo: {
    marginTop: '20px',
    padding: '20px',
    backgroundColor: '#e8f5e9',
    borderRadius: '8px',
    textAlign: 'center'
  },
  youtubeSearchBtn: {
    display: 'inline-block',
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#ff0000', // YouTube Red
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold'
  },
  newsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '10px',
    overflow: 'hidden',
    boxShadow: '0 3px 8px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column'
  },
  newsImg: {
    width: '100%',
    height: '180px',
    objectFit: 'cover'
  },
  newsTitle: {
    fontSize: '1.1rem',
    marginBottom: '10px',
    color: '#333'
  },
  newsDesc: {
    fontSize: '0.9rem',
    color: '#555',
    marginBottom: '15px',
    lineHeight: '1.4'
  },
  cardFooter: {
    marginTop: 'auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  readMore: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold'
  },
  link: {
      color: '#007bff',
      textDecoration: 'none'
  }
};

export default News;