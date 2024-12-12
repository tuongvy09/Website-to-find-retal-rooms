import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import "./ChangePassword.css";

const ChangePassword = ({ onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu mới và xác nhận mật khẩu không khớp!");
      return;
    }
    setError("");
    onChangePassword(currentPassword, newPassword);
  };

  return (
    <Box className="change-password-container">
      <form onSubmit={handleSubmit} className="change-password-form">
        <Typography variant="h5" className="change-password-title">
          Đổi Mật Khẩu
        </Typography>
        <div className="input-container">
          <TextField
            label="Mật khẩu hiện tại"
            type={showCurrentPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            fullWidth
            className="form-field"
            required
            size="small"
          />
          <span
            className="toggle-password"
            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <div className="input-container">
          <TextField
            label="Mật khẩu mới"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            fullWidth
            className="form-field"
            required
            size="small"
          />
          <span
            className="toggle-password"
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <div className="input-container">
          <TextField
            label="Xác nhận mật khẩu mới"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            className="form-field"
            required
            size="small"
          />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {error && <Typography className="error-message">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="submit-button"
        >
          Cập nhật
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;
