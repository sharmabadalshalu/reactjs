import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";


function NewsCard({ title, description, imageUrl, articleUrl, author, source, publishedAt }) {
  return (
    <div className="card mb-4 shadow-sm h-100">
      <img
        src={imageUrl}
        alt={title}
        className="card-img-top"
        style={{ height: "220px", objectFit: "cover" }}
      />
      <div className="card-body d-flex flex-column">
        <h5 className="card-title text-dark">{title}</h5>
        <p className="card-text">{description?.slice(0, 150)}...</p>

        {/* Author, Source & Time */}
        <p className="text-muted mb-1" style={{ fontSize: "0.85rem" }}>
          By <strong>{author || "Unknown"}</strong> | Source: <strong>{source?.name || "N/A"}</strong>
        </p>
        <p className="text-muted mb-2" style={{ fontSize: "0.8rem" }}>
          Published: {new Date(publishedAt).toLocaleString()}
        </p>

        <a
          href={articleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-dark btn-sm mt-auto"
        >
          Read More
        </a>
      </div>
    </div>
  );
}

// Spinner component
function Spinner() {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
      <div className="spinner-border text-dark" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
}

// Main App
function App() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const pageSize = 6;
  const API_KEY = "fd5cfee1a44f4cfe80f1a07463798ee8";

  const hindiURL = `https://newsapi.org/v2/everything?q=india&language=hi&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;
  const englishURL = `https://newsapi.org/v2/everything?q=india sports cricket hockey&language=en&pageSize=${pageSize}&page=${page}&apiKey=${API_KEY}`;

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        const [hindiRes, englishRes] = await Promise.all([
          fetch(hindiURL),
          fetch(englishURL),
        ]);

        const hindiData = hindiRes.ok ? await hindiRes.json() : { articles: [] };
        const englishData = englishRes.ok ? await englishRes.json() : { articles: [] };

        const hindiNews = hindiData.articles || [];
        const englishNews = englishData.articles || [];

        const allNews = [...hindiNews, ...englishNews].filter(
          (item) => item.urlToImage && item.description && item.url
        );

        setNewsList(allNews);
      } catch (error) {
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [page]);

  const handleNext = () => setPage(page + 1);
  const handlePrev = () => page > 1 && setPage(page - 1);

  return (
    <div>
      <Navbar />
      <div className="container mt-5 mb-5">
        <h1 className="text-center mb-5">
          Latest India & Sports News (Hindi + English)
        </h1>

        {loading ? (
          <Spinner />
        ) : newsList.length === 0 ? (
          <p className="text-center">No news available.</p>
        ) : (
          <>
            <div className="row">
              {newsList.map((news, index) => (
                <div className="col-md-4 mb-4" key={index}>
                  <NewsCard
                    title={news.title}
                    description={news.description}
                    imageUrl={news.urlToImage}
                    articleUrl={news.url}
                    author={news.author}
                    source={news.source}
                    publishedAt={news.publishedAt}
                  />
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-dark"
                disabled={page <= 1}
                onClick={handlePrev}
              >
                ← Previous
              </button>
              <button
                className="btn btn-dark"
                onClick={handleNext}
              >
                Next → 
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;