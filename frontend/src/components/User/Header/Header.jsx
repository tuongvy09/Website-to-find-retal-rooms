import { Alert, Box, FormControl, Select, Menu, MenuItem, Badge, Button, AppBar, Toolbar, Typography } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
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
    const [notificationsMenuAnchorEl, setNotificationsMenuAnchorEl] = useState(null); // New state for notification menu
    const [notifications, setNotifications] = useState([
        {
            message: 'Có tin nhắn mới từ admin',
            date: '2024-12-08',
            isRead: false,
        },
        {
            message: 'Bài viết của bạn đã được duyệt',
            date: '2024-12-07',
            isRead: false,
        },
        {
            message: 'Có bình luận mới trên bài đăng "Cho thuê phòng trọ cao cấp" của bạn',
            date: '2024-12-04',
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

    const handleChange = (event) => {
        setPropertyType(event.target.value);
        console.log('Loại Bất Động Sản Được Chọn:', event.target.value);
        if (event.target.value === 'tro') {
            navigate('/ChoThueTro');
        } else if (event.target.value === 'nha') {
            navigate('/ChoThueNha');
        } else if (event.target.value === 'matbang') {
            navigate('/ChoThueMatBang');
        }
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
                <Typography variant="h6" className="header-title">
                    PhongTroXinh.com
                </Typography>
                <Box className="header-container-btn">
                    <Button className="user-header-btn" onClick={() => navigate('/')}>
                        Trang Chủ
                    </Button>
                    <FormControl className="user-header-btn">
                        <Select
                            id="property-type"
                            size="small"
                            value={propertyType}
                            onChange={handleChange}
                            displayEmpty
                            className="header-select-input"
                            inputProps={{
                                'aria-label': 'Chọn Loại Bất Động Sản',
                            }}
                        >
                            <MenuItem value="" disabled>
                                Chọn Loại Bất Động Sản
                            </MenuItem>
                            <MenuItem value="tro">Cho Thuê Trọ</MenuItem>
                            <MenuItem value="nha">Cho Thuê Nhà</MenuItem>
                            <MenuItem value="matbang">Cho Thuê Mặt Bằng</MenuItem>
                        </Select>
                    </FormControl>
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
            classes={{ paper: 'menu' }}
        >
            <Box className="notification-header">
                <Typography variant="h6" className="notification-title">
                    THÔNG BÁO
                </Typography>
                <Button className="notification-close-btn" onClick={handleNotificationClose}>
                    ĐÓNG
                </Button>
            </Box>
            <hr className="notification-divider" />
            {notifications.map((notification, index) => (
                <MenuItem
                    key={index}
                    onClick={handleNotificationClose}
                    className={notification.isRead ? 'read' : 'unread'}
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
            ))}
        </Menu>
        </AppBar>
    );
};

export default Header;
