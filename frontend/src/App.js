import React from 'react';
import Register from './components/Register/Register';
import Login from './components/Login/Login';
import Home from './components/Home/Home';
import Header from './components/Header/Header'; 
import Footer from './components/Footer/Footer'; 
import AdminDashboard from './components/Admin/AdminDashboard/AdminDashboard';
import AdminHeader from './components/Admin/AdminHeader/AdminHeader';
import ManageUsers from './components/Admin/ManageUsers/ManageUsers'; 
import AddPost from './components/Post/AddPost';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <Header />
            <Home />
            <Footer />
          </>
        } />
        <Route path="/admin-dashboard" element={
          <>
            <AdminHeader />
            <AdminDashboard />
            <Footer />
          </>
        } />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="AddPost" element={<AddPost/>}/>
        <Route path="/manage-users" element={
          <>
            <AdminHeader />
            <ManageUsers />
            <Footer />
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
