import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";
const router = express.Router();
// ================= REGISTER USER =================
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({
        error: "Please fill all fields."
      });
    }
    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });
    if (existingUser) {
      return res.status(400).json({
        error: "Email already registered."
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      username,
      email: email.toLowerCase(),
      password: hashedPassword
    });
    await newUser.save();
    // Generate JWT immediately after registration
    const token = jwt.sign(
      {
        id: newUser._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );
    res.status(201).json({
      message: "Registration successful.",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email
      }
    });
  }
  catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
// ================= LOGIN USER =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({
        error: "Please fill all fields."
      });
    }
    const user = await User.findOne({
      email: email.toLowerCase()
    });
    if (!user) {
      return res.status(400).json({
        error: "Invalid email or password."
      });
    }
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );
    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid email or password."
      });
    }
    const token = jwt.sign(
      {
        id: user._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );
    res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  }
  catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
// ================= UPDATE PROFILE =================
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const {
      username,
      currentPassword,
      newPassword
    } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        error: "User not found."
      });
    }
    // Update Username
    if (
      username &&
      username.trim() !== ""
    ) {
      user.username = username.trim();
    }
    // Update Password
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          error: "Current password is required."
        });
      }
      const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
      );
      if (!isMatch) {
        return res.status(400).json({
          error: "Current password is incorrect."
        });
      }
      user.password = await bcrypt.hash(
        newPassword,
        10
      );
    }
    await user.save();
    res.json({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  }
  catch (err) {
    res.status(500).json({
      error: err.message
    });
  }
});
export default router;