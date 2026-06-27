// models/Note.js
import mongoose from "mongoose";

const NoteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true }, // Cloudinary or local file path
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Note || mongoose.model("Note", NoteSchema);
