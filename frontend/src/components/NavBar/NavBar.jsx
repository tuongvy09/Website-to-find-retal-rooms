import { useState } from "react";
import { Link } from "react-router-dom";
import "./navbar.css";

const NavBar = () => {
  const [user] = useState(null);
  
  return (
    <nav className="navbar-container">
      <div>
        <h1 className="navbar-title">PhongTroXinh.com</h1> 
      </div>
      <div className="navbar-links"> 
        <Link to="/" className="navbar-home">Home</Link>
        {user ? (
          <>
            <p className="navbar-user">Hi, <span>{user}</span></p>
            <Link to="/logout" className="navbar-logout">Log out</Link>
          </>
        ) : (    
          <>
            <Link to="/login" className="navbar-login">Login</Link>
            <Link to="/register" className="navbar-register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;