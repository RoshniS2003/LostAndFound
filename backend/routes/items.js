
// backend/routes/items.js

import express from "express";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import Fuse from "fuse.js";
import Item from "../models/Item.js";

const router = express.Router();

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Multer image upload configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Upload image to Cloudinary
const uploadToCloud = (buffer) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        { folder: "lostfound" },
        (err, result) =>
          err ? reject(err) : resolve(result.secure_url)
      )
      .end(buffer);
  });

// Async error handler
const wrap = (fn) => (req, res) =>
  fn(req, res).catch((e) =>
    res.status(500).json({ message: e.message })
  );

// Authentication middleware
const auth = (req, res, next) => {
  try {
    const token = (req.headers.authorization || "").split(" ")[1];

    req.user = jwt.verify(token, process.env.JWT_SECRET);

    next();
  } catch {
    res.status(401).json({ message: "Please login first" });
  }
};

// Validate MongoDB ID
router.param("id", (req, res, next, id) =>
  mongoose.isValidObjectId(id)
    ? next()
    : res.status(404).json({ message: "Item not found" })
);


// 1. GET ALL LOST AND FOUND ITEMS
router.get(
  "/",
  wrap(async (req, res) => {
    const { type, category, q } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (category) filter.category = category;

    if (q) {
      const rx = new RegExp(
        q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        "i"
      );

      filter.$or = [
        { title: rx },
        { description: rx },
        { location: rx },
      ];
    }

    const items = await Item.find(filter)
      .sort("-createdAt")
      .populate("user", "name");

    res.json(items);
  })
);


// 2. GET MY REPORTED ITEMS
router.get(
  "/mine",
  auth,
  wrap(async (req, res) => {
    const items = await Item.find({
      user: req.user.id,
    })
      .sort("-createdAt")
      .populate("user", "name");

    res.json(items);
  })
);


// 3. GET SINGLE ITEM DETAILS
router.get(
  "/:id",
  auth,
  wrap(async (req, res) => {
    const item = await Item.findById(req.params.id)
      .populate("user", "name email");

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    res.json(item);
  })
);


// 4. FIND MATCHING LOST AND FOUND ITEMS
router.get(
  "/:id/matches",
  auth,
  wrap(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    const others = await Item.find({
      type: item.type === "lost" ? "found" : "lost",
    }).populate("user", "name");

    const fuse = new Fuse(others, {
      keys: ["title", "description"],
      includeScore: true,
      threshold: 0.6,
      ignoreLocation: true,
    });

    const best = new Map();

    [item.title, `${item.title} ${item.description}`].forEach((q) =>
      fuse.search(q).forEach((r) => {
        const old = best.get(r.item.id);

        if (!old || r.score < old.score) {
          best.set(r.item.id, {
            item: r.item,
            score: r.score,
          });
        }
      })
    );

    const list = [...best.values()]
      .sort((a, b) => a.score - b.score)
      .slice(0, 5)
      .map((m) => ({
        ...m.item.toObject(),
        match: Math.round((1 - m.score) * 100),
      }));

    res.json(list);
  })
);


// 5. SUBMIT LOST OR FOUND REPORT
router.post(
  "/",
  auth,
  upload.single("photo"),
  wrap(async (req, res) => {
    const {
      type,
      title,
      category,
      description,
      location,
      date,
    } = req.body;

    if (
      !["lost", "found"].includes(type) ||
      !title ||
      !category ||
      !location ||
      !date
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const photo = req.file
      ? await uploadToCloud(req.file.buffer)
      : "";

    const item = await Item.create({
      type,
      title,
      category,
      description,
      location,
      date,
      photo,
      user: req.user.id,
    });

    res.status(201).json(item);
  })
);


// 6. FACULTY ONLY - VERIFY LOST/FOUND REPORT
router.put(
  "/:id/approve",
  auth,
  wrap(async (req, res) => {

    // Only faculty can verify reports
    if (req.user.role !== "faculty") {
      return res.status(403).json({
        message: "Only faculty can verify reports",
      });
    }

    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    item.isApproved = !item.isApproved;

    await item.save();

    res.json({
      message: item.isApproved
        ? "Report verified successfully"
        : "Report verification removed",
      item,
    });
  })
);


// 7. DELETE ITEM
router.delete(
  "/:id",
  auth,
  wrap(async (req, res) => {
    const item = await Item.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    // Owner or admin can delete
    if (
      item.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "Not allowed",
      });
    }

    await item.deleteOne();

    res.json({
      message: "Deleted successfully",
    });
  })
);

export default router;
