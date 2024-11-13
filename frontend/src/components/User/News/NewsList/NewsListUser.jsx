import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './NewsListUser.css';

const NewsListUser = () => {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:8000/v1/news');
        setNewsList(response.data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải tin tức.');
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  if (loading) return <p>Đang tải tin tức...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="news-list-container">
      <h2 className="news-list-title">Tin Tức Mới Nhất</h2>
      <ul className="news-list">
        {newsList.map((news) => (
          <li key={news._id} className="news-item">
            <Link to={`/news/${news._id}`} className="news-link">
              {news.imageUrl && (
                <img src={`http://localhost:8000${news.imageUrl || '/placeholder.jpg'}`} alt={news.title} className="news-image" />
              )}
              <div className="news-content">
                <h3>{news.title}</h3>
                <p className="news-description">{news.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsListUser;