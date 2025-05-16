const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const Internship = require('../models/Internship');
const Feedback = require('../models/Feedback');
const Admin = require('../models/Admin')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

router.get('/',async(req,res)=>{
  const a = await Admin.find();
  res.send({message : "admin", payload : a})
})
router.get('/internships/filter', async (req, res) => {
  const { type, semester, section, year, month, company } = req.query; // Include 'company' in the query
  const today = new Date();
  const matchesAcronym = (query, name) => {
    const acronym = name
      .split(/\s+/) // Split by spaces
      .map(word => word[0].toUpperCase()) // Get the first letter of each word
      .join(''); // Join them to form the acronym

    return acronym.includes(query.toUpperCase()); // Check if acronym contains the query
  };

  try {
    // Filter by date type
    let dateQuery = {};
    if (type === 'ongoing') {
      dateQuery = { startingDate: { $lte: today }, endingDate: { $gte: today } };
    } else if (type === 'past') {
      dateQuery = { endingDate: { $lt: today } };
    } else if (type === 'future') {
      dateQuery = { startingDate: { $gt: today } };
    }

    // Filter internships by date range
    let internships = await Internship.find(dateQuery);

    // Further filter by year & month of startingDate
    if (year) {
      internships = internships.filter(i => new Date(i.startingDate).getFullYear().toString() === year);
    }

    if (month) {
      internships = internships.filter(i => (new Date(i.startingDate).getMonth() + 1).toString() === month);
    }

    // Filter by company name (case insensitive and acronym matching)
    if (company) {
      internships = internships.filter(i => {
        const regex = new RegExp(company, 'i'); // Regular case-insensitive match
        return regex.test(i.organizationName) || matchesAcronym(company, i.organizationName);
      });
    }

    // Find students matching section & semester
    const studentQuery = {};
    if (section) studentQuery.section = section;
    if (semester) studentQuery.semester = semester;

    const students = await Student.find(studentQuery);
    const studentMap = {};
    students.forEach(s => { studentMap[s.rollNumber] = s; });

    // Filter internships with valid student match
    const filteredInternships = internships
      .filter(i => studentMap[i.rollNumber])
      .map(i => {
        const start = new Date(i.startingDate);
        const end = new Date(i.endingDate);
        let status = "";

        if (today < start) status = "future";
        else if (today > end) status = "past";
        else status = "ongoing";

        return {
          ...i.toObject(),
          status,
          semester: studentMap[i.rollNumber]?.semester || null,
          section: studentMap[i.rollNumber]?.section || null,
        };
      });

    res.json(filteredInternships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update Internship Status
// Endpoint: /api/admin/internships/:id/status
router.patch('/internships/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Internship.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/students', async (req, res) => {
  try {
    const { semester, section } = req.query;

    let query = {};
    if (semester) query.semester = semester;
    if (section) query.section = section;

    const students = await Student.find(query);
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Dashboard Stats
// Endpoint: /api/admin/dashboard-stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments();
    const totalInternships = await Internship.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments();
    const pendingInternships = await Internship.countDocuments({ status: 'Pending' });

    res.json({
      totalStudents,
      totalInternships,
      totalFeedbacks,
      pendingInternships,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All Internships
// Endpoint: /api/admin/internships
router.get('/internships', async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// All Feedbacks
// Endpoint: /api/admin/feedbacks
router.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/analytics', async (req, res) => {
  try {
    const { status, year, month } = req.query;

    const internships = await Internship.find();
    const students = await Student.find();

    const studentMap = {};
    students.forEach((s) => {
      studentMap[s.rollNumber] = s;
    });

    const today = new Date();

    // Filter internships based on status, year, and month
    const filtered = internships.filter((i) => {
      const student = studentMap[i.rollNumber];
      if (!student) return false;

      const start = new Date(i.startingDate);
      const end = new Date(i.endingDate);

      let calculatedStatus = '';
      if (today < start) calculatedStatus = 'future';
      else if (today > end) calculatedStatus = 'past';
      else calculatedStatus = 'ongoing';

      // Filter by status
      if (status && status !== 'all' && status !== calculatedStatus) return false;

      // Filter by year
      if (year && start.getFullYear() !== parseInt(year)) return false;

      // Filter by month
      if (month && start.getMonth() + 1 !== parseInt(month)) return false;

      i.branch = student.branch;
      i.semester = student.semester;
      return true;
    });

    // Group by branch & semester
    const branchCounts = {};
    const semesterCounts = {};

    filtered.forEach((item) => {
      const branch = item.branch || 'Unknown';
      const semester = item.semester || 'Unknown';

      branchCounts[branch] = (branchCounts[branch] || 0) + 1;
      semesterCounts[semester] = (semesterCounts[semester] || 0) + 1;
    });

    res.json({
      branchData: Object.entries(branchCounts).map(([branch, count]) => ({ branch, count })),
      semesterData: Object.entries(semesterCounts).map(([semester, count]) => ({ semester, count })),
    });
  } catch (err) {
    console.error('Analytics Fetch Error:', err);
    res.status(500).json({ message: 'Server Error' });
  }
});


router.get("/roll/:rollNumber", async (req, res) => {
  try {
    const rollNumber = req.params.rollNumber;

    // Fetch student
    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Fetch internships linked to student
    const internships = await Internship.find({ rollNumber });

    const today = new Date();

    const detailedInternships = internships.map((internship) => {
      const start = new Date(internship.startingDate);
      const end = new Date(internship.endingDate);

      let status = "";
      if (today < start) status = "future";
      else if (today > end) status = "past";
      else status = "ongoing";

      return {
        internshipID: internship.internshipID,
        organizationName: internship.organizationName,
        role: internship.role,
        startingDate: internship.startingDate,
        endingDate: internship.endingDate,
        status,
      };
    });

    res.json({
      student,
      internships: detailedInternships
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get('/login/:adminID/:password', async (req, res) => {
  const { adminID, password } = req.params;

  try {
    const admin = await Admin.findOne({ adminID : adminID });
    console.log(admin)
    if (!admin || admin.password !== password) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { adminID: admin.adminID, name: admin.name };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '2h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;
