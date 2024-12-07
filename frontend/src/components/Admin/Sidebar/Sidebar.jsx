import React, { useState } from 'react';
import './Sidebar.css'; // Đảm bảo rằng bạn đã tạo file CSS

const Sidebar = ({ setSelectedMenu }) => {
  const [selectedMenu, setSelectedMenuState] = useState('dashboard'); // State để lưu trữ mục menu hiện tại

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
    setSelectedMenuState(menu);
  };

  return (
    <div className="home-admin-sidebar">
      <nav className="home-admin-nav-menu">
        <ul>
          <li
            className={selectedMenu === 'dashboard' ? 'active' : ''}
            onClick={() => handleMenuClick('dashboard')}
          >
            Dashboard
          </li>
          <li
            className={selectedMenu === 'manageUser' ? 'active' : ''}
            onClick={() => handleMenuClick('manageUser')}
          >
              Quản lý người dùng
          </li>
          <li
            className={selectedMenu === 'managePost' ? 'active' : ''}
            onClick={() => handleMenuClick('managePost')}
          >
            Quản lý bài đăng
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;