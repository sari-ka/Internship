// src/pages/Landing.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="container-fluid px-0">
      {/* Header */}
      <header className="d-flex align-items-center px-4 py-3 shadow-sm bg-white">
        <img
          src="https://upload.wikimedia.org/wikipedia/en/e/e5/Official_logo_of_VNRVJIET.png" // replace if you have a local logo
          alt="VNRVJIET Logo"
          style={{ height: '60px', marginRight: '15px' }}
        />
        <div>
          <h5 className="mb-0 fw-bold">VNR Vignana Jyothi Institute of Engineering and Technology</h5>
        </div>
      </header>

      {/* Main Content */}
      <div className="d-flex flex-column align-items-center justify-content-center mt-5">
        <h1 className="text-center mb-3 fw-bold">Welcome to the InternE</h1>
        <p className="text-center text-muted mb-5 fs-5">Please select your role to continue</p>

        <div className="row justify-content-center gap-5">
          {/* Admin Card */}
          <div
            className="card shadow-lg"
            style={{ width: '22rem', cursor: 'pointer' }}
            onClick={() => navigate('/admin-login')}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              className="card-img-top p-3"
              alt="Admin"
              style={{ height: '230px', objectFit: 'contain' }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">Admin Login</h5>
              <p className="card-text text-muted">For placement cell and admin staff.</p>
              <button className="btn btn-primary">Login as Admin</button>
            </div>
          </div>

          {/* Student Card */}
          <div
            className="card shadow-lg"
            style={{ width: '22rem', cursor: 'pointer' }}
            onClick={() => navigate('/student-login')}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
              className="card-img-top p-3"
              alt="Student"
              style={{ height: '230px', objectFit: 'contain' }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">Student Login</h5>
              <p className="card-text text-muted">For VNRVJIET students.</p>
              <button className="btn btn-success">Login as Student</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
