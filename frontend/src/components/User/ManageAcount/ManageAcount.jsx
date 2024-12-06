import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedMenu } from '../../../redux/menuSlice';
import { toggleFavoritePost } from '../../../redux/postSlice'; 
import Footer from "../../Footer/Footer";
import Header from "../Header/Header";
import EditProfile from "./EditProfile";
import ListUserPost from "./listUserPost";
import './ManageAcount.css';
import Sidebar from "./Sidebar";
import UpdatePost from "./UpdatePost";

const ManageAcount = () => {
  const currentUser = useSelector((state) => state.auth.login.currentUser);
  const dispatch = useDispatch();
  const selectedMenu = useSelector((state) => state.menu.selectedMenu);
  const posts = useSelector((state) => state.posts.items); 

  const handleToggleFavorite = (postId) => {
    dispatch(toggleFavoritePost(postId)); 
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'postList':
        return <ListUserPost 
          posts={posts} 
          onToggleFavorite={handleToggleFavorite} 
        />;
      case 'updatePost':
        return <UpdatePost />;
      case 'manageAccount':
        return <EditProfile user={currentUser} />;
      case 'favoritePosts':
        return <div>Danh sách yêu thích</div>;
      default:
        return <div>Quản lý tài khoản</div>;
    }
  };

  const handleChangeMenu = (menu) => {
    dispatch(setSelectedMenu(menu));
  };

  return (
    <div className="manageAcount-container">
      <Header />
      <div className="container-body">
        <Sidebar user={currentUser} setSelectedMenu={handleChangeMenu} />
        <div className="content">
          {renderContent()}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ManageAcount;