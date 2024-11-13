import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './NewsDetail.css'; // Import file CSS

const NewsDetail = () => {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/manage-news/edit/${id}`);
  };

  const handleBack = () => {
    navigate("/manage-news/list"); // Trở về trang trước
  };

  useEffect(() => {
    const fetchNewsDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/v1/news/${id}`);
        setNews(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu tin tức:", err);
        setError('Không thể tải chi tiết tin tức.');
        setLoading(false);
      }
    };
    if (id) fetchNewsDetail();
  }, [id]);

  if (loading) return <p>Đang tải...</p>;
  if (error) return <p>{error}</p>;
  if (!news) return <p>Không tìm thấy tin tức.</p>;

  const handleDelete = async (newsId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) {
      try {
        await axios.delete(`http://localhost:8000/v1/news/${newsId}`);
        toast.success("Xóa tin tức thành công!");
        navigate("/manage-news");
      } catch (err) {
        console.error("Lỗi khi xóa tin tức:", err);
        toast.error("Không thể xóa tin tức.");
      }
    }
  };

  const formattedDate = new Date(news.createdAt).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="news-detail-page">
      <ToastContainer position="top-right" autoClose={5000} /> {/* Only one ToastContainer */}

      {/* Sidebar */}
      <div className="sidebar">
        <ul>
          <li
            className={window.location.pathname === '/manage-news/list' ? 'active' : ''}
            onClick={() => navigate('/manage-news/list')}
          >
            Danh sách tin tức
          </li>
          <li
            className={window.location.pathname === '/manage-news/add' ? 'active' : ''}
            onClick={() => navigate('/manage-news/add')}
          >
            Thêm tin tức
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="news-detail-content">
        <div className="button-group">
          <button onClick={handleBack} className="back-button">← Quay lại</button>
          <div className="action-buttons">
            <button onClick={handleEdit} className="edit-button">Sửa</button>
            <button onClick={() => handleDelete(id)} className="delete-button">Xóa</button>
          </div>
        </div>
        <div className="news-content">
          <h2 className="news-title">{news.title}</h2>
          <div className="news-meta">
            <span className="news-author">{news.author}</span>
            <span className="news-date">, {formattedDate}</span>
          </div>
          <div dangerouslySetInnerHTML={{ __html: news.content }} />
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;