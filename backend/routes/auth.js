
// backend/routes/auth.js

import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// Async error handler
const wrap = (fn) => (req, res) =>
  fn(req, res).catch((e) =>
    res.status(500).json({ message: e.message })
  );

// Generate token and user response
const out = (u) => ({
  token: jwt.sign(
    { id: u._id, role: u.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  ),
  user: {
    id: u._id,
    name: u.name,
    email: u.email,
    phone: u.phone,
    role: u.role
  },
});

// Authentication middleware
const auth = (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").split(" ")[1];

    req.user = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch {
    res.status(401).json({
      message: "Please login first"
    });
  }
};


// 1. SIGNUP
router.post(
  '/signup',
  wrap(async (req, res) => {
    const { name, email, phone, password, role, staffCode } = req.body;

    if (!name?.trim() || !email?.trim() || !phone || !password || password.length < 6) {
      return res.status(400).json({
        message: 'Name, email, phone and password (min 6) required'
      });
    }

    if (!/^[0-9]{10}$/.test(phone.trim())) {
      return res.status(400).json({
        message: 'Please enter a valid 10-digit phone number'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (await User.findOne({ email: cleanEmail })) {
      return res.status(400).json({
        message: 'Email already registered'
      });
    }

    let finalRole = 'student';

    if (['faculty', 'admin'].includes(role)) {
      if (staffCode !== process.env.STAFF_CODE) {
        return res.status(403).json({
          message: 'Invalid staff code'
        });
      }

      finalRole = role;
    }

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone.trim(),
      password: await bcrypt.hash(password, 10),
      role: finalRole,
    });

    res.status(201).json(out(user));
  })
);


// 2. LOGIN
router.post(
  '/login',
  wrap(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: (email || '').toLowerCase().trim()
    });

    if (!user || !(await bcrypt.compare(password || '', user.password))) {
      return res.status(400).json({
        message: 'Invalid email or password'
      });
    }

    res.json(out(user));
  })
);


// 3. UPDATE PROFILE (NAME, EMAIL, PHONE)
router.put(
  '/profile',
  auth,
  wrap(async (req, res) => {
    const { name, email, phone } = req.body;

    // Validate name
    if (!name?.trim()) {
      return res.status(400).json({
        message: 'Name is required'
      });
    }

    // Validate email
    if (!email?.trim()) {
      return res.status(400).json({
        message: 'Email is required'
      });
    }

    // Validate phone
    if (!phone || !/^[0-9]{10}$/.test(phone.trim())) {
      return res.status(400).json({
        message: 'Please enter a valid 10-digit phone number'
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    // Check whether email belongs to another account
    const existingUser = await User.findOne({
      email: cleanEmail,
      _id: { $ne: req.user.id }
    });

    if (existingUser) {
      return res.status(400).json({
        message: 'This email is already registered with another account'
      });
    }

    // Find logged-in user
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    // Update profile fields
    user.name = name.trim();
    user.email = cleanEmail;
    user.phone = phone.trim();

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      ...out(user)
    });
  })
);

export default router;
