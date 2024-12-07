import React from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import arrowsIcon from '../../../assets/images/arrowIcon.png';
import './ListPostHome.css';
import RoomPost from './RoomPost';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useFavoriteToggle } from '../../../redux/postAPI';

const ListPostHome = ({post =[], title}) => {
  const navigate = useNavigate();
  const isPostArray = Array.isArray(post);
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

      <div>{title}</div>
      {isPostArray ? (
        <Slider {...sliderSettings}>
          {post.slice(0, 5).map((postItem, index) => (
            <div key={index} className="approved-posts-item">
              <RoomPost
                post={postItem}
                onTitleClick={() => handleTitleClick(postItem.id)
                onToggleFavorite={(id, isFavorite) => toggleFavorite(id, isFavorite)
                isFavorite={favorites.some((fav) => fav._id === post._id)}}
              />
              {index === Math.min(post.length, 5) - 1 && (
                <button
                  className="see-more-button"
                  onClick={() => navigate('/posts')}
                >
                  See More
                  <img src={arrowsIcon} alt="arrows" className="style-icon-btn-see-more" />
                </button>
              )}
            </div>
          ))}
        </Slider>
      ) : (
        <p>Dữ liệu bài đăng không hợp lệ hoặc đang tải...</p>
      )}
    </div>
  );  
};

export default ListPostHome;
