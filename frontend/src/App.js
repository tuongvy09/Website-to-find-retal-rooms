import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import AdminHeader from './components/Admin/AdminHeader/AdminHeader';
import ManageUsers from './components/Admin/ManageUsers/ManageUsers';
import NewsDetail from './components/Admin/News/NewsDetail/NewsDetail';
import NewsForm from './components/Admin/News/NewsForm/NewsForm';
import NewsList from './components/Admin/News/NewsList/NewsList';
import NewsManagement from './components/Admin/News/NewsManagement/NewsManagement';
import Footer from './components/Footer/Footer';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Header from './components/User/Header/Header';
import Home from './components/User/Home/Home';
import ManageAcount from './components/User/ManageAcount/ManageAcount';
import AddPost from './components/User/Post/AddPost';
import PostDetail from './components/User/Post/PostDetail';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <Home />
              <Footer />
            </>
          } />
          <Route path="/admin-dashboard" element={
              <AdminDashboard />
          } />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/AddPost" element={<AddPost />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/managerAc" element={<ManageAcount/>}/>
          <Route path="/manage-users" element={
            <>
              <AdminHeader />
              <ManageUsers />
              <Footer />
            </>
          } />
          <Route path="/manage-news" element={
            <>
              <AdminHeader />
              <NewsManagement />
              <Footer />
            </>
          } />
          <Route path="/manage-users/news/" element={
            <>
              <AdminHeader />
              <NewsList />
              <Footer />
            </>
          } />
          <Route path="/manage-users/news/form" element={
            <>
              <AdminHeader />
              <NewsForm />
              <Footer />
            </>
          } />
          <Route path="/manage-users/news/:id" element={
            <>
              <AdminHeader />
              <NewsDetail />
              <Footer />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;