import { Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllPosts } from '../../../redux/postAPI';
import './ManagePosts.css';
import RoomPostManage from './RoomPostManage';

const ManagePosts = () => {
    const [allPosts, setAllPosts] = useState([]); // Tất cả bài đăng
    const currentUser = useSelector((state) => state.auth.login.currentUser); // Người dùng hiện tại từ Redux
    const token = currentUser?.accessToken; // Lấy token từ Redux

    const navigate = useNavigate();

    const handleTitleClick = (id) => {
        navigate(`/post/${id}`); // Điều hướng khi nhấn vào tiêu đề
    };

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const data = await getAllPosts(token); // Gọi API lấy bài viết

                const formattedPosts = data.map(post => ({
                    id: post.id,
                    address: {
                        province: post.address?.province || '',
                        district: post.address?.district || '',
                    },
                    title: post.title || '',
                    content: post.content || '',
                    contactInfo: {
                        username: post.contactInfo?.username || '',
                        phoneNumber: post.contactInfo?.phoneNumber || '',
                    },
                    rentalPrice: post.rentalPrice,
                    area: post.area,
                    status: post.status,
                    images: post.images ? post.images.slice(0, 2) : [], // Chỉ hiển thị 2 ảnh đầu tiên
                }));

                setAllPosts(formattedPosts); // Lưu tất cả bài đăng vào state
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ API:', error);
            }
        };

        fetchAllPosts(); // Lấy dữ liệu khi component mount
    }, [token]);

    return (
        <div className="all-posts-list">
            {/* Hiển thị bài đăng */}
            {allPosts.length > 0 ? (
                allPosts.map((post, index) => (
                    <RoomPostManage key={index} post={post} onTitleClick={handleTitleClick} />
                ))
            ) : (
                // Nếu không có bài đăng, hiển thị thông báo
                <div className='container-nocontent'>
                    <Typography>Bạn chưa có tin đăng nào</Typography>
                </div>
            )}
        </div>
    );
};

export default ManagePosts;
