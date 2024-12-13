import axios from "axios";
import {
  getNotificationsStart,
  getNotificationsSuccess,
  getNotificationsFailed,
  markAsReadStart,
  markAsReadSuccess,
  markAsReadFailed,
} from "./notificationSlice";

export const getNotifications = async (accessToken, dispatch) => {
  axios.defaults.baseURL = "http://localhost:8000";
  dispatch(getNotificationsStart());
  try {
    const response = await axios.get("/v1/user/notifications", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    dispatch(getNotificationsSuccess(response.data.notifications));
  } catch (err) {
    if (err.response) {
      console.error("Get notifications error:", err.response.data);
      const errorMessage =
        err.response.data.message || "Failed to fetch notifications";
      console.error("Error message:", errorMessage);
    } else {
      console.error("Get notifications error:", err.message);
    }
    dispatch(getNotificationsFailed());
  }
};

export const markNotificationAsRead = async (
  notificationId,
  accessToken,
  dispatch,
) => {
  axios.defaults.baseURL = "http://localhost:8000";
  dispatch(markAsReadStart());
  try {
    const response = await axios.patch(
      `/v1/user/notifications/${notificationId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    dispatch(markAsReadSuccess(response.data.notification));
  } catch (err) {
    if (err.response) {
      console.error("Mark notification as read error:", err.response.data);
      const errorMessage =
        err.response.data.message || "Failed to mark notification as read";
      console.error("Error message:", errorMessage);
    } else {
      console.error("Mark notification as read error:", err.message);
    }
    dispatch(markAsReadFailed());
  }
};
