import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { getPostDetail, updatePost } from "../../../redux/postAPI";
import "./UpdatePost.css";

const UpdatePost = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rentalPrice, setRentalPrice] = useState("");
  const [area, setArea] = useState("");
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const accessToken = currentUser?.accessToken;
  const [typePrice, setTypePrice] = useState("1");
  const [areaError, setAreaError] = useState("");

  const quillRef = useRef(null);

  useEffect(() => {
    if (quillRef.current && content) {
      // Kiểm tra quillRef và content
      const quill = new Quill(quillRef.current, {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, 4, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["image", "video"],
            [{ font: [] }, { size: ["small", "medium", "large", "huge"] }],
            [{ align: [] }],
            ["link", "blockquote", "code-block"],
            ["clean"],
          ],
        },
      });

      // Cập nhật nội dung khi có sự thay đổi trong editor
      quill.on("text-change", () => {
        setContent(quill.root.innerHTML);
      });

      // Đặt nội dung ban đầu cho editor nếu có sẵn
      quill.root.innerHTML = content;

      return () => {
        quillRef.current = null;
      };
    }
  }, [content]);

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

  const handleCurrencyChange = (e) => {
    setTypePrice(e.target.value);
  };

  const handleAreaChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;

    if (value === "" || regex.test(value)) {
      setArea(value);
      setAreaError("");
    } else {
      setAreaError("Diện tích phải là số thực không âm");
    }
  };

  const handleRentalPriceChange = (e) => {
    const value = e.target.value;
    const regex = /^[0-9]*\.?[0-9]*$/;

    if (value === "" || regex.test(value)) {
      setRentalPrice(value);
      setError("");
    } else {
      setError("Giá cho thuê phải là số thực không âm");
    }
  };

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>Đang tải...</div>; // Chờ dữ liệu bài đăng
  }

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

      <Typography className="title3">Nội dung miêu tả</Typography>
      <div ref={quillRef} style={{ height: "300px" }} />
      <div className="update-post-container-area-price">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            width: "48%",
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
              inputMode: "decimal",
              pattern: "\\d+(\\.\\d{1,2})?",
              step: "0.01",
            }}
            error={!!error}
          />
          <FormControl
            variant="outlined"
            sx={{ minWidth: "120px", marginLeft: 1 }}
          >
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
            display: "flex",
            alignItems: "center",
            width: "48%",
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
              pattern: "\\d+(\\.\\d{1,2})?",
              step: "0.01",
            }}
            error={!!areaError}
          />
          <TextField
            id="area-field"
            variant="outlined"
            size="small"
            value="m²"
            InputProps={{ readOnly: true }}
            sx={{ backgroundColor: "#f0f0f0", marginLeft: 1, maxWidth: "80px" }}
          />
          {areaError && (
            <FormHelperText error sx={{ marginLeft: 1 }}>
              {areaError}
            </FormHelperText>
          )}
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