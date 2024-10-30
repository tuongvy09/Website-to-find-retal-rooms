import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Avatar, Box, Button, Card, CardContent, CardMedia, IconButton, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApprovedPosts } from '../../../redux/postAPI';
import './RoomPost.css';

const RoomPost = () => {
  const [approvedPosts, setApprovedPosts] = useState([]);
  const navigate = useNavigate();

  const handleTitleClick = (id) => {
    navigate(`/post/${id}`); // Chuyển hướng tới trang chi tiết bài đăng
  };

  useEffect(() => {
    const fetchApprovedPosts = async () => {
      try {
        const response = await getApprovedPosts();
        const data = response.data;
        console.log("Response Data:", data);

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
          images: post.images ? post.images.slice(0, 2) : [], // Giới hạn số lượng ảnh hiển thị
        }));

        setApprovedPosts(formattedPosts);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu từ API:', error);
      }
    };

    fetchApprovedPosts();
  }, []);

  if (approvedPosts.length === 0) return <div>Loading...</div>;

  return (
    <div className="approved-posts-list">
      {approvedPosts.map((post, index) => (
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
              <Button variant="outlined" color="primary" className="room-post-button">
                Gọi {post.contactInfo.phoneNumber}
              </Button>
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

export default RoomPost;
