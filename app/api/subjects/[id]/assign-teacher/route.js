import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subject from "@/models/Subject";
import User from "@/models/User";
import mongoose from "mongoose";

function isValidObjectId(id) {
  return id && mongoose.Types.ObjectId.isValid(id);
}

export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; // subject ID
    const { teacherId } = await req.json();

    if (!isValidObjectId(id) || !isValidObjectId(teacherId)) {
      return NextResponse.json({ error: "Invalid subject or teacher ID" }, { status: 400 });
    }

    const teacher = await User.findOne({ _id: teacherId, role: "teacher" });
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    const updated = await Subject.findByIdAndUpdate(
      id,
      { teacher: teacherId },
      { new: true }
    ).populate("teacher", "name email");

    if (!updated) {
      return NextResponse.json({ error: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error assigning teacher to subject:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
