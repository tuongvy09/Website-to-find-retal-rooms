import { 
  Box, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Typography 
} from "@mui/material";
import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createAxios } from "../../../createInstance";
import { getAllUsers } from "../../../redux/apiRequest";
import { loginSuccess } from "../../../redux/authSlice";
import "./ManageUsers.css";

const ManageUsers = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Tạo axiosJWT instance
  let axiosJWT = createAxios(user, dispatch, loginSuccess);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (user?.accessToken) {
      getAllUsers(user.accessToken, dispatch, axiosJWT);
    }
  }, [user, dispatch, axiosJWT, navigate]);

  // Điều hướng tới trang bài đăng của người dùng
  const handleViewPosts = (userId) => {
    navigate(`/user-posts/${userId}`);
  };

  // Hàm khóa/mở khóa tài khoản
  const handleBlockUser = async (userId, isBlocked) => {
    try {
      const response = await axiosJWT.put(
        `/v1/user/block/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${user?.accessToken}` },
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        // Làm mới danh sách người dùng
        getAllUsers(user?.accessToken, dispatch, axiosJWT);
      }
    } catch (error) {
      console.error("Error blocking/unblocking user:", error);
      alert("Không thể cập nhật trạng thái tài khoản.");
    }
  };

  // Lọc danh sách hiển thị (loại bỏ admin)
  const filteredUsers = userList?.filter((item) => !item.admin);

  return (
    <Box className="manage-users">
      <Box className="content">
        <Typography variant="h4" gutterBottom>
          Quản Lý Người Dùng
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tên</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
                <TableCell>Bài đăng</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    {user.profile?.isBlocked ? "Đã khóa" : "Hoạt động"}
                  </TableCell>
                  <TableCell>
                    <Button
                      color={user.profile?.isBlocked ? "secondary" : "primary"}
                      onClick={() =>
                        handleBlockUser(user._id, user.profile?.isBlocked)
                      }
                    >
                      {user.profile?.isBlocked
                        ? "Mở khóa tài khoản"
                        : "Khóa tài khoản"}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <Button
                      color="secondary"
                      onClick={() => handleViewPosts(user._id)}
                    >
                      Xem tất cả bài đăng
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ManageUsers;