import axios from "axios";
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { searchAndCategorizePosts } from '../../../redux/postAPI';
import ListPostHome from '../Post/ListPostHome';
import './Home.css';
import Introduction from './Introduction';
import ListNewsHome from "./ListNewsHome";

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const token = currentUser?.accessToken;
  const [category1Posts, setTroPosts] = useState([]);
  const [category2Posts, setCanHoPosts] = useState([]);
  const [category3Posts, setVanPhongPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = {
          category: ['Nhà trọ, phòng trọ', 'Nhà nguyên căn', 'Cho thuê căn hộ', 'Cho thuê căn hộ mini', 'Cho thuê căn hộ dịch vụ', 'Cho thuê mặt bằng, văn phòng'],
        };
        const { category1, category2, category3 } = await searchAndCategorizePosts(params, token);
        setTroPosts(Array.isArray(category1) ? category1.map(formatPost) : []);
        setCanHoPosts(Array.isArray(category2) ? category2.map(formatPost) : []);
        setVanPhongPosts(Array.isArray(category3) ? category3.map(formatPost) : []);

      } catch (error) {
        console.error('Lỗi khi lấy bài đăng:', error);
      }
    };

    fetchPosts();
  }, [token]);

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
    console.log("Current User:", currentUser);
    if (currentUser && currentUser.admin !== undefined) {
      if (currentUser.admin === true) {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    }
  }, [currentUser, navigate]);

  const handleLogout = () => {
    setUser(null);
  };

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("http://localhost:8000/v1/posts/favorites", {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });
        setFavorites(response.data.favorites);
      } catch (error) {
        console.error("Lỗi khi tải danh sách yêu thích:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.accessToken) {
      fetchFavorites();
    }
  }, [user]);

  return (
    <div className="home-container">
      <div style={{ width: '100%', height: 'auto' }}>
        <ListPostHome post={category1Posts} title='Nhà trọ, phòng trọ' />
      <div style={{width: '100%', height: 'auto'}}>
        <ListPostHome favorites={favorites} />
      </div>
      <div style={{ width: '100%', height: 'auto' }}>
        <ListPostHome post={category2Posts} title='Cho thuê căn hộ, nhà ở' />
      </div>
      <div style={{ width: '100%', height: 'auto' }}>
        <ListPostHome post={category3Posts} title='Văn phòng, mặt bằng' />
      </div>
      <div style={{ width: '100%', height: 'auto' }}>
        <Introduction />
      </div>
      <div style={{ width: '100%', height: 'auto' }}>
        <ListNewsHome />
      </div>
      {user ? (
        <>
          <p>Hello, {user}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : null}
      </div>
    </div>
  );
};

export default Home;