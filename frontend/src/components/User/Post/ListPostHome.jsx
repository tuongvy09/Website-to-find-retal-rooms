import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import arrowsIcon from "../../../assets/images/arrowIcon.png";
import { useFavoriteToggle } from "../../../redux/postAPI";
import "./ListPostHome.css";
import RoomPost from "./RoomPost";
import axios from "axios";

const ListPostHome = ({ post = [], title, favorite }) => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = React.useState([]);
  const [change, setChange] = React.useState(false);
  const user = useSelector((state) => state.auth.login.currentUser);
  const { toggleFavorite } = useFavoriteToggle(user);
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
        await setFavorites(response.data.favorites);
        console.log("Favorites:", response.data.favorites);
      } catch (error) {
        console.error("Lỗi khi tải danh sách yêu thích:", error);
      } finally {
      }
    };

    if (user?.accessToken) {
      fetchFavorites();
    }
  }, [user]);
  console.log("Favorites:", favorites);
  const handleTitleClick = (id) => {
    console.log("Navigating to post with ID:", id);
    if (id) {
      navigate(`/posts/${id}`);
    } else {
      console.error("ID bài đăng không hợp lệ");
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

  const isPostArray = Array.isArray(post);

  return (
    <div className="approved-posts-slider">
      <div className="approved-post-in-home-title">{title}</div>
      {isPostArray ? (
        <Slider {...sliderSettings}>
          {post.slice(0, 5).map((postItem, index) => (
            <div key={index} className="approved-posts-item">
              <RoomPost
                post={postItem}
                onTitleClick={() => handleTitleClick(postItem.id)}
                isFavorite={favorites.some((fav) => fav._id === postItem.id)}
                onToggleFavorite={(id, isFavorite) => {
                  toggleFavorite(
                    postItem.id,
                    favorites.some((fav) => fav._id === postItem.id),
                  );
                  setFavorites(
                    favorites.some((fav) => fav._id === postItem.id)
                      ? favorites.filter((fav) => fav._id !== postItem.id)
                      : [...favorites, { _id: postItem.id }],
                  );
                }}
              />
              {index === Math.min(post.length, 5) - 1 && (
                <button
                  className="see-more-button"
                  onClick={() => {
                    if (title === "Nhà trọ, phòng trọ") {
                      navigate("/posts");
                    } else if (title === "Cho thuê căn hộ, nhà ở") {
                      navigate("/CanHoPost");
                    } else if (title === "Văn phòng, mặt bằng") {
                      navigate("/VanPhongPost");
                    }
                  }}
                >
                  See More
                  <img
                    src={arrowsIcon}
                    alt="arrows"
                    className="style-icon-btn-see-more"
                  />
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