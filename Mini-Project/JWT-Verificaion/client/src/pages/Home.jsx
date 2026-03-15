import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./home.css";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:3000/auth/home", {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch(() => {
        navigate("/");
      });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="home-page">

      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">AuthApp</div>

        <div className="nav-links">
          <span>Home</span>
          <span>Profile</span>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="home-container">
        <div className="home-card">

          <h1>Welcome 👋</h1>

          <p>You are successfully logged in using JWT Authentication.</p>

          <div className="info-box">
            <p>This page is protected.</p>
            <p>Only logged-in users can access it.</p>
          </div>

        </div>
      </div>
    </div>
  );
}