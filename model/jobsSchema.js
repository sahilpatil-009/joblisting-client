const mongoose = require("mongoose");
const jobSchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
  },
  companyLogoUrl: {
    type: String,
  },
  jobPosition: {
    type: String,
    required: true,
  },
  salary: {
    type: Number,
    required: true,
  },
  jobType: {
    type: String,
    required: true,
    enum: ["full-time", "part-time", "contract", "internship", "freelance"],
  },
  jobMode: {
    type: String,
    required: true,
    enum: ["remote", "office","hybrid"],
  },
  jobLocation: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  aboutCompany: {
    type: String,
    required: true,
  },
  skills: {
    type: [String],
    required: true,
  },
  addInfo: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Job", jobSchema);
