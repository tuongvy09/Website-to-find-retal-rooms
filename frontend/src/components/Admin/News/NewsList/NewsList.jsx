import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllNews } from "../../../../redux/newsAPI";
import {
  deleteNewsFailed,
  deleteNewsStart,
  deleteNewsSuccess,
} from "../../../../redux/newsSlice";
import NewsDetail from "../NewsDetail/NewsDetail";
import "./NewsList.css";

const NewsList = () => {
  const dispatch = useDispatch();
  const { newsList, isFetching, error } = useSelector((state) => state.news);
  const [selectedNews, setSelectedNews] = useState(null);
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [currentPage, setCurrentPage] = useState(1);
  const newsPerPage = 6;

  const accessToken = localStorage.getItem("accessToken");
  const axiosJWT = axios.create({
    baseURL: "http://localhost:8000",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  useEffect(() => {
    getAllNews(accessToken, dispatch, axiosJWT);
  }, [accessToken, dispatch]);

  useEffect(() => {
    console.log("selectedNews updated:", selectedNews);
  }, [selectedNews]); // Khi selectedNews thay đổi

  const navigate = useNavigate();

  const handleNewsClick = (news) => {
    console.log("News clicked:", news);
    navigate(`/manage-news/${news._id}`);
    setSelectedNews(news);
  };

  const handleDelete = async (newsId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tin tức này không?")) {
      dispatch(deleteNewsStart());
      try {
        await axiosJWT.delete(`/v1/news/${newsId}`);
        dispatch(deleteNewsSuccess(newsId));
        toast.success("Xóa tin tức thành công!");
        setSelectedNews(null); // Đặt lại selectedNews để quay lại danh sách
        // Tùy chọn, gọi lại để lấy danh sách tin tức đã cập nhật
        getAllNews(accessToken, dispatch, axiosJWT);
      } catch (err) {
        console.error("Lỗi khi xóa tin tức:", err);
        dispatch(deleteNewsFailed());
        toast.error("Xóa tin tức không thành công!");
      }
    }
  };

  const sortedNewsList = [...newsList].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // Tính toán phân trang
  const indexOfLastNews = currentPage * newsPerPage;
  const indexOfFirstNews = indexOfLastNews - newsPerPage;
  const currentNews = sortedNewsList .slice(indexOfFirstNews, indexOfLastNews);
  const totalPages = Math.ceil(sortedNewsList .length / newsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  // Hàm để hiển thị các nút trang với giới hạn
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbers = 5; // Số lượng nút trang tối đa hiển thị
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

  if (isFetching) return <p>Loading...</p>;
  if (error) return <p>Error fetching news.</p>;

  return (
    <div className="news-list-container">
      <ToastContainer />
      {selectedNews ? (
        <NewsDetail
          newSelect={selectedNews}
          onBack={() => setSelectedNews(null)}
          onEdit={() => console.log("Chức năng sửa chưa được cài đặt")}
          onDelete={() => handleDelete(selectedNews?._id)}
        />
      ) : (
        <div>
          <ul className="news-list">
            {currentNews.map((news) => (
              <li
                key={news.id}
                className="news-item"
                onClick={() => handleNewsClick(news)}
              >
                <Link to={`/manage-news/${news._id}`} className="news-link">
                  <img
                    src={`http://localhost:8000${news.imageUrl || "/placeholder.jpg"}`}
                    alt={news.title}
                    className="news-image"
                  />
                  <div className="news-info">
                    <h3 className="news-list-title">{news.title}</h3>
                    <p className="news-list-des">{news.description}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="pagination">
            <button
              onClick={prevPage}
              disabled={currentPage === 1}
              className="pagination-button"
            >
              &laquo; Trước
            </button>
            {getPageNumbers().map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`pagination-button ${currentPage === number ? "active" : ""}`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={nextPage}
              disabled={currentPage === totalPages}
              className="pagination-button"
            >
              Tiếp &raquo;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewsList;