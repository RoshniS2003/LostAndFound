// backend/routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const wrap = (fn) => (req, res) =>
  fn(req, res).catch((e) => res.status(500).json({ message: e.message }));

const out = (u) => ({
  token: jwt.sign({ id: u._id, role: u.role }, process.env.JWT_SECRET, { expiresIn: '7d' }),
  user: { id: u._id, name: u.name, email: u.email, role: u.role },
});

router.post(
  '/signup',
  wrap(async (req, res) => {
    const { name, email, password, role, staffCode } = req.body;
    if (!name || !email || !password || password.length < 6)
      return res.status(400).json({ message: 'Name, email and password (min 6) required' });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: 'Email already registered' });

    let finalRole = 'student';
    if (['faculty', 'admin'].includes(role)) {
      if (staffCode !== process.env.STAFF_CODE)
        return res.status(403).json({ message: 'Invalid staff code' });
      finalRole = role;
    }

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      role: finalRole,
    });
    res.status(201).json(out(user));
  })
);

router.post(
  '/login',
  wrap(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || '').toLowerCase() });
    if (!user || !(await bcrypt.compare(password || '', user.password)))
      return res.status(400).json({ message: 'Invalid email or password' });
    res.json(out(user));
  })
);

export default router;