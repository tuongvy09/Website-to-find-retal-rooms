// NewsDetail.js
import React from 'react';
import './NewsDetail.css';

const NewsDetail = ({ news, onBack }) => {
    return (
        <div className="news-detail">
            <button onClick={onBack} className="back-button">Quay lại</button>
            <h2>{news.title}</h2>
            <img src={news.imageUrl || 'placeholder.jpg'} alt={news.title} className="news-detail-image" />
            <p>{news.content}</p>
        </div>
    );
};

export default NewsDetail;