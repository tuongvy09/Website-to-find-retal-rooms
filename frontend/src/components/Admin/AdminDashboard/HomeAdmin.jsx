import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedMenu } from '../../../redux/menuSlice';
import AdminDashboard from '../AdminDashboard/AdminDashboard';
import AdminHeader from '../AdminHeader/AdminHeader';
import ManageUsers from '../ManageUsers/ManageUsers';
import NewsManagement from '../News/NewsManagement/NewsManagement';
import Sidebar from '../Sidebar/Sidebar';
import './HomeAdmin.css';
import ManagePostAdmin from './ManagePostAdmin';

const HomeAdmin = () => {
    const dispatch = useDispatch();
    const selectedMenu = useSelector((state) => state.menu.selectedMenu);

    const handleChangeMenu = (menu) => {
        dispatch(setSelectedMenu(menu)); 
      };

    const renderContent = () => {
        switch (selectedMenu) {
            case 'dashboard':
                return <AdminDashboard />;
            case 'manageUser':
                return <ManageUsers/>;
            case 'managePost':
                return <ManagePostAdmin/>;
            case 'manageNews':
                return <NewsManagement/>;
            default:
                return <div>Dashboard Content</div>;
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <div style={{ width: '250px' }}>
                <Sidebar setSelectedMenu={handleChangeMenu}/>
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ height: '64px' }}>
                    <AdminHeader />
                </div>
                <div style={{ flex: 1 }} className='home-admin-container-content'>
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default HomeAdmin;