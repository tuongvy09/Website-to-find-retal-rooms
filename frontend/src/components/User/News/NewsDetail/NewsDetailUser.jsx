import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import supportPic from '../../../../assets/images/supportPic.png';
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
      <div className="support-container">
      {/* Image Section */}
      <div className="support-image">
        <img
          src={supportPic}
          alt="Support"
          className="support-image-img"
        />
      </div>
      {/* Info Section */}
      <div className="support-info">
        <div className="icon">
          <i className="fas fa-headset"></i>
        </div>
        <h3>Hỗ trợ chủ nhà đăng tin</h3>
        <p>
          Nếu bạn cần hỗ trợ đăng tin, vui lòng liên hệ số điện thoại bên dưới:
        </p>
        <div className="contact-buttons">
          <button className="contact-btn phone-btn">
            <i className="fas fa-phone-alt"></i> ĐT: 0909316890
          </button>
          <button className="contact-btn zalo-btn">
            <i className="fas fa-comment-dots"></i> Zalo: 0909316890
          </button>
        </div>
      </div>
    </div>
    </div>
  );
};

export default NewsDetailUser;