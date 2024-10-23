import axios from "axios";
import { loginFailed, loginStart, loginSuccess, logoutFailed, logoutStart, logoutSuccess, registerFailed, registerStart, registerSuccess } from "./authSlide";

export const loginUser = async(user, dispatch, navigate) =>{
    axios.defaults.baseURL = 'http://localhost:8000';
    dispatch(loginStart());
    try{
        const res = await axios.post("/v1/auth/login", user);
        const userData = res.data; // Lưu dữ liệu user từ phản hồi API

        dispatch(loginSuccess(userData));

        // Kiểm tra username để điều hướng
        if (userData.admin === true) {
            navigate("/admin-dashboard");
        } else {
            navigate("/");
        }
    }catch(err){
        if (err.response) {
            console.error("Login error:", err.response.data);
            const errorMessage = err.response.data.message || "Login failed"; 
            console.error("Error message:", errorMessage);
        } else {
            console.error("Login error:", err.message);
        }
        dispatch(loginFailed());
    }
};

export const registerUser = async(user, dispatch, navigate) =>{
    axios.defaults.baseURL = 'http://localhost:8000';
    dispatch(registerStart());
    try{
        const res = await axios.post("/v1/auth/register", user);
        dispatch(registerSuccess((await res).data));
        navigate("/login");
    }catch(err){
        if (err.response) {
        console.error("Register error:", err.response.data);
        // Optionally, you can access a specific error message if it exists
        const errorMessage = err.response.data.message || "Register failed"; 
        console.error("Error message:", errorMessage);
    } else {
        console.error("Register error:", err.message);
    }
    dispatch(registerFailed());
    }
};

// export const logout = async (dispatch, id, navigate, accessToken, axiosJWT) => {
//     axios.defaults.baseURL = 'http://localhost:8000';
//     dispatch(logoutStart());
//     try {
//         const res = await axiosJWT.post("/v1/auth/logout", id, {
//             headers: {token: `Bearer ${accessToken}`}
//         }); 
//         dispatch(logoutSuccess(res.data)); 
//         navigate("/"); 
//     } catch (err) {
//         if (err.response) {
//             console.error("Logout error:", err.response.data);
//             const errorMessage = err.response.data.message || "Logout failed"; 
//             console.error("Error message:", errorMessage);
//         } else {
//             console.error("Logout error:", err.message);
//         }
//         dispatch(logoutFailed()); 
//     }
// };
export const logout = async (dispatch, username, password, navigate) => {
    axios.defaults.baseURL = 'http://localhost:8000';
    dispatch(logoutStart());
    try {
        const res = await axios.post("/v1/auth/logout", { username, password });
        dispatch(logoutSuccess(res.data)); 
        navigate("/"); 
    } catch (err) {
        if (err.response) {
            console.error("Logout error:", err.response.data);
            const errorMessage = err.response.data.message || "Logout failed"; 
            console.error("Error message:", errorMessage);
        } else {
            console.error("Logout error:", err.message);
        }
        dispatch(logoutFailed()); 
    }
};