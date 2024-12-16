const express = require("express");
const router = express.Router();
const User = require("../model/userSchema.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { name, email, mobile, password } = req.body;

  if (!name || !email || !mobile || !password) {
    return res.status(404).json({
      success: false,
      message: "All Fields Required !",
    });
  }

  const exist = await User.findOne({ email });
  if (exist) {
    return res.status(400).json({
      success: false,
      message: "Already Exist !",
    });
  }
  try {
    const hashPass = await bcrypt.hash(password, 10);
    const newUser = new User({
      name,
      email,
      mobile,
      password: hashPass,
    });
    await newUser.save();
    res
      .status(200)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.status(500);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(404).json({
      success: false,
      message: "All Fields Required !",
    });
  }
  try {
    const exist = await User.findOne({ email });
    if (!exist) {
      return res
        .status(400)
        .json({ success: false, message: "User Not found, Please Register !" });
    }

    const samePass = await bcrypt.compare(password, exist.password);
    if (!samePass) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong Username or Password" });
    }

    const payload = { id: exist._id, name:exist.name };
    const token = jwt.sign(payload, process.env.SECRET_KEY, {
      expiresIn: "12hr",
    });

    // Destructure safely
    const { password: hashedPassword, ...userDetails } = exist._doc;
    res.status(200).json({
      success: true,
      message: "Login SUccesfully",
      token,
      user: userDetails,
    });
    // res.cookie("user", userDetails);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
});


module.exports = router;
