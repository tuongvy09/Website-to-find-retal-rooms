import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const NewsDetail = () => {
  console.log('tst  ')

  const { id } = useParams(); // Lấy 'id' từ URL
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate(`/edit-news/${id}`); // Navigate to the edit page
  };

  // Lấy dữ liệu bài viết theo id khi component mount
  useEffect(() => {
    console.log("Fetching news with id:", id); // Log để kiểm tra id
    const fetchNewsDetail = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/v1/news/${id}`);
        console.log("Fetched news data:", response.data); // Log để kiểm tra dữ liệu
        setNews(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching news:", err);
        setError('Failed to fetch news details.');
        setLoading(false);
      }
    };
    if (id) fetchNewsDetail(); // Chỉ gọi fetch khi 'id' có sẵn
  }, [id]);

  // Kiểm tra nếu đang tải hoặc có lỗi xảy ra
  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  // Kiểm tra xem dữ liệu bài viết có tồn tại không
  if (!news) return <p>No news found.</p>;

  const handleDelete = async (newsId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) {
      try {
        await axios.delete(`http://localhost:8000/v1/news/${newsId}`);
        alert("Xóa tin tức thành công!");
        navigate("/manage-news");
      } catch (err) {
        console.error("Lỗi khi xóa tin tức:", err);
        alert("Xóa tin tức không thành công!");
      }
    }
  };

  return (
    <div className="news-detail">
        <div className="button-group">
            {/* <button onClick={onBack} className="back-button">← Quay lại</button> */}
            <div className="action-buttons">
                <button onClick={handleEdit} className="edit-button">Sửa</button>
                <button onClick={() => handleDelete(id)} className="delete-button">Xóa</button>
            </div>
        </div>
        <div className="news-content">
            <h2 className="news-title">{news.title}</h2>
            <img src={news.imageUrl || 'placeholder.jpg'} alt={news.title} className="news-detail-image" />
            <p className="news-content-text">{news.content}</p>
        </div>
    </div>
);
};

export default NewsDetail;