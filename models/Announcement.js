import mongoose from "mongoose";

const AnnouncementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    targetRoles: [{ type: String, enum: ["admin", "teacher", "student"] }],
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" },
  },
  { timestamps: true }
);

export default mongoose.models.Announcement || mongoose.model("Announcement", AnnouncementSchema);
