import cloudinary from "../utils/cloudinary.js";
import Photo from "../models/Photo.js";
import fs from "fs";

export const uploadPhoto = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "ak-visuals",
    });

    const newPhoto = new Photo({
      title: req.body.title,
      description: req.body.description,
      imageUrl: result.secure_url,
      cloudinaryId: result.public_id,
    });

    await newPhoto.save();
    fs.unlinkSync(req.file.path); // remove local file after upload

    res.status(201).json({ message: "Photo uploaded successfully", newPhoto });
  } catch (error) {
    console.error("❌ Upload error:", error);
    res.status(500).json({ error: "Failed to upload photo" });
  }
};
