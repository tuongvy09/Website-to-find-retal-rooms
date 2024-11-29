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
  BarElement, 
  Title,
  Tooltip,
  Legend
);

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.login?.currentUser);
  const [chartData, setChartData] = useState(null);
  const [chartTitle, setChartTitle] = useState("");
  const [activeStat, setActiveStat] = useState("date");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  useEffect(() => {
    if (!user || !user.accessToken) {
      window.location.href = "/login";
    } else if (user.admin !== true) {
      window.location.href = "/";
    }
  }, [user]);

  const fetchData = async (type) => {
    setLoading(true);
    setError(null);

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
      setChartData(getEmptyChartData(type)); // Biểu đồ trống
    } finally {
      setLoading(false);
    }
  };

  const processChartData = (data, type) => {
    if (!data || data.length === 0) {
      setChartData(getEmptyChartData(type));
      return;
    }

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

  // Hàm tạo dữ liệu biểu đồ trống
  const getEmptyChartData = (type) => ({
    labels: type === "date" ? ["Ngày 1", "Ngày 2", "Ngày 3"] : ["Danh mục 1", "Danh mục 2", "Danh mục 3"],
    datasets: [
      {
        label: "Dữ liệu trống",
        data: [0, 0, 0],
        backgroundColor: "#e0e0e0",
        borderColor: "#9e9e9e",
        borderWidth: 1,
      },
    ],
  });

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
        {activeStat === "date" && (
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
        )}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div className="chart-container">
          <h3>{chartTitle}</h3>
          {chartData && (
            activeStat === "date" ? (
              <Line data={chartData} />
            ) : (
              <Bar data={chartData} />
            )
          )}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;