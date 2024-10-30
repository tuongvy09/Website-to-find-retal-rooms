import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import AdminHeader from './components/Admin/AdminHeader/AdminHeader';
import ManageUsers from './components/Admin/ManageUsers/ManageUsers'; 
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import AddPost from './components/Post/AddPost';
import PostDetail from './components/Post/PostDetail';
import Register from './components/Register/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/admin-dashboard" element={
          <>
            <AdminHeader />
            <AdminDashboard />
            <Footer />
          </>
        } />
        <Route path="/register" element={<Register />} />
          <Route path="/" element={<Home />} />
          <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/AddPost" element={<AddPost />} />
        <Route path="/manage-users" element={
          <>
            <AdminHeader />
            <ManageUsers />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;