import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './NewsDetailUser.css';

const NewsDetailUser = () => {
  const { id } = useParams(); // Lấy id từ URL
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/v1/news/${id}`);
        setNews(response.data);
        setLoading(false);
      } catch (err) {
        setError('Không thể tải chi tiết tin tức.');
        setLoading(false);
      }
    };
    fetchNewsDetail();
  }, [id]);

  if (loading) return <p>Đang tải chi tiết tin tức...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="news-detail-container">
      <h2 className="news-detail-title">{news.title}</h2>
      <p className="news-detail-date">{news.date}</p>
      <div className="news-detail-content">
      <div dangerouslySetInnerHTML={{ __html: news.content }} />
      </div>
    </div>
  );
};

export default NewsDetailUser;