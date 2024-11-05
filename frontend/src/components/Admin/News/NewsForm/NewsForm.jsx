import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNews } from '../../../../redux/newsAPI';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './NewsForm.css';
import axios from 'axios';
import { createAxios } from '../../../../createInstance';

const NewsForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const [author, setAuthor] = useState(''); 
    const [imageUrl, setImageUrl] = useState('');
    const dispatch = useDispatch();
    const currentUser = useSelector((state) => state.auth.login.currentUser); 
    const accessToken = currentUser?.accessToken;
    let axiosJWT = axios.create({
    baseURL: "http://localhost:8000",
    withCredentials: true
    });
    axiosJWT = createAxios(currentUser, dispatch);

    const handleSubmit = (e) => {
        e.preventDefault();
        const newsData = { title, description, content, author, imageUrl };
        // createNews(newsData, dispatch); 
        dispatch(createNews(newsData, accessToken, axiosJWT));
    };

    const quillRef = React.useRef(null);

    React.useEffect(() => {
        const quill = new Quill(quillRef.current, {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, false] }],
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

    return (
        <form onSubmit={handleSubmit} className="news-form">
            <h2>Thêm Tin Tức Mới</h2>
            
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

            <label>
                URL Hình ảnh (tuỳ chọn):
                <input
                    type="text"
                    placeholder="URL Hình ảnh"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                />
            </label>

            <label>Nội dung:</label>
            <div ref={quillRef} style={{ height: '300px' }} />

            <button type="submit">Thêm Tin Tức</button>
        </form>
    );
};

export default NewsForm;