import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import HomeAdmin from './components/Admin/AdminDashboard/HomeAdmin';
import ManagePostAdmin from './components/Admin/AdminDashboard/ManagePostAdmin';
import AdminHeader from './components/Admin/AdminHeader/AdminHeader';
import ManageUsers from './components/Admin/ManageUsers/ManageUsers';
import UserPosts from './components/Admin/ManageUsers/UserPosts';
import EditNewsForm from './components/Admin/News/EditNewsForm/EditNewsForm';
import NewsDetail from './components/Admin/News/NewsDetail/NewsDetail';
import NewsForm from './components/Admin/News/NewsForm/NewsForm';
import NewsList from './components/Admin/News/NewsList/NewsList';
import NewsManagement from './components/Admin/News/NewsManagement/NewsManagement';
import Footer from './components/Footer/Footer';
import ForgotPassword from './components/ForgotPassword/ForgotPassword ';
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import ResetPassword from './components/ResetPassword/ResetPassword ';
import ChangePassword from './components/User/ChangePassword/ChangePassword';
import Header from './components/User/Header/Header';
import Home from './components/User/Home/Home';
import ManageAcount from './components/User/ManageAcount/ManageAcount';
import UpdatePost from './components/User/ManageAcount/UpdatePost';
import NewsDetailUser from './components/User/News/NewsDetail/NewsDetailUser';
import NewsListUser from './components/User/News/NewsList/NewsListUser';
import AddPost from './components/User/Post/AddPost';
import PostDetail from './components/User/Post/PostDetail';
import SearchPosts from './components/User/Search/searchPosts';
import SearchResultsPage from './components/User/Search/searchResultPage';
import PostsPage from './components/User/Post/PostPage';

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="content-wrapper">
          <Routes>
            <Route path="/" element={
              <>
                <Header />
                <SearchPosts />
                <Home />
              </>
            } />
            <Route path="/search" element={
              <>
                <Header />
                <SearchPosts />
                <SearchResultsPage />
              </>
            } />
            <Route path='/posts' element={<PostsPage />} />
            <Route path='/CanHoPost' element={<PostsPage />} />
            <Route path='/VanPhongPost' element={<PostsPage />} />
            <Route path='/news' element={
              <>
                <Header />
                <SearchPosts />
                <NewsListUser />
              </>
            } />
            <Route path="/admin-dashboard" element={
              <HomeAdmin />
            } />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route
              path="/chang-pass"
              element={
                <>
                  <AdminHeader />
                  <ChangePassword />
                </>
              }
            />
            <Route
              path="/AddPost"
              element={
                <>
                  <Header />
                  <AddPost />
                </>
              }
            />
            <Route path="/posts/:id" element={<PostDetail />} />
            <Route path="/managerAc" element={<ManageAcount />} />
            <Route path="/update-post/:id" element={<UpdatePost />} />
            <Route
              path="/manage-news/edit/:id"
              element={
                <>
                  <AdminHeader />
                  <EditNewsForm />
                </>
              }
            />
            <Route
              path="/TinTuc"
              element={
                <>
                  <Header />
                  <NewsListUser />
                </>
              }
            />
            <Route
              path="/news/:id"
              element={
                <>
                  <Header />
                  <NewsDetailUser />
                </>
              }
            />
            <Route
              path="/manage-news/:id"
              element={
                <>
                  <AdminHeader />
                  <NewsDetail />
                </>
              }
            />
            <Route
              path="/manage-users"
              element={
                <>
                  <AdminHeader />
                  <ManageUsers />
                </>
              }
            />
            <Route
              path="/manage-news/*"
              element={
                <>
                  <AdminHeader />
                  <NewsManagement />
                </>
              }
            >
              {/* Các Route con của /manage-news */}
              <Route path="list" element={<NewsList />} />
              <Route path="add" element={<NewsForm />} />
              <Route path=":id" element={<NewsDetail />} />
            </Route>
            <Route
              path="/manage-posts"
              element={
                <>
                  <AdminHeader />
                  <ManagePostAdmin />
                </>
              }
            />
            <Route
              path="/user-posts/:userId"
              element={
                <>
                  <AdminHeader />
                  <UserPosts />
                </>
              }
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
