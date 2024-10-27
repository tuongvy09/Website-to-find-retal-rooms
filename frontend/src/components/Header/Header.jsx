import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useDispatch, useSelector } from 'react-redux'; 
import './Header.css';
import { logout } from '../../redux/apiRequest';
import { createAxios } from '../../../createInstance';
import axios from 'axios';
import { logoutSuccess } from '../../redux/authSlice';

const Header = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
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

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="static" className="header">
      <Toolbar>
        <Typography variant="h6" className="header-title">
          PhongTroXinh.com
        </Typography>
        <Box className="header-buttons">
          <Button color="inherit" onClick={() => navigate('/')}>Trang Chủ</Button>
          <Button color="inherit" onClick={() => navigate('/ChoThueTro')}>Cho Thuê Trọ</Button>
          <Button color="inherit" onClick={() => navigate('/ChoThueNha')}>Cho Thuê Nhà</Button>
          <Button color="inherit" onClick={() => navigate('/ChoThueMatBang')}>Cho Thuê Mặt Bằng</Button>
          <Button color="inherit" onClick={() => navigate('/TinTuc')}>Tin Tức</Button>
          <Button color="inherit" onClick={handleClick}>
            {currentUser ? `Hi, ${currentUser.username}` : 'Tài khoản'} 
          </Button>
        </Box>
      </Toolbar>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        classes={{ paper: 'menu' }}
      >
        {!currentUser ? (
          <>
            <MenuItem className="menu-item" onClick={() => { navigate('/login'); handleClose(); }}>Đăng Nhập</MenuItem>
            <MenuItem className="menu-item" onClick={() => { navigate('/register'); handleClose(); }}>Đăng Ký</MenuItem>
          </>
        ) : (
          <MenuItem className="menu-item" onClick={handleLogout}>Đăng Xuất</MenuItem>
        )}
      </Menu>
    </AppBar>
  );
};

export default Header;