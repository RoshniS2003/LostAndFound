
// backend/models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
    },

    password: {
      type: String,
      required: true
    },

    role: {
      type: String,
      enum: ['student', 'faculty', 'admin'],
      default: 'student'
    },
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
