import React, { useState } from 'react';
import NewsBreadcrumbs from '../NewsBreadcrumbs/NewsBreadcrumbs';
import NewsList from '../NewsList/NewsList';
import NewsForm from '../NewsForm/NewsForm';
import './NewsManagement.css';

const NewsManagement = () => {
    const [view, setView] = useState('getAllNews');
    console.log(view)
    return (
        <div className="news-management">
            <div className="sidebar">
                <ul>
                    <li className={view === 'getAllNews' ? 'active' : ''} onClick={() => setView('getAllNews')}>
                        Danh sách tin tức
                    </li>
                    <li className={view === 'addNews' ? 'active' : ''} onClick={() => setView('addNews')}>
                        Thêm tin tức
                    </li>
                </ul>
            </div>

            <div className="content">
                <NewsBreadcrumbs current={view === 'getAllNews' ? 'Danh sách tin tức' : 'Thêm tin tức'} />
                {view === 'getAllNews' ? <NewsList /> : <NewsForm />}
            </div>
        </div>
    );
};

export default NewsManagement;