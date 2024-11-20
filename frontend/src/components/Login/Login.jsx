import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser, googleLogin } from "../../redux/apiRequest";
import { GoogleLogin } from "@react-oauth/google";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const Login = () => {
  document.title = "Đăng nhập";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); 
  const [errorMessage, setErrorMessage] = useState("");  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.auth.login.currentUser);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.admin === true) {
        navigate("/admin-dashboard");
      } else {
        navigate("/");
      }
    }
  }, [currentUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();  // Ngừng gửi form
    const userData = { username, password };
    await loginUser(userData, dispatch, navigate, setErrorMessage);
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   const newUser = { username, password };
  //   try {
  //     await loginUser(newUser, dispatch, navigate);
  //     setErrorMessage(""); 
  //   } catch (error) {
  //     if (error.response) {
  //       if (error.response.status === 404) {
  //           setErrorMessage("Tên đăng nhập không đúng!");
  //       } else if (error.response.status === 401) {
  //         console.log("Lỗi đăng nhậpzz1122:", error.response);
  //           setErrorMessage("Mật khẩu không đúng!");
  //       } else if (error.response.status === 403) {
  //           toast.error("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ hỗ trợ.");
  //       } else {
  //           setErrorMessage("Đã xảy ra lỗi. Vui lòng thử lại sau.");
  //       }
  //   } 
  //   else {
  //       setErrorMessage("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.");
  //   }    
  //   }
  // };  

  const handleGoogleLogin = (response) => {
    if (response.error) {
      console.log("Lỗi đăng nhập Google:", response.error);
    } else {
      const { credential } = response;
      googleLogin(credential, dispatch, navigate)
        .then(() => toast.success("Đăng nhập Google thành công"))
        .catch((err) => {
          toast.error("Lỗi khi đăng nhập Google.");
          console.error("Lỗi khi đăng nhập Google:", err);
        });
    }
  };

  return (
    <section className="login-container">
      <div className="form-main">
        <div className="form-content">
          <div className="form-wrapper">
            <div className="form-title"> Đăng nhập</div>
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label>Tên đăng nhập:</label>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Nhập tên đăng nhập"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Mật khẩu:</label>
                <div className="input-container">
                  <input
                    type={showPassword ? "text" : "password"} // Thay đổi type dựa trên showPassword
                    placeholder="Nhập mật khẩu"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <span
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)} // Thay đổi trạng thái showPassword
                  >
                    {showPassword ? "🙈" : "👁️"} 
                  </span>
                </div>
              </div>
              <div className="form-group">
                <div className="button-container">
                  <button type="submit"> Đăng nhập </button>
                </div>
              </div>
              <div className="error-message">
                  <p>{errorMessage}</p>
                </div>
              <div className="form-group">
                <div className="form-line">
                  <p>Hoặc</p>
                </div>
                <div className="form-center">
                  <GoogleLogin
                    onSuccess={handleGoogleLogin}
                    onError={() => console.log("Lỗi đăng nhập Google")}
                  />
                </div>
              </div>
              <div className="forgot-password-link">
                <Link to="/forgot-password">Quên mật khẩu?</Link>
              </div>
              <div className="form-group">
                <div className="form-center">
                  <div className="login-register">
                    Don't have an account yet? <br />
                    <Link className="login-register-link" to="/register">
                      Register one for free
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <div className="form-bg"></div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </section>
  );
};

export default Login;