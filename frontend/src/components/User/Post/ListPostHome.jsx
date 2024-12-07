import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import arrowsIcon from '../../../assets/images/arrowIcon.png';
import { getApprovedPosts } from '../../../redux/postAPI';
import './ListPostHome.css';
import RoomPost from './RoomPost';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useFavoriteToggle } from '../../../redux/postAPI';

const ListPostHome = (favorite) => {
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.login.currentUser);
  const { favorites, toggleFavorite } = useFavoriteToggle(user);


  const handleTitleClick = (id) => {
    console.log("Navigating to post with ID:", id);
    if (id) {
      navigate(`/posts/${id}`);
    } else {
      console.error('ID bài đăng không hợp lệ');
    }
  };
  
  useEffect(() => {
    const fetchApprovedPosts = async () => {
      try {
        const response = await getApprovedPosts();
        const formattedPosts = response.map(post => ({
          id: post._id,
          address: {
            province: post.address?.province || '',
            district: post.address?.district || '',
          },
          title: post.title || '',
          content: post.content || '',
          contactInfo: {
            username: post.contactInfo?.username || '',
            phoneNumber: post.contactInfo?.phoneNumber || '',
          },
          rentalPrice: post.rentalPrice,
          area: post.area,
          images: post.images ? post.images.slice(0, 2) : [],
        }));

        setApprovedPosts(formattedPosts);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedPosts();
  }, []);

  if (loading) return <div>Loading...</div>;

  const sliderSettings = {
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
  };

  return (
    <div className="approved-posts-slider">
      <Slider {...sliderSettings}>
        {approvedPosts.slice(0, 5).map((post, index) => (
          <div key={index} className="approved-posts-item">
            <RoomPost
            post={post}
            onTitleClick={() => handleTitleClick(post.id)}
            onToggleFavorite={(id, isFavorite) => toggleFavorite(id, isFavorite)}
            isFavorite={favorites.some((fav) => fav._id === post._id)}
          />;

            {index === approvedPosts.slice(0, 5).length - 1 && (
              <button
                className="see-more-button"
                onClick={() => navigate('/posts')}
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

export default ListPostHome;
