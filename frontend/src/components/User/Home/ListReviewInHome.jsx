import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import arrowsIcon from '../../../assets/images/arrowIcon.png';
import './ListReviewInHome.css';

const ListReviewInHome = () => {
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>{error}</p>;

    const settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
    };

    const limitedNewsList = newsList.slice(0, 5);

    return (
        <div className="home-news-list-container">
            <h2 className="news-list-title">Tin Tức Mới Nhất</h2>
            <Slider {...settings}>
                {limitedNewsList.map((news, index) => (
                    <div key={news._id} className="home-new-list-items">
                        <Link to={`/news/${news._id}`} className="news-link">
                            {news.imageUrl && (
                                <img
                                    src={`http://localhost:8000${news.imageUrl || '/placeholder.jpg'}`}
                                    alt={news.title}
                                    className="news-image"
                                />
                            )}
                            <div className="news-content">
                                <h3>{news.title}</h3>
                                <p className="news-description">{news.description}</p>
                            </div>
                        </Link>
                        {index === limitedNewsList.length - 1 && (
                            <button
                                className="see-more-button"
                                onClick={() => navigate('/news')}
                            >
                                See More
                                <img src={arrowsIcon} alt='arrows' className='style-icon-btn-see-more'></img>
                            </button>
                        )}
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default ListReviewInHome;
