import React from 'react';
import { Button, AppBar, Toolbar, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './AdminHeader.css'; 

const AdminHeader = () => {
  const navigate = useNavigate();

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
          <Button color="inherit" onClick={() => {
            navigate('/login');
          }}>Đăng Xuất</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AdminHeader;