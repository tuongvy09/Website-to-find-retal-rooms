import { useState } from 'react';
import RoomPost from '../Post/RoomPost';

const Home = () => {
  const [user, setUser] = useState(null); 

  const handleLogout = () => {
    setUser(null); 
  };

  return (
    <div className="home-container">
      <h2>Welcome to Home</h2>
      <RoomPost/>
      {user ? (
        <>
          <p>Hello, {user}</p>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : null} 
    </div>
  );
};

export default Home;