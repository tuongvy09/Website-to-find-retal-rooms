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

import React, { useEffect, useState } from "react";
import { Line, Bar } from "react-chartjs-2"; // Import cả Line và Bar chart
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Thêm BarElement cho biểu đồ cột
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import axios from "axios";
import AdminHeader from '../AdminHeader/AdminHeader';
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./AdminDashboard.css";

// Đăng ký các thành phần Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement, // Đăng ký BarElement cho biểu đồ cột
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [chartData, setChartData] = useState(null);
  const [chartTitle, setChartTitle] = useState("");
  const [activeStat, setActiveStat] = useState("date"); // Mặc định là thống kê theo ngày
  const [loading, setLoading] = useState(false); // Quản lý trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Quản lý trạng thái lỗi

  const [startDate, setStartDate] = useState(new Date()); // Ngày bắt đầu
  const [endDate, setEndDate] = useState(new Date()); // Ngày kết thúc

  useEffect(() => {
    if (!user || !user.accessToken) {
      window.location.href = "/login";
    } else if (user.admin !== true) {
      window.location.href = "/";
    }
  }, [user]);

  const fetchData = async (type) => {
    setLoading(true); // Bắt đầu tải dữ liệu
    setError(null); // Reset lỗi nếu có

    let endpoint;
    let title;

    if (!startDate || !endDate) {
      setError("Cả ngày bắt đầu và ngày kết thúc đều là bắt buộc.");
      setLoading(false);
      return;
    }

    switch (type) {
      case "date":
        endpoint = `/v1/posts/by-date?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`;
        title = "Thống Kê Bài Đăng Theo Ngày";
        break;
      case "categories":
        endpoint = "/v1/posts/top-categories";
        title = "Top 7 Loại Hình Cho Thuê Có Nhiều Bài Đăng Nhất";
        break;
      case "provinces":
        endpoint = "/v1/posts/top-provinces";
        title = "Top 7 Tỉnh/Thành Phố Có Nhiều Bài Đăng Nhất";
        break;
      default:
        return;
    }

    try {
      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${user?.accessToken}`,
        },
      });
      processChartData(response.data, type);
      setChartTitle(title);
      setActiveStat(type);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      setError("Có lỗi xảy ra khi tải dữ liệu.");
    } finally {
      setLoading(false);
    }
  };

  // Xử lý và định dạng dữ liệu biểu đồ từ phản hồi API
  const processChartData = (data, type) => {
    const labels = data.map((item) =>
      type === "date" ? item._id : item._id || "Không rõ"
    );
    const counts = data.map((item) => item.count);

    // Kiểm tra loại thống kê để chọn biểu đồ thích hợp
    if (type === "date") {
      setChartData({
        labels,
        datasets: [
          {
            label: "Số lượng bài đăng",
            data: counts,
            fill: false, // Không tô màu vùng dưới đường
            borderColor: "#A3D9A5", // Màu đường
            tension: 0.1, // Độ cong của đường
            borderWidth: 2, // Độ dày của đường
          },
        ],
      });
    } else {
      setChartData({
        labels,
        datasets: [
          {
            label: "Số lượng bài đăng",
            data: counts,
            fill: true,
            backgroundColor: "#B7E4C7", 
            borderColor: "#2D6A4F", 
            tension: 0.1, // Độ cong của đường
            borderWidth: 2,
          },
        ],
      });
    }
  };

  return (
    <>
      <AdminHeader />
      <div className="admin-dashboard">
        <h2>Thống Kê Quản Trị</h2>
        
        <div className="buttons">
          <button
            className={activeStat === "date" ? "active" : ""}
            onClick={() => fetchData("date")}
          >
            Thống Kê Theo Ngày
          </button>
          <button
            className={activeStat === "categories" ? "active" : ""}
            onClick={() => fetchData("categories")}
          >
            Top 7 Loại Hình Cho Thuê
          </button>
          <button
            className={activeStat === "provinces" ? "active" : ""}
            onClick={() => fetchData("provinces")}
          >
            Top 7 Tỉnh/Thành Phố
          </button>
        </div>
  
        {/* Chọn ngày bắt đầu và ngày kết thúc ở dưới các nút thống kê */}
        <div className="date-picker">
          <label>Chọn ngày bắt đầu:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="yyyy/MM/dd"
          />
          <label>Chọn ngày kết thúc:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="yyyy/MM/dd"
          />
        </div>
  
        {/* Hiển thị thông báo lỗi nếu có */}
        {error && <p style={{ color: "red" }}>{error}</p>}
  
        {/* Hiển thị biểu đồ nếu có dữ liệu */}
        {chartData ? (
          <div className="chart-container">
            <h3>{chartTitle}</h3>
            {activeStat === "date" ? (
              <Line data={chartData} />
            ) : (
              <Bar data={chartData} />
            )}
          </div>
        ) : (
          <p>Không có dữ liệu để hiển thị.</p>
        )}
      </div>
    </>
  );
};  

export default AdminDashboard;