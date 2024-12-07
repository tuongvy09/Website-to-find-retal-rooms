import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
      <div style={{width: '100%', height: 'auto'}}>
        <ListPostHome favorites={favorites} />
      </div>
      <div style={{width: '100%', height:'auto'}}>
        <Introduction/>
      </div>
      <div style={{width: '100%', height: 'auto'}}>
      <ListNewsHome />
      </div>
      {user ? (
        <>
          <p>Hello, {user}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : null}
    </div>
  );
};

export default Home;