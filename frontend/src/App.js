import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import AdminHeader from './components/AdminHeader/AdminHeader';
import Footer from './components/Footer/Footer';
import Header from './components/Header/Header';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import AddPost from './components/Post/AddPost';
import Register from './components/Register/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Header /> {/* Header cho người dùng */}
            <Home /> {/* Nội dung trang chính */}
            <Footer /> {/* Footer chung */}
          </>
        } />
        <Route path="/admin-dashboard" element={
          <>
            <AdminHeader /> {/* Header cho admin */}
            <AdminDashboard /> {/* Nội dung trang admin */}
            <Footer /> {/* Footer chung */}
          </>
        } />
        <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="AddPost" element={<AddPost/>}/>
      </Routes>
    </Router>
  );
}

export default App;