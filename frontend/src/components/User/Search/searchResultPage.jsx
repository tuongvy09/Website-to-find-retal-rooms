import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import RoomPost from "../Post/RoomPost";
import "./searchResultPage.css";

const SearchResultsPage = () => {
  const location = useLocation();
  const { results, filters } = location.state || { results: [], filters: {} };
  
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 9; 

  const sortedResults = [...results].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Logic phân trang
  const indexOfLastPost = currentPage * newsPerPage;
  const indexOfFirstPost = indexOfLastPost - newsPerPage;
  const currentPosts = sortedResults.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(sortedResults.length / newsPerPage);

  // Hàm thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Hàm hiển thị số trang
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5; // Số lượng nút trang tối đa
    let startPage = Math.max(currentPage - Math.floor(maxPageNumbers / 2), 1);
    let endPage = startPage + maxPageNumbers - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(endPage - maxPageNumbers + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  return (
    <div className="search-results-page">
      <h2 className="search-results-page__title">Kết Quả Tìm Kiếm</h2>
      {currentPosts.length > 0 ? (
        <div className="search-results-page__post-list">
          {currentPosts.map((post) => (
            <RoomPost key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <p className="search-results-page__no-result">Không tìm thấy bài đăng nào.</p>
      )}

      {/* Phân trang */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination__button"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            Previous
          </button>

          {getPageNumbers().map((number) => (
            <button
              key={number}
              className={`pagination__button ${currentPage === number ? 'active' : ''}`}
              onClick={() => paginate(number)}
            >
              {number}
            </button>
          ))}

          <button
            className="pagination__button"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;