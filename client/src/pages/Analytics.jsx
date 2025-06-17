import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const Analytics = () => {
  const [branchData, setBranchData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');

  const knownBranches = [
    "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL",
    "AI&ML", "AI&DS", "CSBS", "IoT", "AIDS", "Other"
  ];

  const fetchAnalytics = async (status = 'all', year = '', month = '') => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/analytics', {
        params: { status, year, month }
      });
      console.log('Analytics Data:', res.data);

      // Sort branch data in predefined order
      const sortedBranchData = [...res.data.branchData].sort(
        (a, b) => knownBranches.indexOf(a.branch) - knownBranches.indexOf(b.branch)
      );

      setBranchData(sortedBranchData);
      setSemesterData(res.data.semesterData);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics(statusFilter, yearFilter, monthFilter);
  }, [statusFilter, yearFilter, monthFilter]);

  return (
    <div className="analytics-container" style={{ padding: '1rem' }}>
      <h2>Internship Analytics</h2>

      {/* Filters */}
      <div className='d-flex'>
        <select
          className="form-select me-5 w-25"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">Select Year</option>
          {[2023, 2024, 2025, 2026].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          className="form-select w-25"
          value={monthFilter}
          onChange={(e) => setMonthFilter(e.target.value)}
        >
          <option value="">Select Month</option>
          {[
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
          ].map((month, i) => (
            <option key={i + 1} value={i + 1}>{month}</option>
          ))}
        </select>
      </div>

      <h3 className='mt-4'>Branch-wise Internships</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={branchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="branch" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#6a5acd" strokeWidth={2.5} />
        </LineChart>
      </ResponsiveContainer>

      <h3>Semester-wise Internships</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={semesterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="semester" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#3cb371" strokeWidth={2.5} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Analytics;
