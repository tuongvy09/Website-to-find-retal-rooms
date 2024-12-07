import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import arrowsIcon from '../../../assets/images/arrowIcon.png';
import { getApprovedPosts, searchAndCategorizePosts } from '../../../redux/postAPI';
import './ListPostHome.css';
import RoomPost from './RoomPost';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useFavoriteToggle } from '../../../redux/postAPI';

const ListPostHome = (favorite) => {
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const token = currentUser?.accessToken;
  const [category1Posts, setTroPosts] = useState([]);
  const [category2Posts, setCanHoPosts] = useState([]);
  const [category3Posts, setVanPhongPosts] = useState([]);
  const user = useSelector((state) => state.auth.login.currentUser);
  const { favorites, toggleFavorite } = useFavoriteToggle(user);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = {
          category: ['Nhà trọ, phòng trọ', 'Nhà nguyên căn', 'Cho thuê căn hộ', 'Cho thuê căn hộ mini', 'Cho thuê căn hộ dịch vụ', 'Cho thuê mặt bằng, văn phòng'],
        };
        const { category1, category2, category3 } = await searchAndCategorizePosts(params, token);
        setTroPosts(category1.map(formatPost));
        setCanHoPosts(category2.map(formatPost));
        setVanPhongPosts(category3.map(formatPost));
      } catch (error) {
        console.error('Lỗi khi lấy bài đăng:', error);
      }
    };

    fetchPosts();
  }, [token]);

  console.log('Category 1:', category1Posts);
  console.log('Category 2:', category2Posts);
  console.log('Category 3:', category3Posts);

  const handleTitleClick = (id) => {
    console.log("Navigating to post with ID:", id);
    if (id) {
      navigate(`/posts/${id}`);
    } else {
      console.error('ID bài đăng không hợp lệ');
    }
  };

  const formatPost = (post) => ({
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
  });

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
