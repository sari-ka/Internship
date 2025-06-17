import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Login_ad() {
  const [adminID, setAdminID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/login/${adminID}/${password}`);

      localStorage.setItem('token', res.data.token);
      alert('Login successful');
      navigate('/admin'); // Redirect to admin dashboard
    } catch (err) {
      setError('Invalid credentials. Please try again.');
    }
  };

  return (
    <div>
    <div className="header d-flex align-items-center p-3 mb-5">
        <img
          src="https://media.licdn.com/dms/image/v2/C560BAQFKt8O5GdaFjw/company-logo_200_200/company-logo_200_200/0/1680080095222/vnr_vignanajyothiinstituteofengineeringandtechnology_logo?e=2147483647&v=beta&t=nV3OFiSPyeDZdeZib-pHBlNwN-i1S73KwQljcRw3FvY"
          alt="VNR Vignana Jyothi Logo"
          style={{ width: '80px', height: '80px'}}
        />
        <h1 className="text-light">VNR Vignana Jyothi Institute of Engineering and Technology</h1>
      </div>
    <div className="container d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-lg" style={{ maxWidth: '400px', width: '100%' }}>
        
        <h3 className="text-center mb-4">Admin Login</h3>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Admin ID</label>
            <input
              type="text"
              className="form-control"
              value={adminID}
              onChange={(e) => setAdminID(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
    </div>
  );
}

export default Login_ad;
