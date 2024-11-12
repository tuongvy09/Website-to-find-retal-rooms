import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
import { GoogleLogin } from "@react-oauth/google";
import { setUser } from "../../redux/userSlice";
import "./Login.css";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        const newUser = {
            username: username,
            password: password,
        };
        loginUser(newUser, dispatch, navigate);
    };

    const handleGoogleLogin = (response) => {
        if (response.error) {
            console.log("Lỗi đăng nhập Google:", response.error);
        } else {
            const { credential } = response;
    
            // Gửi token Google lên backend
            fetch("http://localhost:8000/v1/auth/google", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tokenId: credential }), // Gửi token Google lên backend để xác thực
            })
            .then((res) => res.json())
            .then((data) => {
                console.log("Đăng nhập thành công:", data);
    
                // Cập nhật state với accessToken tự tạo từ backend
                dispatch(setUser({
                    user: data.user,           // Thông tin người dùng trả về từ backend
                    accessToken: data.accessToken,  // AccessToken tự tạo
                }));
    
                // Điều hướng đến trang chủ
                navigate("/");
            })
            .catch((err) => {
                console.error("Lỗi khi đăng nhập Google:", err);
            });
        }
    };
    
    return ( 
        <section className="login-container">
            <div className="login-title"> Đăng nhập</div>
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
                            type="password" 
                            placeholder="Nhập mật khẩu" 
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div><button type="submit"> Đăng nhập </button></div>
                <GoogleLogin
                onSuccess={handleGoogleLogin}
                onError={() => console.log("Lỗi đăng nhập Google")}
            />

            </form>
            <div className="login-register"> Don't have an account yet? </div>
            <Link className="login-register-link" to="/register">Register one for free </Link>
        </section>
    );
}
 
export default Login;