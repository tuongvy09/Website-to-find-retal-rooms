import { Avatar, Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Slider from 'react-slick';
import { getPostDetail } from '../../../redux/postAPI'; // Thay thế bằng đường dẫn thực tế

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './PostDetail.css'; // Tạo file CSS riêng nếu cần

const PostDetail = () => {
  const { id } = useParams();
  console.log("isposts:", id);
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await getPostDetail(id); // Gọi API để lấy chi tiết bài đăng
        console.log("Response Data:", response);
        setPost(response.data); // Giả sử response.data là bài đăng
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết bài đăng:', error);
      }
    };

    fetchPostDetail();
  }, [id]);

  if (!post) return <div>Loading...</div>; // Hiển thị loading nếu chưa có dữ liệu

  // Cấu hình cho slider
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="post-detail-container">
      {/* Slider hình ảnh */}
      <Slider {...sliderSettings}>
        {post.images.map((image, index) => (
          <div key={index}>
            <CardMedia
              component="img"
              image={`http://localhost:3000/${image}`} // Đường dẫn hình ảnh
              alt={`Post image ${index + 1}`}
              className="post-detail-image"
            />
          </div>
        ))}
      </Slider>

      {/* Thông tin chi tiết bài đăng */}
      <Card className="post-detail-card">
        <CardContent>
          <Typography variant="h4" className="post-detail-title">{post.title}</Typography>
          <Typography variant="body2" className="post-detail-address">
            {post.address.exactaddress}, {post.address.district}, {post.address.province}
          </Typography>
          <Typography variant="body1" className="post-detail-rental-price">{post.rentalPrice} VND</Typography>
          <Typography variant="body2" className="post-detail-area">{post.area} m²</Typography>
          <Typography variant="body2" className="post-detail-description">{post.content}</Typography>

          {/* Thông tin bổ sung */}
          <Typography variant="body2" className="post-detail-category">Loại bất động sản: {post.category}</Typography>
          <Typography variant="body2" className="post-detail-rental-target">Mục tiêu cho thuê: {post.rentalTarget}</Typography>
          <Typography variant="body2" className="post-detail-max-occupants">Số người tối đa: {post.maxOccupants}</Typography>
          {post.youtubeLink && (
            <Typography variant="body2" className="post-detail-youtube-link">
              Video: <a href={post.youtubeLink} target="_blank" rel="noopener noreferrer">{post.youtubeLink}</a>
            </Typography>
          )}

          {/* Thông tin liên hệ */}
          <Box className="post-detail-contact">
            <Avatar>{post.contactInfo.username.charAt(0)}</Avatar>
            <Typography variant="body2">{post.contactInfo.username}</Typography>
            <Button variant="outlined" color="primary">
              Gọi {post.contactInfo.phoneNumber}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default PostDetail;
