import mongoose from "mongoose";

const TimetableSchema = new mongoose.Schema(
  {
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    dayOfWeek: { type: String, enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"], required: true },
    periods: [
      {
        startTime: { type: String, required: true }, // "09:00 AM"
        endTime: { type: String, required: true },   // "10:00 AM"
        subject: { type: mongoose.Schema.Types.ObjectId, ref: "Subject", required: true },
        teacher: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Timetable || mongoose.model("Timetable", TimetableSchema);
