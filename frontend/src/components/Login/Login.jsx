import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../../redux/apiRequest";
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
            </form>
            <div className="login-register"> Don't have an account yet? </div>
            <Link className="login-register-link" to="/register">Register one for free </Link>
        </section>
    );
}
 
export default Login;