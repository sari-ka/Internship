import React from 'react';
import { useNavigate } from 'react-router-dom';
// import './Lanxding.css';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* 🔵 HEADER */}
      <div className="header d-flex align-items-center mb-4 p-3">
        <img
          src="https://media.licdn.com/dms/image/v2/C560BAQFKt8O5GdaFjw/company-logo_200_200/company-logo_200_200/0/1680080095222/vnr_vignanajyothiinstituteofengineeringandtechnology_logo?e=2147483647&v=beta&t=nV3OFiSPyeDZdeZib-pHBlNwN-i1S73KwQljcRw3FvY"
          alt="VNR Vignana Jyothi Logo"
          style={{ width: '80px', height: '80px', marginRight: '15px' }}
        />
        <h1 className="mb-0">VNR Vignana Jyothi Institute of Engineering and Technology</h1>
      </div>

      {/* 🟢 Main Content */}
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
              className="card-img-top p-2"
              alt="Admin"
              style={{ height: '200px', objectFit: 'contain' }}
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
              className="card-img-top p-2"
              alt="Student"
              style={{ height: '200px', objectFit: 'contain' }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">Student Login</h5>
              <p className="card-text text-muted">For VNRVJIET students.</p>
              <button className="btn btn-success">Login as Student</button>
            </div>
          </div>

          {/* Guest Card */}
          <div
            className="card shadow-lg"
            style={{ width: '22rem', cursor: 'pointer' }}
            onClick={() => navigate('/guest-login')}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
              className="card-img-top p-2"
              alt="Guest"
              style={{ height: '200px', objectFit: 'contain' }}
            />
            <div className="card-body text-center">
              <h5 className="card-title">Guest Login</h5>
              <p className="card-text text-muted">For visitors and recruiters.</p>
              <button className="btn btn-warning">Login as Guest</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
