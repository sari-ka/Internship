const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Internship = require('../models/Internship');
const Feedback = require('../models/Feedback');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Basic test route for admin
router.get('/', async (req, res) => {
  try {
    const admins = await Admin.find();
    res.json({ message: "admin", payload: admins });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Filter internships with query params including company acronym matching
router.get('/internships/filter', async (req, res) => {
  const { type, semester, branch, year, month, endYear, endMonth, company } = req.query;
  const today = new Date();

  const knownBranches = [
    "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL",
    "AI&ML", "AI&DS", "CSBS", "IoT", "AIDS"
  ];

  const matchesAcronym = (query, name) => {
    const acronym = name
      .split(/\s+/)
      .map(word => word[0].toUpperCase())
      .join('');
    return acronym.includes(query.toUpperCase());
  };

  try {
    let dateQuery = {};
    if (type === 'ongoing') {
      dateQuery = { startingDate: { $lte: today }, endingDate: { $gte: today } };
    } else if (type === 'past') {
      dateQuery = { endingDate: { $lt: today } };
    } else if (type === 'future') {
      dateQuery = { startingDate: { $gt: today } };
    }

    let internships = await Internship.find(dateQuery);

    // Filter by starting date year and month
    if (year) {
      internships = internships.filter(i => new Date(i.startingDate).getFullYear().toString() === year);
    }
    if (month) {
      internships = internships.filter(i => (new Date(i.startingDate).getMonth() + 1).toString() === month);
    }

    // Filter by ending date year and month
    if (endYear) {
      internships = internships.filter(i => new Date(i.endingDate).getFullYear().toString() === endYear);
    }
    if (endMonth) {
      internships = internships.filter(i => (new Date(i.endingDate).getMonth() + 1).toString() === endMonth);
    }

    // Filter by company name or acronym
    if (company) {
      internships = internships.filter(i => {
        const regex = new RegExp(company, 'i');
        return regex.test(i.organizationName) || matchesAcronym(company, i.organizationName);
      });
    }

    // Fetch all students first
    let students = await User.find();
    
    // Apply semester filter
    if (semester) {
      students = students.filter(s => s.semester === semester);
    }

    // Apply branch filter with "Other" logic
    if (branch) {
      if (branch === "Other") {
        students = students.filter(s => !knownBranches.includes(s.branch));
      } else {
        students = students.filter(s => s.branch === branch);
      }
    }

    // Map for fast access
    const studentMap = {};
    students.forEach(s => {
      studentMap[s.rollNo] = s;
    });

    // Final filter
    const filteredInternships = internships
      .filter(i => studentMap[i.rollNo])
      .map(i => {
        const student = studentMap[i.rollNo];
        const start = new Date(i.startingDate);
        const end = new Date(i.endingDate);
        let status = "";
        if (today < start) status = "future";
        else if (today > end) status = "past";
        else status = "ongoing";

        return {
          ...i.toObject(),
          status,
          semester: student.semester || null,
          branch: student.branch || null,
        };
      });

    res.json(filteredInternships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update internship status
router.patch('/internships/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const updated = await Internship.findByIdAndUpdate(id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Users with optional semester and section filters
router.get('/Users', async (req, res) => {
  try {
    const { semester, branch } = req.query;

    const query = {};
    if (semester) query.semester = semester;

    const knownBranches = ["CSE", "IT", "ECE", "EEE", "MECH", "CIVIL", "AI&ML", "AI&DS", "CSBS", "IoT", "AIDS"];

    if (branch) {
      if (branch === "OTHER") {
        query.branch = { $nin: knownBranches }; // Not in the known list
      } else {
        query.branch = branch;
      }
    }

    const users = await User.find(query);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Dashboard stats
router.get('/dashboard-stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalInternships = await Internship.countDocuments();
    const totalFeedbacks = await Feedback.countDocuments();
    const pendingInternships = await Internship.countDocuments({ status: 'Pending' });

    res.json({
      totalUsers,
      totalInternships,
      totalFeedbacks,
      pendingInternships,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all internships
router.get('/internships', async (req, res) => {
  try {
    const internships = await Internship.find();
    res.json(internships);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all feedbacks
// Get all feedbacks
router.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 }); // latest first
    res.json(feedbacks);
  } catch (err) {
    console.error('Error fetching feedbacks:', err);
    res.status(500).json({ error: 'Failed to fetch feedbacks' });
  }
});

// Submit feedback with basic validation
router.post('/feedbacks', async (req, res) => {
  try {
    const {
      rollNo,
      skillsLearned,
      technicalSkill,
      communicationSkill,
      teamWork,
      timeManagement,
      overallExperience,
    } = req.body;

    // Basic validation
    if (
      !rollNo ||
      !skillsLearned ||
      !technicalSkill ||
      !communicationSkill ||
      !teamWork ||
      !timeManagement ||
      !overallExperience
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if internship has ended before allowing feedback
    const internship = await Internship.findOne({ rollNo });
    if (!internship) {
      return res.status(400).json({ error: 'No internship found for this roll number' });
    }

    const today = new Date();
    const endingDate = new Date(internship.endingDate);

    if (today < endingDate) {
      return res.status(400).json({ error: 'Feedback can only be submitted after the internship ends' });
    }

    const newFeedback = new Feedback({
      rollNo,
      skillsLearned,
      technicalSkill,
      communicationSkill,
      teamWork,
      timeManagement,
      overallExperience,
    });

    await newFeedback.save();

    res.status(201).json({ message: 'Feedback submitted successfully' });
  } catch (err) {
    console.error('Feedback submission error:', err);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Analytics route: branch & semester counts for internships with optional filters
router.get('/analytics', async (req, res) => {
  try {
    const { status, year, month } = req.query;

    const internships = await Internship.find();
    const users = await User.find();

    const userMap = {};
    users.forEach((u) => {
      if (u.rollNo) {
        userMap[u.rollNo.toUpperCase().trim()] = u;
      }
    });

    const today = new Date();

    const filtered = internships.filter((i) => {
      const roll = i.rollNo?.toUpperCase().trim();
      const user = userMap[roll];
      if (!user) return false;

      const start = new Date(i.startingDate);
      const end = new Date(i.endingDate);

      let internshipStatus = "";
      if (today < start) internshipStatus = "future";
      else if (today > end) internshipStatus = "past";
      else internshipStatus = "ongoing";

      if (status && status !== "all" && internshipStatus !== status) return false;
      if (year && start.getFullYear().toString() !== year) return false;
      if (month && (start.getMonth() + 1).toString() !== month) return false;

      i.branch = user.branch;
      i.semester = user.semester;
      return true;
    });

    const knownBranches = [
      "CSE", "IT", "ECE", "EEE", "MECH", "CIVIL",
      "AI&ML", "AI&DS", "CSBS", "IoT", "AIDS"
    ];

    const branchCounts = {};
    const semesterCounts = {};

    // Initialize all known branches with 0
    knownBranches.forEach(branch => {
      branchCounts[branch] = 0;
    });
    branchCounts["Other"] = 0; // Add "Other"

    filtered.forEach((item) => {
      const branch = item.branch || "Unknown";
      const semester = item.semester || "Unknown";

      if (knownBranches.includes(branch)) {
        branchCounts[branch]++;
      } else {
        branchCounts["Other"]++;
      }

      semesterCounts[semester] = (semesterCounts[semester] || 0) + 1;
    });

    res.json({
      branchData: Object.entries(branchCounts).map(([branch, count]) => ({ branch, count })),
      semesterData: Object.entries(semesterCounts).map(([semester, count]) => ({ semester, count })),
    });
  } catch (err) {
    console.error("Analytics Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// Get User + their internships by roll number
router.get('/roll/:rollNo', async (req, res) => {
  try {
    const rollNo = req.params.rollNo.toUpperCase();

    const userData = await User.findOne({ rollNo });
    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    const internships = await Internship.find({ rollNo });
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
      user: userData,
      internships: detailedInternships
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


// Admin login with JWT token generation
router.get('/login/:adminID/:password', async (req, res) => {
  const { adminID, password } = req.params;

  try {
    const admin = await Admin.findOne({ adminID });
    console.log(admin)
    if (!admin) {
      return res.status(400).json({ msg: 'Invaczlid credentials',admin:{admin} });
    }

    // If you store hashed passwords, use bcrypt.compare here
    // For now, comparing plain text as per your example
    if (admin.password !== password) {
      return res.status(400).json({ msg: 'Invasdfcbcbblid credentials',admin:{admin} });
    }
    const payload = { adminID: admin.adminID, name: admin.name };
    const token = jwt.sign(payload, 'your_jwt_secret', { expiresIn: '2h' });

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error'.admin);
  }
});

router.get('/add', async (req, res) => {

  try {
    const admin = await Admin.find();
      return res.status(400).json({admin:{admin} });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error'.admin);
  }
});
module.exports = router;
