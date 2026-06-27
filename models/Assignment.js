import mongoose from "mongoose";

const AssignmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    fileUrl: { type: String },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    dueDate: { type: Date, required: true },
    submissions: [
      {
        student: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        fileUrl: { type: String },
        submittedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ["Pending", "Submitted", "Late", "Graded"], default: "Submitted" },
        grade: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Assignment || mongoose.model("Assignment", AssignmentSchema);
