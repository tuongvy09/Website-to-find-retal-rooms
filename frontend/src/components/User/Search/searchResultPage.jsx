import React from "react";
import { useLocation } from "react-router-dom";
import RoomPost from "../Post/RoomPost";
import "./searchPosts.css";

const SearchResultsPage = () => {
  const location = useLocation();
  const { results, filters } = location.state || { results: [], filters: {} };

  return (
    <div className="search-results-container">
      <h2>Kết Quả Tìm Kiếm</h2>
      {results.length > 0 ? (
        <div className="post-list">
          {results.map((post) => (
            <RoomPost key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="search-no-result">Không tìm thấy bài đăng nào.</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
