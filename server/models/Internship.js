const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  internshipID: String,
  startingDate: Date,
  endingDate: Date,
  offerLetter: String,
  applicationLetter: String,
  noc: String,
  rollNo: String,
  role: String,
  organizationName: String,
  hrName: String,
  hrEmail: String,
  hrPhone: Number,
  duration: Number,
  package: Number,
  semester: String,
  branch: String,   
  section:String,
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model('internship', InternshipSchema);
