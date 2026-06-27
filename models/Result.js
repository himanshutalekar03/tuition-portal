import mongoose from "mongoose";

const ResultSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
    examName: { type: String, required: true },
    marksObtained: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // teacher adding
  },
  { timestamps: true }
);

export default mongoose.models.Result || mongoose.model("Result", ResultSchema);
