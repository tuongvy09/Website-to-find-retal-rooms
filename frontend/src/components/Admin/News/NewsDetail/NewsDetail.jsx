import React from 'react';
import './NewsDetail.css';

const NewsDetail = ({ news, onBack, onEdit, onDelete }) => {
    return (
        <div className="news-detail">
            <div className="button-group">
                <button onClick={onBack} className="back-button">← Quay lại</button>
                <div className="action-buttons">
                    <button onClick={onEdit} className="edit-button">Sửa</button>
                    <button onClick={onDelete} className="delete-button">Xóa</button>
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