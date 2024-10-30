
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

