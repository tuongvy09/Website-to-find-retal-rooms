import React from "react";
import {
  Box,
  Button,
  Divider,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { markNotificationAsRead } from "../../../redux/notificationAPI";
import "./Notification.css";

const Notification = ({
  anchorEl,
  onClose,
  onNotificationClose,
  userId,
  accessToken,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const notifications = currentUser ? currentUser.notifications : [];
  const loading = useSelector((state) => state.notifications.loading);
  const error = useSelector((state) => state.notifications.error);

  const handleNotificationClick = (notificationId, postId) => {
    // Đánh dấu thông báo là đã đọc
    if (notificationId && userId && accessToken) {
      dispatch(
        markNotificationAsRead(notificationId, userId, accessToken, dispatch),
      );
    }
    if (postId) {
      navigate(`/posts/${postId}`);
    }
    onNotificationClose();
  };

  const sortedNotifications = [...notifications].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onNotificationClose}
      sx={{
        "& .MuiPaper-root": {
          backgroundColor: "#c2f8ab",
          borderRadius: "10px",
        },
      }}
    >
      <Box className="notification-header">
        <Typography className="notification-title">Thông báo</Typography>
        <Button
          className="notification-close-btn"
          onClick={onNotificationClose}
        >
          Đóng
        </Button>
      </Box>
      <hr className="notification-divider" />
      {loading ? (
        <MenuItem sx={{ justifyContent: "center", padding: "15px 0" }}>
          <Typography variant="body2">
            <div className="loading-container">
              <div className="spinner"></div>
            </div>
          </Typography>
        </MenuItem>
      ) : error ? (
        <MenuItem sx={{ justifyContent: "center", padding: "15px 0" }}>
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        </MenuItem>
      ) : sortedNotifications && sortedNotifications.length > 0 ? (
        sortedNotifications.map((notification) => (
          <React.Fragment key={notification._id}>
            <MenuItem
              onClick={() =>
                handleNotificationClick(notification._id, notification.post_id)
              }
              className={notification.status === "read" ? "read" : "unread"}
              sx={{
                borderRadius: "10px",
                marginBottom: "10px",
                backgroundColor:
                  notification.status === "read" ? "#c2f8ab" : "#9e9e9e",
                "&:hover": {
                  backgroundColor:
                    notification.status === "read" ? "#9ee380" : "#757575",
                },
              }}
            >
              <Box className="notification-item">
                <Typography variant="body2" className="notification-message">
                  {notification.message}
                </Typography>
                <Typography variant="caption" className="notification-date">
                  {new Date(notification.createdAt).toLocaleString()}
                </Typography>
              </Box>
            </MenuItem>
            <Divider sx={{ margin: "0", borderColor: "#ddd" }} />
          </React.Fragment>
        ))
      ) : (
        <MenuItem sx={{ justifyContent: "center", padding: "15px 0" }}>
          <Typography variant="body2">Không có thông báo nào.</Typography>
        </MenuItem>
      )}
    </Menu>
  );
};

export default Notification;
