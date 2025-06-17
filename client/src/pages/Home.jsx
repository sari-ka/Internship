import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("No token found in localStorage");
        return;
      }
      const res = await axios.get('http://localhost:5000/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUserProfile(res.data);
    } catch (error) {
      console.error("Failed to fetch user profile:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <img
          src="https://media.licdn.com/dms/image/v2/C560BAQFKt8O5GdaFjw/company-logo_200_200/company-logo_200_200/0/1680080095222/vnr_vignanajyothiinstituteofengineeringandtechnology_logo?e=2147483647&v=beta&t=nV3OFiSPyeDZdeZib-pHBlNwN-i1S73KwQljcRw3FvY"
          alt="VNR Logo"
          className="home-logo"
        />
        <h1 className="home-title">VNR Vignana Jyothi Institute of Engineering and Technology</h1>
        <button className="home-logout-btn" onClick={handleLogout}>Logout</button>
        <button className="home-profile-btn" onClick={() => navigate('/profile')}>👤</button>
      </div>

      <div className="home-main">
        <h2 className="home-subtitle">Welcome to the UG/PG Internship Portal</h2>

        <div className="home-grid">
          <div className="home-card">
            <h3>📄 Documents</h3>
            <div className="home-doc-section">
              <a href="" download>Letter of Recommendation Template</a>
            </div>
            <div className="home-doc-section">
              <a href="" download>No Objection Certificate (NOC)</a>
            </div>
          </div>

          <div className="home-card">
            <h3>📝 Apply</h3>
            <button onClick={() => navigate('/apply')}>Fill Application Form</button>
          </div>

          <div className="home-card">
            <h3>📤 Submit Feedback</h3>
            <button onClick={() => navigate('/upload')}>Upload Feedback Form</button>
          </div>
        </div>
      </div>
    </div>
  );
}
