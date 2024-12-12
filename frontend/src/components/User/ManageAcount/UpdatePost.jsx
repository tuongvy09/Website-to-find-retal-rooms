import { Box, Button, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getPostDetail, updatePost } from '../../../redux/postAPI';
import './UpdatePost.css';

const UpdatePost = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [area, setArea] = useState("");
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const accessToken = currentUser?.accessToken;
  const [typePrice, setTypePrice] = useState('1');
  const [areaError, setAreaError] = useState('');

  const handleUpdatePostData = async () => {
    const postData = {
      title,
      content,
      rentalPrice,
      typePrice,
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
        setError("Lỗi khi lấy chi tiết bài đăng");
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

  const handleCurrencyChange = (e) => {
    setTypePrice(e.target.value);
  };

  const handleAreaChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;

    if (value === '' || regex.test(value)) {
      setArea(value);
      setAreaError('');
    } else {
      setAreaError('Diện tích phải là số thực không âm');
    }
  };

  const handleRentalPriceChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;

    if (value === '' || regex.test(value)) {
      setRentalPrice(value);
      setError('');
    } else {
      setError('Giá cho thuê phải là số thực không âm');
    }
  };

  return (
    <div className="container-updatepost">
      <Typography className="update-post-title">Chỉnh sửa bài đăng</Typography>
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

      <div className='update-post-container-area-price'>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '48%',
          }}
        >
          <TextField
            id="outlined-basic"
            label="Giá cho thuê"
            variant="outlined"
            size="small"
            value={rentalPrice}
            onChange={handleRentalPriceChange}
            inputProps={{
              inputMode: 'decimal',
              pattern: '\\d+(\\.\\d{1,2})?',
              step: '0.01',
            }}
            error={!!error}
          />
          <FormControl variant="outlined" sx={{ minWidth: '120px', marginLeft: 1 }}>
            <InputLabel id="currency-label"></InputLabel>
            <Select
              labelId="currency-label"
              size="small"
              id="currency-select"
              value={typePrice}
              onChange={handleCurrencyChange}
            >
              <MenuItem value="1">Triệu/tháng</MenuItem>
              <MenuItem value="2">Triệu/m²/tháng</MenuItem>
            </Select>
          </FormControl>
          {error && (
            <FormHelperText error sx={{ marginLeft: 1 }}>
              {error}
            </FormHelperText>
          )}
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            width: '48%',
          }}
        >
          <TextField
            id="outlined-basic"
            label="Diện tích"
            variant="outlined"
            size="small"
            fullWidth
            value={area}
            onChange={handleAreaChange}
            inputProps={{
              min: 0,
              pattern: '\\d+(\\.\\d{1,2})?',
              step: '0.01',
            }}
            error={!!areaError}
          />
          <TextField
            id="area-field"
            variant="outlined"
            size="small"
            value="m²"
            InputProps={{ readOnly: true }}
            sx={{ backgroundColor: '#f0f0f0', marginLeft: 1, maxWidth: '80px' }}
          />
          {areaError && <FormHelperText error sx={{ marginLeft: 1 }}>{areaError}</FormHelperText>}
        </Box>
      </div>
      <div>
        <Button
          className="manage-update-post-btn-confirm"
          onClick={handleUpdatePostData}
        >
          Cập nhật
        </Button>
      </div>
    </div>
  );
};

export default UpdatePost;
