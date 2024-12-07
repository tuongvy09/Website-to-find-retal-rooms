import React, { useState } from "react";
import { Box, TextField, Button, Typography } from "@mui/material";
import "./ChangePassword.css";

const ChangePassword = ({ onChangePassword }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

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
      <Typography variant="h5" className="change-password-title">
        Đổi Mật Khẩu
      </Typography>
      <form onSubmit={handleSubmit} className="change-password-form">
        <TextField
          label="Mật khẩu hiện tại"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          fullWidth
          className="form-field"
          required
        />
        <TextField
          label="Mật khẩu mới"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          fullWidth
          className="form-field"
          required
        />
        <TextField
          label="Xác nhận mật khẩu mới"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          fullWidth
          className="form-field"
          required
        />
        {error && <Typography className="error-message">{error}</Typography>}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="submit-button"
        >
          Cập nhật mật khẩu
        </Button>
      </form>
    </Box>
  );
};

export default ChangePassword;
