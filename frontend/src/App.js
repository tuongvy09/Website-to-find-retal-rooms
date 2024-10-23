import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Header from './components/Header/Header'; 
import Footer from './components/Footer/Footer'; 
import AdminDashboard from './components/AdminDashboard/AdminDashboard';
import AdminHeader from './components/AdminHeader/AdminHeader';
import './App.css';

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
      </Routes>
    </Router>
  );
}

export default App;