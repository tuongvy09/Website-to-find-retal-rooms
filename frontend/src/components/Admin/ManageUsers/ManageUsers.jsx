import { Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import axios from 'axios';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createAxios } from '../../../createInstance';
import { getAllUsers } from '../../../redux/apiRequest';
import { loginSuccess } from '../../../redux/authSlice';
import { deleteUserFailed, deleteUserStart, deleteUserSuccess } from '../../../redux/userSlice';
import './ManageUsers.css';

const ManageUsers = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const userList = useSelector((state) => state.users.users?.allUsers);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let axiosJWT = axios.create({
    baseURL: "http://localhost:8000",
});
  axiosJWT = createAxios(user, dispatch, loginSuccess);

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
        dispatch(deleteUserStart()); 
        try {
            await axios.delete(`http://localhost:8000/v1/user/${userId}`, {
                headers: { Authorization: `Bearer ${user.accessToken}` },
            });
            dispatch(deleteUserSuccess(userId)); 
            getAllUsers(user.accessToken, dispatch); 
            alert("User deleted successfully!");
        } catch (err) {
            console.error("Delete user error:", err.response ? err.response.data : err.message);
            dispatch(deleteUserFailed()); 
            alert("Failed to delete user. Please try again.");
        }
    }
};

  useEffect(() => {
    if(!user) {
      navigate("/login");
    }
    if(user?.accessToken){
      getAllUsers(user?.accessToken, dispatch, axiosJWT);
    }
    console.log("User List:", userList); 
  }, [])

  return (
    <Box className="manage-users">
      <Box className="content">
        <Typography variant="h4" gutterBottom>Quản Lý Người Dùng</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList?.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.admin ? "Admin" : "User"}</TableCell>
                  <TableCell>
                    <Button color="primary" onClick={() => alert(`Editing ${user.username}`)}>Edit</Button>
                    <Button color="secondary" onClick={() => handleDelete(user._id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
};

export default ManageUsers;