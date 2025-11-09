import mongoose from "mongoose";

const photoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String },
  imageUrl: { type: String, required: true },
  publicId: { type: String },
});

const Photo = mongoose.model("Photo", photoSchema);
export default Photo;
