
import axios from 'axios';

const API_URL = 'http://localhost:8000/v1/posts/'; // Thay thế bằng URL API của bạn

export const createPost = async (postData, token) => {
  const response = await axios.post(API_URL, postData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
  console.log("Response status:", response.status);
  console.log("Response data:", response.data);
  if (response.status === 201 || response.status === 200) {
    return response;
  } else {
    throw new Error('Unexpected response status: ' + response.status);
  }
}

export const getAllPosts = async (token, page = 1, limit = 10) => { 
  try {
    const response = await axios.get(`${API_URL}posts`, {
      params: { page, limit },
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    throw new Error(error.message); 
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
    const response = await axios.get(`${API_URL}posts/${id}`);
    return response;
  } catch (error) {
    console.error('Lỗi khi gọi API lấy chi tiết bài đăng:', error);
    throw error;
  }
};

export const getUserPostsByStateAndVisibility = async (status, visibility, token) => {
  try {
    const response = await axios.get(`${API_URL}list-post-pending`, {
      params: { status, visibility },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Lỗi khi gọi API lấy bài đăng của người dùng theo trạng thái và visibility:', error);
    throw error;
  }
};

export const togglePostVisibility = async (postId, token) => {
  try {
    const response = await axios.put(`${API_URL}toggle-visibility/${postId}`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Lỗi khi gọi API thay đổi trạng thái hiển thị bài viết:', error);
    throw error;
  }
};

export const deletePost = async (postId, token) => {
  try {
      const response = await axios.delete(`${API_URL}posts/${postId}`, {
          headers: {
              Authorization: `Bearer ${token}`,
          },
      });
      return response.data; 
  } catch (error) {
      throw error;
  }
};

export const updatePost = async (postId, postData, token) => {
  try {
    const response = await axios.put(
      `${API_URL}update/${postId}`,
      postData, 
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Lỗi khi cập nhật bài đăng:', error);
    throw error;
  }
};

export const searchPosts = async (params, token) => {
  try {
    const response = await axios.get(`${API_URL}search`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Trả về danh sách bài đăng tìm kiếm
  } catch (error) {
    throw new Error(error.message);
  }
};

export const getPostCountByDateRange = async (startDate, endDate, token) => {
  try {
    const response = await axios.get(`${API_URL}by-date`, {
      params: { startDate, endDate },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Trả về dữ liệu thống kê số lượng bài đăng theo ngày
  } catch (error) {
    console.error('Lỗi khi gọi API thống kê số lượng bài đăng theo ngày:', error);
    throw error;
  }
};

// Get top categories with the most posts
export const getTopCategories = async (token) => {
  try {
    const response = await axios.get(`${API_URL}top-categories`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Trả về danh sách 7 loại hình cho thuê có nhiều bài đăng nhất
  } catch (error) {
    console.error('Lỗi khi gọi API thống kê 7 loại hình cho thuê nhiều bài đăng nhất:', error);
    throw error;
  }
};

// Get top provinces with the most posts
export const getTopProvinces = async (token) => {
  try {
    const response = await axios.get(`${API_URL}top-provinces`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; // Trả về danh sách 7 tỉnh/thành phố có nhiều bài đăng nhất
  } catch (error) {
    console.error('Lỗi khi gọi API thống kê 7 tỉnh/thành phố nhiều bài đăng nhất:', error);
    throw error;
  }
};