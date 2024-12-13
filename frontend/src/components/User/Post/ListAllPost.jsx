import { Pagination } from "@mui/material";
import React from "react";
import RoomPost from "./RoomPost";
import "./RoomPost.css";

const ListAllPost = ({ posts, handleTitleClick }) => {
  const [sortOption, setSortOption] = React.useState("default");

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const sortedPosts = React.useMemo(() => {
    let sorted = [...posts];
    switch (sortOption) {
      case "priceAsc":
        sorted.sort((a, b) => a.rentalPrice - b.rentalPrice);
        break;
      case "priceDesc":
        sorted.sort((a, b) => b.rentalPrice - a.rentalPrice);
        break;
      case "areaAsc":
        sorted.sort((a, b) => a.area - b.area);
        break;
      case "areaDesc":
        sorted.sort((a, b) => b.area - a.area);
        break;
      default:
        break;
    }
    return sorted;
  }, [posts, sortOption]);

  const [currentPage, setCurrentPage] = React.useState(1);
  const postsPerPage = 9;

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const paginatedPosts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;
    return sortedPosts.slice(startIndex, endIndex);
  }, [sortedPosts, currentPage]);

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
        {paginatedPosts.map((post, index) => (
          <RoomPost key={index} post={post} onTitleClick={handleTitleClick} />
        ))}
      </div>
      <div className="approved-post-list-container-pagination">
        <Pagination
          count={Math.ceil(sortedPosts.length / postsPerPage)}
          page={currentPage}
          onChange={handlePageChange}
        />
      </div>
    </>
  );
};

export default ListAllPost;
