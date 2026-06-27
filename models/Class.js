// models/Class.js
import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
});

export default mongoose.models.Class || mongoose.model("Class", ClassSchema);
