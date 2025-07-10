import React from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("email");
    navigate("/login");
  };

  return (
    <div className="homepage-container">
      
      {/* HEADER */}
      <header className="homepage-header">
        <div className="header-left">
          <img
            src="https://media.licdn.com/dms/image/v2/C560BAQFKt8O5GdaFjw/company-logo_200_200/company-logo_200_200/0/1680080095222/vnr_vignanajyothiinstituteofengineeringandtechnology_logo?e=2147483647&v=beta&t=nV3OFiSPyeDZdeZib-pHBlNwN-i1S73KwQljcRw3FvY"
            alt="VNR Logo"
          />
          <h1>VNR Vignana Jyothi Institute of Engineering and Technology</h1>
        </div>
        <div className="header-right">
          <button className="icon-button text-dark" onClick={handleLogout}>Logout</button>
          <button className="icon-button text-dark" onClick={() => navigate('/profile')}>👤 Profile</button>
        </div>
      </header>

      <section className="homepage-welcome-section mt-5">
        <h1>UG/PG Internship Portal</h1>
      </section>

      {/* Cards Section */}
      <section className="homepage-cards-section d-flex justify-content-around align-items-center">
        <div className="homepage-document-card shadow">
          <h3>📄 Document Templates</h3>
          <ul className="document-grid">
            <li><a href="/docs/LOR.docx" download>Letter of Recommendation</a></li>
            <li><a href="/docs/NOC-Application.docx" download>NOC Application</a></li>
            <li><a href="/docs/NOC.docx" download>No Objection Certificate (NOC)</a></li>
            <li><a href="/docs/Rules.docx" download>VNR CSE Internship Rules</a></li>
            <li><a href="/docs/VNR-Bonafide-by-HOD-Template.docx" download>VNR Bonafide by HOD</a></li>
            <li><a href="/docs/VNR Application - NOC from HOD to ....docx" download>NOC from HOD to Apply Internship</a></li>
            <li><a href="/docs/VNRVJIET-Header.docx" download>VNRVJIET Header</a></li>
          </ul>
        </div>

        <div className="homepage-action-card shadow">
          <h3>📝 Apply</h3>
          <button onClick={() => navigate('/apply')}>Fill Application Form</button>
        </div>

        <div className="homepage-action-card shadow">
          <h3>📤 Submit Feedback</h3>
          <button onClick={() => navigate('/upload')}>Upload Feedback Form</button>
        </div>
      </section>
    </div>
  );
}