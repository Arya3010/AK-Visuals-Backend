import express from "express";
import Photo from "../models/photoModel.js";

const router = express.Router();

// GET all photos
router.get("/", async (req, res) => {
  const photos = await Photo.find();
  res.json(photos);
});

// POST new photo
router.post("/", async (req, res) => {
  const { title, imageUrl, category } = req.body;
  const photo = new Photo({ title, imageUrl, category });
  await photo.save();
  res.status(201).json(photo);
});

export default router;
