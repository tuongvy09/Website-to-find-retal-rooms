import NotificationsIcon from '@mui/icons-material/Notifications';
import { AppBar, Badge, Box, Button, Divider, Menu, MenuItem, Toolbar, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAxios } from '../../../createInstance';
import { logout } from '../../../redux/apiRequest';
import { logoutSuccess } from '../../../redux/authSlice';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState(null);
    const [notificationsMenuAnchorEl, setNotificationsMenuAnchorEl] =
        useState(null); // New state for notification menu
    const [notifications, setNotifications] = useState([
        {
            message: "Bài đăng Cho thuê căn hộ mini giá rẻ của bạn đã được duyệt",
            date: "2024-12-08",
            isRead: false,
        },
        {
            message: "Bài đăng Mặt bằng văn phòng tại Thủ Đức của bạn sẽ ẩn sau 1 ngày",
            date: "2024-12-07",
            isRead: false,
        },
        {
            message:
                'Có bình luận mới trên bài đăng "Cho thuê phòng trọ cao cấp" của bạn',
            date: "2024-12-04",
            isRead: true,
        },
    ]);

    const currentUser = useSelector((state) => state.auth.login.currentUser);
    const dispatch = useDispatch();
    const accessToken = currentUser?.accessToken;
    const id = currentUser?._id;
    const [propertyType, setPropertyType] = useState('');
    const axiosJWT = createAxios(currentUser, dispatch, logoutSuccess);

    const handleLogout = () => {
        logout(dispatch, id, navigate, accessToken, axiosJWT);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleNotificationClick = (event) => {
        setNotificationsMenuAnchorEl(event.currentTarget); // Open notification menu
    };

    const handleNotificationClose = () => {
        setNotificationsMenuAnchorEl(null); // Close notification menu
    };

    const handleAddPost = () => {
        if (!currentUser) {
            alert('Bạn cần đăng nhập để đăng tin mới.');
            navigate('/login');
        } else {
            navigate('/AddPost');
        }
    };

    const notificationCount = notifications.length;

    return (
        <AppBar position="static" className="user-header-app-bar">
            <Toolbar className="user-header-tool-bar">
            <Typography
            variant="h6"
            className="header-title"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }} 
            >
            PhongTroXinh.com
            </Typography>
                <Box className="header-container-btn">
                    <Button className="user-header-btn" onClick={() => navigate('/')}>
                        Trang Chủ
                    </Button>
                    <Button className="user-header-btn" onClick={() => navigate('/TinTuc')}>
                        Tin Tức
                    </Button>
                    <Button className="user-header-btn" onClick={handleAddPost}>
                        Đăng tin mới
                    </Button>
                    <Button className="user-header-btn" onClick={handleNotificationClick}>
                        <Badge badgeContent={notificationCount} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </Button>
                    <Button className="user-header-btn" onClick={handleClick}>
                        {currentUser ? `Hi, ${currentUser.username}` : 'Tài khoản'}
                    </Button>
                </Box>
            </Toolbar>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                classes={{ paper: 'menu' }}
            >
                {!currentUser ? (
                    <>
                        <MenuItem
                            className="menu-item"
                            onClick={() => {
                                navigate('/login');
                                setAnchorEl(null);
                            }}
                        >
                            Đăng Nhập
                        </MenuItem>
                        <MenuItem
                            className="menu-item"
                            onClick={() => {
                                navigate('/register');
                                setAnchorEl(null);
                            }}
                        >
                            Đăng Ký
                        </MenuItem>
                    </>
                ) : (
                    <>
                        <MenuItem
                            className="menu-item"
                            onClick={() => {
                                navigate('/managerAc');
                                setAnchorEl(null);
                            }}
                        >
                            Quản lý tài khoản
                        </MenuItem>
                        <MenuItem className="menu-item" onClick={handleLogout}>
                            Đăng Xuất
                        </MenuItem>
                    </>
                )}
            </Menu>

            <Menu
                anchorEl={notificationsMenuAnchorEl}
                open={Boolean(notificationsMenuAnchorEl)}
                onClose={handleNotificationClose}
                sx={{
                    '& .MuiPaper-root': {
                        backgroundColor: '#c2f8ab',
                        borderRadius: '10px',
                    },
                }}
            >
                <Box className="notification-header">
                    <Typography className="notification-title">
                        Thông báo
                    </Typography>
                    <Button className="notification-close-btn" onClick={handleNotificationClose}>
                        Đóng
                    </Button>
                </Box>
                <hr className="notification-divider" />
                {notifications.map((notification, index) => (
                    <React.Fragment key={index}>
                        <MenuItem
                            onClick={handleNotificationClose}
                            className={notification.isRead ? 'read' : 'unread'}
                            sx={{
                                borderRadius: '10px',
                                marginBottom: '10px',
                                backgroundColor: index < 2 ? '#fce4ec' : 'inherit', // Màu cố định cho 2 mục đầu tiên
                                '&:hover': {
                                    backgroundColor: index < 2 ? '#f8bbd0' : '#ffe4b5', // Màu hover tùy thuộc
                                },
                            }}
                        >
                            <Box className="notification-item">
                                <Typography variant="body2" className="notification-message">
                                    {notification.message}
                                </Typography>
                                <Typography variant="caption" className="notification-date">
                                    {notification.date}
                                </Typography>
                            </Box>
                        </MenuItem>
                        {index < notifications.length - 1 && <Divider />} {/* Divider giữa các mục */}
                    </React.Fragment>
                ))}
            </Menu>
        </AppBar>
    );
};

export default Header;
