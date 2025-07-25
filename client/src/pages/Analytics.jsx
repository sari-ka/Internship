import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, LabelList
} from 'recharts';

const Analytics = () => {
  const [branchData, setBranchData] = useState([]);
  const [semesterData, setSemesterData] = useState([]);

  const [statusFilter, setStatusFilter] = useState('all');
  const [yearFilter, setYearFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');

  const knownBranches = ["CSE", "CSBS"];

  const fetchAnalytics = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/analytics', {
        params: {
          status: statusFilter,
          year: yearFilter,
          // month: monthFilter,
          section: sectionFilter
        }
      });

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
    fetchAnalytics();
  }, [statusFilter, yearFilter, monthFilter, sectionFilter]);

  return (
    <div className="analytics-container " style={{ padding: '1rem' }}>
      <h2 className="mb-4 text-center ">📊 Internship Analytics</h2>

      {/* Filters */}
      <div className="d-flex flex-wrap justify-content-center gap-4 mb-4">
        <select
          className="form-select w-auto"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        >
          <option value="">Select Year</option>
          {[2023, 2024, 2025, 2026].map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select
          className="form-select w-auto"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="ongoing">Ongoing</option>
          <option value="past">Past</option>
          <option value="future">Upcoming</option>
        </select>

        <select
          className="form-select w-auto"
          value={sectionFilter}
          onChange={(e) => setSectionFilter(e.target.value)}
        >
          <option value="">All Sections</option>
          {['A', 'B', 'C', 'D'].map((sec) => (
            <option key={sec} value={sec}>{sec}</option>
          ))}
        </select>
      </div>

      <h4 className='text-center mt-5 mb-3'>Branch-wise Internships</h4>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={branchData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="branch" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#6a5acd" barSize={40}>
              <LabelList dataKey="count" position="top" />
            </Bar>
          </BarChart>
        </ResponsiveContainer>


      {/* Semester-wise Chart */}
      <h4 className='text-center mt-5 mb-3'>Semester-wise Internships</h4>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={semesterData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <XAxis dataKey="semester" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3cb371" barSize={40}>
            <LabelList dataKey="count" position="top" />
          </Bar>
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
};

export default Analytics;
