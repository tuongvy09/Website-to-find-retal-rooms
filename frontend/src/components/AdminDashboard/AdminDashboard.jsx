import React from 'react';
import Footer from '../Footer/Footer'; 
import './AdminDashboard.css'; 

const AdminDashboard = () => {
  return (
    <div>      
      <main className="admin-dashboard-content">
        <h1>Chào mừng đến trang quản trị</h1>
        <p>Đây là trang quản lý dành cho admin, bạn có thể quản lý người dùng, bài đăng và nhiều hơn nữa.</p>
      </main>
      
      <Footer /> 
    </div>
  );
};

export default AdminDashboard;