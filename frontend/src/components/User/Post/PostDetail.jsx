import Diversity3OutlinedIcon from '@mui/icons-material/Diversity3Outlined';
import EmailIcon from '@mui/icons-material/Email';
import HouseOutlinedIcon from '@mui/icons-material/HouseOutlined';
import LocalPhoneIcon from '@mui/icons-material/LocalPhone';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import PeopleOutlineOutlinedIcon from '@mui/icons-material/PeopleOutlineOutlined';
import RoomOutlinedIcon from '@mui/icons-material/RoomOutlined';
import { Avatar, Box, Button, Card, Divider, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography, Rating } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPostDetail, getReviewsByPostId, createReview } from '../../../redux/postAPI';
import { useDispatch, useSelector } from 'react-redux';
import { setReviews } from '../../../redux/reviewSlice';
import ReviewsList from '../Review/ReviewList/ReviewsList';
import Header from '../Header/Header';
import './PostDetail.css';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';
import './PostDetail.css'; // Tạo file CSS riêng nếu cần

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reviewContent, setReviewContent] = useState(''); 
  const [rating, setRating] = useState(0);
  const { reviews, loading, error } = useSelector((state) => state.reviews);
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        const response = await getPostDetail(id);
        console.log("Response Data:", response);
        setPost(response.data);
      } catch (error) {
        console.error('Lỗi khi lấy chi tiết bài đăng:', error);
      }
    };

    fetchPostDetail();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await getReviewsByPostId(id);
        dispatch(setReviews(response.data));
      } catch (error) {
        console.error('Lỗi khi lấy đánh giá:', error);
      }
    };

    fetchReviews();
  }, [id]);

  useEffect(() => {
    console.log("Dữ liệu reviews hiện tại:", reviews); 
  }, [reviews]);

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % post.images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + post.images.length) % post.images.length);
  };

  const handleAddReview = async () => {
    // Kiểm tra nếu rating hoặc reviewContent không được nhập
    if (rating === 0 || reviewContent === "") {
      alert("Vui lòng chọn sao và nhập bình luận");
      return;
    }
  
    try {
      // Lấy token từ Redux
      const token = currentUser?.accessToken; // Token được lưu trong Redux
  
      if (!token) {
        alert("Bạn cần đăng nhập để thực hiện đánh giá");
        return;
      }
  
      const newReview = {
        comment: reviewContent,
        rating, 
      };
  
      const response = await createReview(id, newReview, token); 
  
      // Thêm đánh giá mới vào danh sách và cập nhật Redux 
      dispatch(setReviews([...reviews, response])); 
  
      // Reset form sau khi thêm thành công
      setReviewContent("");
      setRating(0);
      alert("Đánh giá đã được thêm thành công!");
    } catch (error) {
      console.error("Lỗi khi thêm đánh giá:", error);
      alert("Lỗi khi thêm đánh giá. Vui lòng thử lại sau.");
    }
  };  

  if (!post) return <div>Loading...</div>;

  return (
    <div className="post-detail-container">
      <Header />
      {post.images && post.images.length > 0 && (
        <div className="image-gallery">
          <img
            src={post.images[currentIndex]}
            alt={`Post image ${currentIndex + 1}`}
            className="post-detail-image"
          />
          <button className="prev-btn" onClick={prevImage}>←</button>
          <button className="next-btn" onClick={nextImage}>→</button>
        </div>
      )}

      <Box className="container-content-detail">
        <Box className="container-left">
          <Box className="container-cost">
            <Typography className='post-title'>{post.title}</Typography>
            <Button className="room-post-price">{post.rentalPrice}</Button>
          </Box>
          <Button
            startIcon={<RoomOutlinedIcon />}
            className='address-detail'
          >
            {post.address.exactaddress} {post.address.ward} {post.address.district} {post.address.province}
          </Button>
          <Typography className='post-content'>{post.content}</Typography>
          <TableContainer component={Paper} className='container-table'>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className='title-cell'> <HouseOutlinedIcon className='style-icon' /> Loại hình cho thuê</TableCell>
                  <TableCell>{post.category}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='title-cell'> <Diversity3OutlinedIcon className='style-icon' /> Số người tối đa</TableCell>
                  <TableCell>{post.maxOccupants}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='title-cell'> <PeopleOutlineOutlinedIcon className='style-icon' />Đối tượng cho thuê</TableCell>
                  <TableCell>{post.rentalTarget}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className='title-cell'> <MapOutlinedIcon className='style-icon' /> Diện tích</TableCell>
                  <TableCell>{post.area}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box className="container-right">
          <Card className='card-info'>
            <Box className='container-contactinfo'>
              <Avatar className="room-post-avatar">{post.contactInfo.username.charAt(0)}</Avatar>
              <Typography className="room-post-username">{post.contactInfo.username}</Typography>
            </Box>
            <Divider></Divider>
            <Button variant="outlined" className="room-post-button">
              <LocalPhoneIcon className='style-icon'/> {post.contactInfo.phoneNumber}
            </Button>
            <Button variant="outlined" className="room-post-button">
              <EmailIcon className='style-icon'/> Gửi tin nhắn
            </Button>
          </Card>
        </Box>
      </Box>

      <Box className="reviews-section">
        <Typography variant="h5" className="reviews-title">Reviews</Typography>
        {loading ? (
          <p>Loading reviews...</p>
        ) : error ? (
          <p>Error loading reviews</p>
        ) : (
          <ReviewsList postId={post._id} />
        )}


      <Box className="add-review-form">
      <Typography variant="h6" gutterBottom>
        Thêm đánh giá
      </Typography>

      {/* Hiển thị 5 ngôi sao */}
      <Box>
        <Rating
          name="rating"
          value={rating}
          onChange={(event, newValue) => setRating(newValue)}
          precision={0.5} // Chọn sao theo mức độ chính xác, có thể chọn 0.5 sao
          size="large"
        />
      </Box>

      {/* Khung nhập bình luận */}
      <TextField
        label="Thêm bình luận"
        multiline
        rows={4}
        value={reviewContent}
        onChange={(e) => setReviewContent(e.target.value)}
        fullWidth
        variant="outlined"
        margin="normal"
      />

      {/* Nút thêm đánh giá */}
      <Button
        variant="contained"
        color="primary"
        onClick={handleAddReview}
        className="add-review-btn"
      >
        Thêm đánh giá
      </Button>
    </Box>
      </Box>
    </div>
  );
};

export default PostDetail;