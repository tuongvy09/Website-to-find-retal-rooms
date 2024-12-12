import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createNews } from "../../../../redux/newsAPI";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import "./NewsForm.css";
import axios from "axios";
import { createAxios } from "../../../../createInstance";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Để hiển thị thông báo Toast
import "react-toastify/dist/ReactToastify.css"; // Thêm CSS cho Toast

const NewsForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState(null);
  const [imagePreview, setImagePreview] = useState(""); // To store the preview URL of the image
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const accessToken = currentUser?.accessToken;
  let axiosJWT = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true,
  });
  axiosJWT = createAxios(currentUser, dispatch);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra form: đảm bảo tất cả các trường cần thiết đã được điền đầy đủ
    if (!title || !description || !content || !author) {
      setErrorMessage("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("content", content);
    formData.append("author", author);

    if (imageUrl) {
      formData.append("imageUrl", imageUrl);
    }

    try {
      await dispatch(createNews(formData, accessToken, axiosJWT));
      setErrorMessage(""); // Xóa thông báo lỗi khi gửi thành công

      // Hiển thị thông báo thành công bằng toast
      toast.success("Tin tức đã được thêm thành công!");

      // Chuyển hướng đến danh sách tin tức
      navigate("/manage-news"); // Đảm bảo '/news-list' là đường dẫn đến trang danh sách tin tức
    } catch (error) {
      setErrorMessage("Đã có lỗi xảy ra. Vui lòng thử lại!");
      toast.error("Đã có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const quillRef = React.useRef(null);

  React.useEffect(() => {
    const quill = new Quill(quillRef.current, {
      theme: "snow",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, 4, false] }],
          ["bold", "italic", "underline"],
          ["image", "video"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ font: [] }, { size: ["small", "medium", "large", "huge"] }],
          [{ align: [] }],
          [{ color: [] }, { background: [] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ indent: "-1" }, { indent: "+1" }],
          ["link", "blockquote", "code-block"],
          ["clean"],
        ],
      },
    });

    quill.on("text-change", () => {
      setContent(quill.root.innerHTML);
    });
  }, []);

  // Handle image upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageUrl(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  return (
    <div className="news-form-container">
      <div className="form-content">
        <div className="news-details-form">
          <h2>Chi tiết tin tức</h2>
          <div className="cover-upload">
            <h2 className="cover-title">Thêm trang bìa</h2>
            <div className="conver-image">
              <div className="image-preview">
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" />
                ) : (
                  <p className="image-waiting">
                    <img
                      src={require("../../../../assets/images/home.png")}
                      alt="Preview"
                    />
                  </p>
                )}
              </div>
              <label htmlFor="image" className="cover-placeholder">
                <span>Thêm trang bìa</span>
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  className="cover-url-input"
                />
              </label>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <div className="form-group">
              <label>Tiêu đề:</label>
              <input
                type="text"
                placeholder="Tiêu đề"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Mô tả:</label>
              <textarea
                placeholder="Mô tả ngắn"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Tác giả:</label>
              <input
                type="text"
                placeholder="Tác giả"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Nội dung:</label>
              <div
                className="quill-content"
                ref={quillRef}
                style={{ height: "300px" }}
              />
            </div>
            <div className="news-btn">
              {" "}
              <button type="submit" className="submit-button">
                Thêm tin
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewsForm;
