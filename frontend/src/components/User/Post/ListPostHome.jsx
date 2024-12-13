import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import arrowsIcon from "../../../assets/images/arrowIcon.png";
import { useFavoriteToggle } from "../../../redux/postAPI";
import "./ListPostHome.css";
import RoomPost from "./RoomPost";

const ListPostHome = ({ post = [], title, favorite }) => {
  const navigate = useNavigate();
  console.log(favorite);
  console.log("post", post);

  const user = useSelector((state) => state.auth.login.currentUser);
  const { favorites, toggleFavorite } = useFavoriteToggle(user);

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
                onToggleFavorite={(id, isFavorite) =>
                  toggleFavorite(id, isFavorite)
                }
                isFavorite={favorites.some((fav) => fav._id === post._id)}
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
