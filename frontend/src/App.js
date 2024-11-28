import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import AdminHeader from './components/Admin/AdminHeader/AdminHeader';
import ManageUsers from './components/Admin/ManageUsers/ManageUsers';
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
import Header from './components/User/Header/Header';
import Home from './components/User/Home/Home';
import ManageAcount from './components/User/ManageAcount/ManageAcount';
import UpdatePost from './components/User/ManageAcount/UpdatePost';
import NewsDetailUser from './components/User/News/NewsDetail/NewsDetailUser';
import NewsListUser from './components/User/News/NewsList/NewsListUser';
import AddPost from './components/User/Post/AddPost';
import PostDetail from './components/User/Post/PostDetail';
import 'froala-editor/css/froala_editor.pkgd.min.css';
import 'froala-editor/css/froala_style.min.css';

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
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
            
          <Route path="/AddPost" element={<AddPost />} />
          <Route path="/AddPost" element={
            <>
            <Header/>
            <AddPost />
            </>
          } 
          />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/managerAc" element={<ManageAcount/>}/>
          <Route path="/update-post/:id" element={<UpdatePost/>}/> 
          <Route path="/manage-news/edit/:id" element={
            <>
            <AdminHeader />
            <EditNewsForm />
            <Footer />
            </>
            } />
          <Route path="/TinTuc" element={
            <>
            <Header />
            <NewsListUser />
            <Footer />
            </>
            } />
          <Route path="/news/:id" element={
            <>
            <Header />
            <NewsDetailUser />
            <Footer />
            </>
            } />
          <Route path="/manage-news/:id" element={
           <>
           <AdminHeader />
           <NewsDetail />
           <Footer />
         </>
            } />
          <Route path="/manage-users" element={
            <>
              <AdminHeader />
              <ManageUsers />
              <Footer />
            </>
          } />
          <Route path="/manage-news/*" element={
            <>
              <AdminHeader />
              <NewsManagement />
              <Footer />
            </>
          }>
            {/* Các Route con của /manage-news */}
            <Route path="list" element={<NewsList />} />
            <Route path="add" element={<NewsForm />} />
            <Route path=":id" element={<NewsDetail />} />

          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;