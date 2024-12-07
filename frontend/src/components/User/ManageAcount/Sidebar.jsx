import React from "react";
import "./Sidebar.css";

const Sidebar = ({ user, setSelectedMenu }) => {
  return (
    <div className="sidebar-manage-user">
      <div className="user-info">
        <img src={user.profile.picture} alt="User Avatar" className="avatar" />
        <div className="user-details">
          <h3 className="user-name">{user.username}</h3>
          <p className="user-phone">{user.phone}</p>
        </div>
      </div>
      <nav className="nav-menu">
        <ul>
          <li onClick={() => setSelectedMenu("postList")}>🏡 Danh sách tin đăng</li>
          <li onClick={() => setSelectedMenu("manageAccount")}>✏️ Chỉnh sửa thông tin cá nhân</li>
          <li onClick={() => setSelectedMenu("changePass")}>🔒 Đổi mật khẩu</li>
          <li onClick={() => setSelectedMenu("favoritePosts")}>❤️ Danh sách yêu thích</li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
