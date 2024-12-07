import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAxios } from '../../../createInstance';
import { logout } from '../../../redux/apiRequest';
import { logoutSuccess } from '../../../redux/authSlice';
import './AdminHeader.css';

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
        <Typography className="admin-header-title">
            Phòng Trọ Xinh
        </Typography>
        <Box className="admin-header-buttons">
          <Button onClick={() => navigate('/admin-dashboard')}>Dashboard</Button>
          <Button onClick={() => navigate('/manage-news')}>Quản Lý Tin Tức</Button> 
          <Button onClick={handleLogout}>Đăng Xuất</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;