import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAllNews } from '../../../../redux/newsAPI';
import axios from 'axios';
import NewsDetail from '../NewsDetail/NewsDetail';
import './NewsList.css';

const NewsList = () => {
    const dispatch = useDispatch();
    const { newsList, isFetching, error } = useSelector((state) => state.news);
    const [selectedNews, setSelectedNews] = useState(null);

    const accessToken = localStorage.getItem('accessToken'); 
    const axiosJWT = axios.create({
        baseURL: 'http://localhost:8000', 
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    useEffect(() => {
        getAllNews(accessToken, dispatch, axiosJWT);
    }, [accessToken, dispatch]);

    const handleNewsClick = (news) => {
        setSelectedNews(news);
    };

    if (isFetching) return <p>Loading...</p>;
    if (error) return <p>Error fetching news.</p>;

    return (
        <div className="news-list-container">
            {selectedNews ? (
                <NewsDetail news={selectedNews} onBack={() => setSelectedNews(null)} />
            ) : (
                <div>
                    <h2>Danh sách tin tức</h2>
                    <ul className="news-list">
                        {newsList.map((news) => (
                            <li key={news.id} className="news-item" onClick={() => handleNewsClick(news)}>
                                <img src={news.imageUrl || 'placeholder.jpg'} alt={news.title} className="news-image" />
                                <div className="news-info">
                                    <h3>{news.title}</h3>
                                    <p>{news.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default NewsList;