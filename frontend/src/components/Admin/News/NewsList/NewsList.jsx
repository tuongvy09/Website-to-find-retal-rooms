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
    const [currentPage, setCurrentPage] = useState(1);
    const newsPerPage = 5; 

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


    // Tính toán phân trang
    const indexOfLastNews = currentPage * newsPerPage;
    const indexOfFirstNews = indexOfLastNews - newsPerPage;
    const currentNews = newsList.slice(indexOfFirstNews, indexOfLastNews);
    const totalPages = Math.ceil(newsList.length / newsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };
    const prevPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    // Hàm để hiển thị các nút trang với giới hạn
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPageNumbers = 5; // Số lượng nút trang tối đa hiển thị
        let startPage = Math.max(currentPage - Math.floor(maxPageNumbers / 2), 1);
        let endPage = startPage + maxPageNumbers - 1;

        if (endPage > totalPages) {
            endPage = totalPages;
            startPage = Math.max(endPage - maxPageNumbers + 1, 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers;
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
                        {currentNews.map((news) => (
                            <li key={news.id} className="news-item" onClick={() => handleNewsClick(news)}>
                                <img src={news.imageUrl || 'placeholder.jpg'} alt={news.title} className="news-image" />
                                <div className="news-info">
                                    <h3>{news.title}</h3>
                                    <p>{news.description}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="pagination">
                        <button onClick={prevPage} disabled={currentPage === 1} className="pagination-button">
                            &laquo; Trước
                        </button>
                        {getPageNumbers().map((number) => (
                            <button
                                key={number}
                                onClick={() => paginate(number)}
                                className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                            >
                                {number}
                            </button>
                        ))}
                        <button onClick={nextPage} disabled={currentPage === totalPages} className="pagination-button">
                            Tiếp &raquo;
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsList;