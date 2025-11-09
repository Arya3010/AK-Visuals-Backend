import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    imageUrl: { type: String, required: true },
    cloudinaryId: { type: String }, // optional, used for deleting later
  },
  { timestamps: true }
);

export default mongoose.model("Photo", photoSchema);
