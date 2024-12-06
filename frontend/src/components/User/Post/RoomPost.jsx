import { Box, Button, Card, CardContent, CardMedia, Typography } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import React from 'react';
import './RoomPost.css';

const RoomPost = ({ post, onTitleClick, onToggleFavorite, isFavorite }) => {
  const handleFavoriteClick = () => {
    onToggleFavorite(post.id); 
  };

  return (
    <Card className="room-post-card">
      <Box className="room-post-images">
        {/* Chỉ hiển thị ảnh đầu tiên */}
        {post.images && post.images[0] && (
          <CardMedia
            component="img"
            image={post.images[0]} 
            alt="Room image"
            className="room-post-image"
          />
        )}
        <button className="room-post-price">{post.rentalPrice}</button>
      </Box>
      <CardContent className="room-post-content">
        <Box>
          <Typography className="room-post-title" onClick={() => onTitleClick(post.id)}>
            {post.title}
          </Typography>
          <Typography variant="body2" className="room-post-location">
            {post.address.district}, {post.address.province}
          </Typography>
        </Box>
        <Box>
          <Button className="post-area">{post.area}</Button>
        </Box>
      </CardContent>
      <Box className="favorite-icon" onClick={handleFavoriteClick}>
        {isFavorite ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
      </Box>
    </Card>
  );
};

export default RoomPost;
