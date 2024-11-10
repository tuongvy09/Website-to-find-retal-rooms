import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNews } from '../../../../redux/newsAPI';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './NewsForm.css';
import axios from 'axios';
import { createAxios } from '../../../../createInstance';
import { useNavigate } from 'react-router-dom'; 
import { toast } from 'react-toastify'; // Để hiển thị thông báo Toast
import 'react-toastify/dist/ReactToastify.css'; // Thêm CSS cho Toast


const NewsForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState(''); 
    const [imageUrl, setImageUrl] = useState(null);
    const [imagePreview, setImagePreview] = useState(''); // To store the preview URL of the image
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.login.currentUser); 
    const accessToken = currentUser?.accessToken;
    let axiosJWT = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true
    });
    axiosJWT = createAxios(currentUser, dispatch);

    const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra form: đảm bảo tất cả các trường cần thiết đã được điền đầy đủ
    if (!title || !description || !content || !author) {
        setErrorMessage('Vui lòng điền đầy đủ thông tin!');
        return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('content', content);
    formData.append('author', author);
    
    if (imageUrl) {
        formData.append('imageUrl', imageUrl);
    }

    try {
        await dispatch(createNews(formData, accessToken, axiosJWT));
        setErrorMessage(''); // Xóa thông báo lỗi khi gửi thành công
        
        // Hiển thị thông báo thành công bằng toast
        toast.success('Tin tức đã được thêm thành công!');

        // Chuyển hướng đến danh sách tin tức
        navigate('/manage-news');  // Đảm bảo '/news-list' là đường dẫn đến trang danh sách tin tức
    } catch (error) {
        setErrorMessage('Đã có lỗi xảy ra. Vui lòng thử lại!');
        toast.error('Đã có lỗi xảy ra. Vui lòng thử lại!');
    }
    };

    const quillRef = React.useRef(null);

    React.useEffect(() => {
        const quill = new Quill(quillRef.current, {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, false] }],
                    ['bold', 'italic', 'underline'],
                    ['image', 'video'],
                    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                    ['clean']
                ]
            },
        });

        quill.on('text-change', () => {
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
          <h1>Thêm thông tin tin tức</h1>
          <div className="form-content">
            <div className="cover-upload">
              <h2 className="cover-title">Thêm trang bìa</h2>
              <label htmlFor="image" className="cover-placeholder">
                <span>Thêm trang bìa</span>
                <input
                  type="file"
                  id="image"
                  onChange={handleImageChange}
                  className="cover-url-input"
                />
              </label>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Preview" />
                </div>
              )}
            </div>
            <form onSubmit={handleSubmit} className="news-details-form">
              <h2>Chi tiết tin tức</h2>
              {errorMessage && <p className="error-message">{errorMessage}</p>}
              <label>
                Tiêu đề:
                <input
                  type="text"
                  placeholder="Tiêu đề"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </label>
              <label>
                Mô tả:
                <textarea
                  placeholder="Mô tả ngắn"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </label>
              <label>
                Tác giả:
                <input
                  type="text"
                  placeholder="Tác giả"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  required
                />
              </label>
              <label>Nội dung:</label>
              <div ref={quillRef} style={{ height: '300px' }} />
              <button type="submit" className="submit-button">Thêm tin</button>
            </form>
          </div>
        </div>
      );
    };
    
    export default NewsForm;