import { Button, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getPostDetail, updatePost } from '../../../redux/postAPI';
import './UpdatePost.css';

const UpdatePost = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [rentalPrice, setRentalPrice] = useState('');
  const [area, setArea] = useState('');
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const accessToken = currentUser?.accessToken;

  const handleUpdatePostData  = async () => {
    const postData = {
      title,
      content,
      rentalPrice,
      area,
    };

    try {
      const updatedPost = await updatePost(postId, postData, accessToken);
      console.log("Cập nhật bài đăng thành công!");
    } catch (error) {
      setError("Cập nhật bài đăng thất bại");
    }
  };

  useEffect(() => {
    const fetchPostDetail = async () => {
      try {
        console.log("Fetching post detail with ID:", postId);
        const postData = await getPostDetail(postId);
        setPost(postData.data);
      } catch (error) {
        setError('Lỗi khi lấy chi tiết bài đăng');
      }
    };

    if (postId) {
      fetchPostDetail();
    }
  }, [postId]);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setContent(post.content);
      setRentalPrice(post.rentalPrice);
      setArea(post.area);
    }
  }, [post]);

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Đang tải...</div>; // Chờ dữ liệu bài đăng
  }

  const handleUpdatePost = () => {
    const updatedPost = {
      title,
      content,
      rentalPrice,
      area,
    };
    console.log("Dữ liệu cập nhật:", updatedPost);
    // Thực hiện API call hoặc dispatch Redux để cập nhật bài đăng
  };

  return (
    <div className='container-updatepost'>
      <h2>Chỉnh sửa bài đăng</h2>

      <div>
        <TextField
          label="Tiêu đề"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
        />
      </div>

      <div>
        <TextField
          label="Nội dung"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          fullWidth
          multiline
          rows={7}
        />
      </div>

      <div>
        <TextField
          label="Giá cho thuê"
          value={rentalPrice}
          onChange={(e) => setRentalPrice(e.target.value)}
          fullWidth
        />
      </div>

      <div>
        <TextField
          label="Diện tích"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          fullWidth
        />
      </div>

      <div>
        <Button variant="contained" color="primary" onClick={handleUpdatePost}>
          Cập nhật
        </Button>
      </div>
    </div>
  );
};

export default UpdatePost;
