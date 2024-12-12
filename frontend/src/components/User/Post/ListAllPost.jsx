import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApprovedPosts } from "../../../redux/postAPI";
import RoomPost from "./RoomPost";

const ListAllPost = () => {
  const [approvedPosts, setApprovedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("default"); // Default sorting option
  const navigate = useNavigate();

  const handleTitleClick = (id) => {
    console.log("Navigating to post with ID:", id);
    if (id) {
      navigate(`/posts/${id}`);
    } else {
      console.error("ID bài đăng không hợp lệ");
    }
  };

  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  // Sort function
  const sortPosts = (posts, option) => {
    switch (option) {
      case "priceAsc":
        return [...posts].sort((a, b) => a.rentalPrice - b.rentalPrice);
      case "priceDesc":
        return [...posts].sort((a, b) => b.rentalPrice - a.rentalPrice);
      case "areaAsc":
        return [...posts].sort((a, b) => a.area - b.area);
      case "areaDesc":
        return [...posts].sort((a, b) => b.area - a.area);
      default:
        return posts;
    }
  };

  useEffect(() => {
    const fetchApprovedPosts = async () => {
      try {
        const response = await getApprovedPosts();

        const formattedPosts = response.map((post) => ({
          id: post._id,
          address: {
            province: post.address?.province || "",
            district: post.address?.district || "",
          },
          title: post.title || "",
          content: post.content || "",
          contactInfo: {
            username: post.contactInfo?.username || "",
            phoneNumber: post.contactInfo?.phoneNumber || "",
          },
          rentalPrice: post.rentalPrice,
          area: post.area,
          images: post.images ? post.images.slice(0, 2) : [],
        }));

        setApprovedPosts(formattedPosts);
      } catch (error) {
        console.error("Lỗi khi lấy dữ liệu từ API:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedPosts();
  }, []);

  const sortedPosts = sortPosts(approvedPosts, sortOption);

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className="sort-options" style={{ marginBottom: "20px" }}>
        <select value={sortOption} onChange={handleSortChange}>
          <option value="default">Mặc định</option>
          <option value="priceAsc">Giá thuê (Tăng dần)</option>
          <option value="priceDesc">Giá thuê (Giảm dần)</option>
          <option value="areaAsc">Diện tích (Tăng dần)</option>
          <option value="areaDesc">Diện tích (Giảm dần)</option>
        </select>
      </div>
      <div className="approved-posts-list">
        {sortedPosts.map((post, index) => (
          <RoomPost key={index} post={post} onTitleClick={handleTitleClick} />
        ))}
      </div>
    </>
  );
};

export default ListAllPost;
