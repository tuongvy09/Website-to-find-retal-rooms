import React from 'react';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Home from './components/User/Home/Home';
import Header from './components/User/Header/Header'; 
import Footer from './components/Footer/Footer'; 
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import AdminHeader from './components/Admin/AdminHeader/AdminHeader';
import ManageUsers from './components/Admin/ManageUsers/ManageUsers'; 
import AddPost from './components/User/Post/AddPost';
import NewsManagement from './components/Admin/News/NewsManagement/NewsManagement';
import NewsDetail from './components/Admin/News/NewsDetail/NewsDetail';
import NewsForm from './components/Admin/News/NewsForm/NewsForm';
import NewsList from './components/Admin/News/NewsList/NewsList';
import './App.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={
            <div className="content-container">
              <Header />
              <Home />
            </div>
          } />
          <Route path="/admin-dashboard" element={
            <div className="content-container">
              <AdminHeader />
              <AdminDashboard />
            </div>
          } />

          <Route path="/manage-news" element={
            <div className="content-container">
              <AdminHeader />
              <NewsManagement />
            </div>
          } />

          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/AddPost" element={<AddPost />} />

          <Route path="/manage-users/news/" element={
            <div className="content-container">
              <AdminHeader />
              <NewsList />
            </div>
          } />

          <Route path="/manage-users/news/" element={
            <div className="content-container">
              <AdminHeader />
              <NewsForm />
            </div>
          } />

          <Route path="/manage-users/news/:id" element={
            <div className="content-container">
              <AdminHeader />
              <NewsDetail />
            </div>
          } />

          <Route path="/manage-users" element={
            <div className="content-container">
              <AdminHeader />
              <ManageUsers />
            </div>
          } />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

export default App;