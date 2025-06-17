import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Internship.css"; // Link the CSS

const Internships = () => {
  const [internships, setInternships] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    semester: "",
    section: "",
    year: "",
    month: "",
    endMonth: "",
    endYear: "",
    company: "",
  });
  const [showFilters, setShowFilters] = useState(false);

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const BACKEND_URL = "http://localhost:5000";
  const convertDriveLink = (url) => {
    if (!url) return null;
    const match = url.match(/[-\w]{25,}/);
    return match ? `https://drive.google.com/file/d/${match[0]}/view` : url;
  };

  const buildQuery = () => {
    const queryParams = Object.entries(filters)
      .filter(([_, value]) => value)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    return queryParams.join("&");
  };

  const fetchInternships = async () => {
    const query = buildQuery();
    try {
      const res = await axios.get(`http://localhost:5000/api/admin/internships/filter?${query}`);
      setInternships(Array.isArray(res.data) ? res.data : res.data.internships || []);
    } catch (err) {
      console.error("Error fetching internships:", err);
      setInternships([]);
    }
  };

  useEffect(() => {
    fetchInternships();
  }, [filters]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleFilter = () => {
    fetchInternships();
  };

  const handleClear = () => {
  const cleared = {
    type: "",
    semester: "",
    branch: "",
    year: "",
    month: "",
    endMonth: "",
    endYear: "",
    company: "",
  };
  setFilters(cleared);
  // Call fetchInternships with cleared filters
  setTimeout(() => fetchInternships(), 0); // ensures filters are updated first
};

  useEffect(() => {
  console.log("Internship NOC links:");
  internships.forEach(i => {
    console.log(i.rollNo, i.noc); // or just console.log(i.noc);
  });
}, [internships]);

  const renderStatusBadge = (status) => {
    let color = "secondary";
    if (status === "ongoing") color = "success";
    else if (status === "past") color = "danger";
    else if (status === "future") color = "info";

    return (
      <span className={`badge border border-${color} text-${color} text-capitalize`}>
        {status}
      </span>
    );
  };

  return (
    <div className="internship-page container-fluid mt-5">
      <h1 className="text-center mb-4 fw-bold border-bottom pb-2">Internships</h1>

      <div className="mb-3 text-center">
        <button className="btn btn-outline-dark" onClick={toggleFilters}>
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="card shadow-sm mb-5 filter-card">
          <div className="card-body">
            <h5 className="card-title mb-3 fw-semibold">Filter Internships</h5>
            <div className="row g-3">
              {/* Company */}
              <div className="col-md-3">
                <label className="form-label">Company</label>
                <input
                  type="text"
                  className="form-control"
                  name="company"
                  value={filters.company}
                  onChange={handleChange}
                />
              </div>

              {/* Status */}
              <div className="col-md-3">
                <label className="form-label">Status</label>
                <select className="form-select" name="type" value={filters.type} onChange={handleChange}>
                  <option value="">All Status</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="past">Past</option>
                  <option value="future">Upcoming</option>
                </select>
              </div>

              {/* Semester */}
              <div className="col-md-3">
                <label className="form-label">Semester</label>
                <select className="form-select" name="semester" value={filters.semester} onChange={handleChange}>
                  <option value="">All Semesters</option>
                  <option value="II-I">2-1</option>
                  <option value="II-II">2-2</option>
                  <option value="III-I">3-1</option>
                  <option value="III-II">3-2</option>
                  <option value="IV-I">4-1</option>
                  <option value="IV-II">4-2</option>
                </select>
              </div>

              {/* Branch */}
              <div className="col-md-3">
                <label className="form-label">Branch</label>
                <select
                  className="form-select me-4"
                  value={filters.branch}
                  onChange={(e) => setFilters({ ...filters, branch: e.target.value })}
                >
                  <option value="">All Branches</option>
                  {[
                    "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL",
                    "AI&ML", "AI&DS", "CSBS", "IoT", "AIDS", "Other"
                  ].map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>

              {/* Start Year */}
              <div className="col-md-3">
                <label className="form-label">Start Year</label>
                <select className="form-select" name="year" value={filters.year} onChange={handleChange}>
                  <option value="">All Years</option>
                  {[2023, 2024, 2025, 2026].map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              {/* Start Month */}
              <div className="col-md-3">
                <label className="form-label">Start Month</label>
                <select className="form-select" name="month" value={filters.month} onChange={handleChange}>
                  <option value="">All Months</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December",
                  ].map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>

              {/* End Month */}
              <div className="col-md-3">
                <label className="form-label">End Month</label>
                <select className="form-select" name="endMonth" value={filters.endMonth} onChange={handleChange}>
                  <option value="">All Months</option>
                  {[
                    "January", "February", "March", "April", "May", "June",
                    "July", "August", "September", "October", "November", "December",
                  ].map((m, i) => (
                    <option key={i + 1} value={i + 1}>{m}</option>
                  ))}
                </select>
              </div>

              {/* End Year */}
              <div className="col-md-3">
                <label className="form-label">End Year</label>
                <select className="form-select" name="endYear" value={filters.endYear} onChange={handleChange}>
                  <option value="">All Years</option>
                  {[2023, 2024, 2025, 2026].map((yr) => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="col-md-3 d-flex align-items-end">
                <button className="btn btn-primary w-100" onClick={handleFilter}>
                  Apply Filter
                </button>
              </div>

              <div className="col-md-3 d-flex align-items-end">
                <button className="btn btn-outline-secondary w-100" onClick={handleClear}>
                  Clear Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card shadow-sm internship-table">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Roll No</th>
                  <th>Organization</th>
                  <th>Role</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Semester</th>
                  <th>Branch</th>
                  <th>Documents</th>
                </tr>
              </thead>
              <tbody>
                {internships.map((i) => (
                  <tr key={i._id}>
                    <td>{i.rollNo}</td>
                    <td>{i.organizationName}</td>
                    <td>{i.role}</td>
                    <td>{new Date(i.startingDate).toLocaleDateString()}</td>
                    <td>{new Date(i.endingDate).toLocaleDateString()}</td>
                    <td>{renderStatusBadge(i.status)}</td>
                    <td>{i.semester || "-"}</td>
                    <td>{i.branch || "-"}</td>
                    <td className="docs">
                      {i.applicationLetter && (
                        <a
                          href={
                            i.applicationLetter.includes("drive.google.com")
                              ? convertDriveLink(i.applicationLetter)
                              : `${BACKEND_URL}${i.applicationLetter}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          📄 Application
                        </a>
                      )}{" "}
                      {i.offerLetter && (
                        <a
                          href={
                            i.offerLetter.includes("drive.google.com")
                              ? convertDriveLink(i.offerLetter)
                              : `${BACKEND_URL}${i.offerLetter}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          📄 Offer
                        </a>
                      )}{" "}
                      {i.noc ? (
                        <a
                          href={
                            i.noc.includes("drive.google.com")
                              ? convertDriveLink(i.noc)
                              : `${BACKEND_URL}${i.noc}`
                          }
                          target="_blank"
                          rel="noreferrer"
                        >
                          📄 NOC
                        </a>
                      ) : (
                        <span className="text-muted">NOC not uploaded</span>
                      )}
                    </td>
                  </tr>
                ))}
                {internships.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      No internships found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Internships;
