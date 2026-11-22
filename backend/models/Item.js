// backend/models/Item.js
import mongoose from "mongoose";

const itemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['lost', 'found'],
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true
    },
    description: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    photo: {
      type: String,
      default: ''
    },
    isApproved: {
      type: Boolean,
      default: false
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', required: true
    },
  },
  { timestamps: true }
);

export default mongoose.model('Item', itemSchema);