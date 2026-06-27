import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ["Present", "Absent", "Late"], required: true },
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // teacher marking
  },
  { timestamps: true }
);

export default mongoose.models.Attendance || mongoose.model("Attendance", AttendanceSchema);
