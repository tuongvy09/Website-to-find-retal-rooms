// src/api/postAPI.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/v1/posts/'; // Thay thế bằng URL API của bạn

export const createPost = async (postData, token) => {
    const response = await axios.post(API_URL, postData, {
      headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'application/json',
      },
    });
    console.log("Response status:", response.status);
    console.log("Response data:", response.data);
    // Chỉ log lỗi và ném ra khi trạng thái khác 200 hoặc 201
    if (response.status === 201 || response.status === 200) {
      return response; 
    } else {
      throw new Error('Unexpected response status: ' + response.status);
    }
}

export const getAllPosts = async () => {
  try {
      const response = await axios.get(`${API_URL}posts`);
      return response.data; // Return the data from the response
  } catch (error) {
      throw new Error(error.message); // Throw an error if the request fails
  }
};

export const getApprovedPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}posts-by-status?status=approved`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getPostDetail = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/posts`); // Gọi API để lấy chi tiết bài đăng
    return response; // Trả về response để có thể truy cập dữ liệu
  } catch (error) {
    console.error('Lỗi khi gọi API lấy chi tiết bài đăng:', error);
    throw error; // Ném lỗi ra ngoài để xử lý
  }
};


