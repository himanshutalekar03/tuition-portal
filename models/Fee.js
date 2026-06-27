import mongoose from "mongoose";

const FeeSchema = new mongoose.Schema(
  {
    student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class", required: true },
    amountTotal: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    status: { type: String, enum: ["Paid", "Pending", "Overdue"], default: "Pending" },
    dueDate: { type: Date, required: true },
    payments: [
      {
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        method: { type: String },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Fee || mongoose.model("Fee", FeeSchema);
