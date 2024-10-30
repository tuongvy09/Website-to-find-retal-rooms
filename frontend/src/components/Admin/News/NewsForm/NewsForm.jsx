import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { createNews } from '../../../../redux/newsAPI';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';
import './NewsForm.css';

const NewsForm = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [content, setContent] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        const newsData = { title, description, content };
        createNews(newsData, dispatch);
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
            setContent(quill.root.innerHTML); // Cập nhật nội dung khi có thay đổi
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

            <label>Nội dung:</label>
            <div ref={quillRef} style={{ height: '300px' }} />

            <button type="submit">Thêm Tin Tức</button>
        </form>
    );
};

export default NewsForm;