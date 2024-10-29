import React from 'react';
import { Button, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css'; 
import { createAxios } from '../../../createInstance';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../../redux/apiRequest';
import { logoutSuccess } from '../../../redux/authSlice';

const AdminHeader = () => {
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.login.currentUser); 
  const dispatch = useDispatch();
  const accessToken = currentUser?.accessToken;
  const id = currentUser?._id;
  let axiosJWT = axios.create({
    baseURL: "http://localhost:8000",
  });
  axiosJWT = createAxios(currentUser, dispatch, logoutSuccess);

  const handleLogout = () => {
    logout(dispatch, id, navigate, accessToken, axiosJWT);
  };

  return (
    <AppBar position="static" className="admin-header">
      <Toolbar>
        <Typography variant="h6" className="admin-header-title">
          Admin Dashboard
        </Typography>
        <Box className="admin-header-buttons">
          <Button color="inherit" onClick={() => navigate('/admin-dashboard')}>Dashboard</Button>
          <Button color="inherit" onClick={() => navigate('/manage-users')}>Quản Lý Người Dùng</Button>
          <Button color="inherit" onClick={() => navigate('/manage-posts')}>Quản Lý Bài Đăng</Button>
          <Button color="inherit" onClick={() => navigate('/admin-settings')}>Cài Đặt</Button>
          {/* <Button color="inherit" onClick={() => {
            navigate('/login');
          }}>Đăng Xuất</Button> */}
          <Button color="inherit" onClick={handleLogout}>Đăng Xuất</Button> {/* Sử dụng hàm handleLogout */}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;