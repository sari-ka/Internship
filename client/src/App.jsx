// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import Students from './pages/Students';
import Internships from './pages/Internships';
import Feedbacks from './pages/Feedbacks';
import Analytics from './pages/Analytics';
import Login_ad from './pages/Login_ad';
import Landing from './pages/Landing';
import PrivateRoute from './components/PrivateRoute'; // ✅ Import here

import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/admin-login" element={<Login_ad />} />

        {/* ✅ Private/Admin-only routes */}
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="internships" element={<Internships />} />
          <Route path="feedbacks" element={<Feedbacks />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
