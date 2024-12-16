const express = require("express");
const router = express.Router();
const dotenv = require("dotenv");
const Job = require("../model/jobsSchema");
const authMiddleware = require("../middleware/auth.js");

// get all bobs data
router.get("/", async (req, res) => {
  const {
    limit,
    offset,
    salary,
    jobPosition,
    jobType,
    jobMode,
    jobLocation,
    skills,
  } = req.query;
  const query = {};
  if (salary) {
    query.salary = { $gte: salary, $lte: salary };
  }
  if (jobPosition) {
    query.jobPosition = { $regex: jobPosition, $options: "i" };
  }
  if (jobType) {
    query.jobType = jobType;
  }
  if (jobMode) {
    query.jobMode = jobMode;
  }
  if (jobLocation) {
    query.jobLocation = jobLocation;
  }
  if (skills && skills.length > 0) {
    const skillsArray = skills.split(","); // Split skills by comma
    query.skills = { $in: skillsArray }; // atleast one skill match
    // query.skills = { $all: skillsArray };   // all skill must be match
  }

  const jobs = await Job.find(query).skip(offset || 0).limit(limit || 5);
  const count = await Job.countDocuments(query);
  res.status(200).json({ jobs, count });
});

// get specific job data
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  if (!job) {
    res.status(404).json({ success: false, message: "Job Not Found" });
  }
  res.status(200).json(job);
});

// Create job
router.post("/", authMiddleware, async (req, res) => {
  const {
    companyName,
    companyLogoUrl,
    jobPosition,
    salary,
    jobType,
    jobMode,
    jobLocation,
    jobDescription,
    aboutCompany,
    skills,
    addInfo,
  } = req.body;

  if (
    !companyName ||
    !jobPosition ||
    !salary ||
    !jobType ||
    !jobMode ||
    !jobLocation ||
    !jobDescription ||
    !aboutCompany ||
    !skills
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All fields Required" });
  }

  const SkillsArray = skills.split(",").map((skill) => skill.trim());

  try {
    const user = req.user;
    const newJob = new Job({
      companyName,
      companyLogoUrl,
      jobPosition,
      salary,
      jobType,
      jobMode,
      jobLocation,
      jobDescription,
      aboutCompany,
      skills: SkillsArray,
      addInfo,
      user: user.id,
    });
    await newJob.save();
    res.status(200).json({ newJob, message: "New Job Created Succesfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in creating job" });
  }
});

// update job data
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const {
    companyName,
    companyLogoUrl,
    jobPosition,
    salary,
    jobType,
    jobMode,
    jobLocation,
    jobDescription,
    aboutCompany,
    skills,
    addInfo,
  } = req.body;
  const job = await Job.findById(id);

  if (!job) {
    return res.status(404).json({ success: false, message: "Job not found" });
  }

  if (job.user.toString() !== req.user.id) {
    return res.status(401).json({ message: "You are not Authorized" });
  }

  const SkillsArray = Array.isArray(skills) ? skills : skills.split(",").map((skill) => skill.trim());

  try {
    await Job.findByIdAndUpdate(id, {
      companyName,
      companyLogoUrl,
      jobPosition,
      salary,
      jobType,
      jobMode,
      jobLocation,
      jobDescription,
      aboutCompany,
      skills: SkillsArray,
      addInfo,
    });
    res.status(200).json({ message: "Job update" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error in updating job" });
  }
});

// delete job data
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  const userId = req.user.id;
  if (!job) {
    return res.status(404).json({ success: false, message: "Job Not Found" });
  }
  if (userId !== job.user.toString()) {
    return res
      .status(401)
      .json({ success: false, message: "You are Not Authorized" });
  }
  await Job.deleteOne({ _id: id });
  res.status(200).json({ success: true, message: "Job Deleted" });
});

module.exports = router;
