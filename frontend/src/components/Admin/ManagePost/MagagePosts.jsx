import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Avatar, Box, Button, Card, CardContent, CardMedia, IconButton, MenuItem, Select, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllPosts } from '../../../redux/postAPI';
import './ManagePosts.css';

const ManagePosts = () => {
    const [allPosts, setAllPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [statusFilter, setStatusFilter] = useState("");
    const navigate = useNavigate();

    const handleTitleClick = (id) => {
        navigate(`/post/${id}`); // Chuyển hướng tới trang chi tiết bài đăng
    };

    useEffect(() => {
        const fetchAllPosts = async () => {
            try {
                const data = await getAllPosts();

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
                    images: post.images ? post.images.slice(0, 2) : [], // Giới hạn số lượng ảnh hiển thị
                }));

                setAllPosts(formattedPosts); // Cập nhật trạng thái
                setFilteredPosts(formattedPosts);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu từ API:', error);
            }
        };

        fetchAllPosts();
    }, []);

    if (allPosts.length === 0) return <div>Loading...</div>;

    const handleChange = (event) => {
        const selectedStatus = event.target.value;
        setStatusFilter(selectedStatus);

        if (selectedStatus) {
            const filtered = allPosts.filter(post => post.status === selectedStatus);
            setFilteredPosts(filtered);
        } else {
            // Show all posts if no specific status is selected
            setFilteredPosts(allPosts);
        }
    };

    return (
        <div className="approved-posts-list">
            <div className='filter'>
                <Select
                    value={statusFilter}
                    onChange={handleChange}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Without label' }}
                    className='filter-status'
                >
                    <MenuItem value="">
                        <em>Status</em>
                    </MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="approved">Approved</MenuItem>
                    <MenuItem value="rejected">Rejected</MenuItem>
                </Select>

            </div>
            {filteredPosts.map((post, index) => (
                <Card key={index} className="room-post-card">
                    <Box className="room-post-images">
                        {post.images.map((image, imgIndex) => (
                            <CardMedia
                                key={imgIndex}
                                component="img"
                                image={image}
                                alt={`Room image ${imgIndex + 1}`}
                                className="room-post-image"
                            />
                        ))}
                    </Box>
                    <CardContent className="room-post-content">
                        <Typography className="room-post-title" onClick={() => handleTitleClick(post.id)}>{post.title}</Typography>
                        <Box className="room-post-info">
                            <Typography variant="body1" className="room-post-price">{post.rentalPrice}</Typography>
                            <Typography variant="body2" className="room-post-price">{post.area}</Typography>
                        </Box>
                        <Typography variant="body2" className="room-post-location">
                            {post.address.district}, {post.address.province}
                        </Typography>
                        <Typography variant="body2" className="room-post-description">{post.content}</Typography>
                        <Box className="room-post-contact">
                            <Avatar className="room-post-avatar">{post.contactInfo.username.charAt(0)}</Avatar>
                            <Typography variant="body2" className="room-post-username">{post.contactInfo.username}</Typography>
                            <Box className="button-group">
                            <Button variant="outlined" color="primary" className="room-post-button">
                                Gọi {post.contactInfo.phoneNumber}
                            </Button>
                            <Button variant='outlined'>{post.status}</Button>
                            </Box>
                        </Box>
                    </CardContent>
                    <IconButton className="room-post-favorite-button">
                        <FavoriteBorderIcon />
                    </IconButton>
                </Card>
            ))}
        </div>
    );
};

export default ManagePosts;