import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { motion } from 'framer-motion';
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
        const response = await axios.get(
          "http://localhost:8000/v1/posts/favorites",
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          },
        );
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
      const result = await Swal.fire({
        title:
          "Bạn có chắc chắn muốn xóa bài viết này khỏi danh sách yêu thích?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Xóa",
        cancelButtonText: "Hủy",
      });

      if (result.isConfirmed) {
        // Xóa bài viết khỏi danh sách yêu thích nếu người dùng xác nhận
        await axios.delete(
          `http://localhost:8000/v1/posts/${postId}/favorite`,
          {
            headers: {
              Authorization: `Bearer ${user?.accessToken}`,
            },
          },
        );
        // Cập nhật danh sách yêu thích sau khi xóa
        setFavorites(favorites.filter((post) => post._id !== postId)); // Xóa bài viết khỏi danh sách
        Swal.fire(
          "Đã xóa!",
          "Bài viết đã được xóa khỏi danh sách yêu thích.",
          "success",
        );
      } else {
        Swal.fire("Đã hủy!", "Bài viết vẫn ở lại danh sách yêu thích.", "info");
      }
    } catch (error) {
      console.error("Lỗi khi thay đổi trạng thái yêu thích:", error);
      Swal.fire(
        "Lỗi!",
        "Có lỗi xảy ra khi xóa bài viết khỏi danh sách yêu thích.",
        "error",
      );
    }
  };

  return (
    <div className="favorite-posts">
      {favorites.length === 0 ? (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}  
          transition={{ duration: 0.6, ease: 'easeOut' }} 
          style={{
            textAlign: 'center',
            fontSize: '18px',
            color: '#555',
            marginTop: '20px',
          }}
        >
          Không có bài viết yêu thích nào.
        </motion.p>
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
