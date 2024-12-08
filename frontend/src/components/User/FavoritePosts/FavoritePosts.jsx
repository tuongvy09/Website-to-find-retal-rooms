import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import RoomPost from "../Post/RoomPost";
import "./FavoritePosts.css";

const FavoritePosts = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.auth.login.currentUser);
  const navigate = useNavigate();

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

  const handleTitleClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  const handleToggleFavorite = async (postId, isCurrentlyFavorite) => {
    try {
      if (isCurrentlyFavorite) {
        // Remove from favorites
        await axios.delete(`http://localhost:8000/v1/posts/${postId}/favorite`, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });
        setFavorites(favorites.filter((post) => post._id !== postId));
      } else {
        // Add to favorites
        await axios.post(`http://localhost:8000/v1/posts/${postId}/favorite`, {}, {
          headers: {
            Authorization: `Bearer ${user?.accessToken}`,
          },
        });
        setFavorites((prevFavorites) => [...prevFavorites, { _id: postId }]);
      }
    } catch (error) {
      console.error("Lỗi khi toggle trạng thái yêu thích:", error);
    }
  };

  if (loading) {
    return <div className="loading">Đang tải danh sách yêu thích...</div>;
  }

  return (
    <div className="favorite-posts">
      {favorites.length === 0 ? (
        <p>Không có bài viết yêu thích nào.</p>
      ) : (
        <div className="favorites-list">
          {favorites.map((post) => (
            <RoomPost
              key={post._id}
              post={post}
              onTitleClick={handleTitleClick}
              onToggleFavorite={handleToggleFavorite}  
              isFavorite={true} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default FavoritePosts;