// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["admin", "teacher", "student"],
      default: "student",
    },
    // Array of classes for flexibility
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
    // For teachers
    subjects: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
