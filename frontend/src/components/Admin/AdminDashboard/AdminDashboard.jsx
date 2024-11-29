// import React, { useState } from 'react';
// import { useSelector } from 'react-redux';
// import Footer from '../../Footer/Footer';
// import AdminHeader from '../AdminHeader/AdminHeader';
// import ManagePosts from '../ManagePost/ManagePosts';
// import './AdminDashboard.css';
// import Sidebar from '../Sidebar/Sidebar';

// const AdminDashboard = () => {
//   const currentUser = useSelector((state) => state.auth.login.currentUser);
//   console.log("info-user", currentUser);
//   const [selectedMenu, setSelectedMenu] = useState('manageAccount');

//   const renderContent = () => {
//     switch (selectedMenu) {
//       case 'allPost':
//         return <ManagePosts/>;
//       case 'pendingList':
//         return <div>Quản lý tài khoản</div>;
//       case 'visibleList':
//         return <div>Quản lý tài khoản</div>;
//       case 'updateList':
//         return <div>Quản lý tài khoản</div>;
//       default:
//         return <div>Quản lý tài khoản</div>;
//     }
//   };

//   return (
//     <div className='container-home-admin'>
//       <AdminHeader />
//       <div className='container-body'>
//         <Sidebar setSelectedMenu={setSelectedMenu} /> {/* Truyền setSelectedMenu vào Sidebar */}
//         <div className="content">
//           {renderContent()}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// };

// export default AdminDashboard;
