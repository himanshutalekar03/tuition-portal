// app/api/subjects/[id]/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subject from "@/models/Subject";
import mongoose from "mongoose";

// GET - Fetch subject details
export async function GET(_, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const subject = await Subject.findById(id)
      .populate("class")
      .populate("teacher");

    if (!subject) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json(subject);
  } catch (error) {
    console.error("Error fetching subject:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// PATCH - Assign/update teacher or class for a subject
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { teacherId, classId, ...rest } = await request.json();

    const updateData = {
      ...rest,
      ...(teacherId && { teacher: teacherId }),
      ...(classId && { class: classId }),
    };

    const { id } = await params;
    const updatedSubject = await Subject.findByIdAndUpdate(id, updateData, {
      new: true,
    })
      .populate("class")
      .populate("teacher");

    if (!updatedSubject) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSubject);
  } catch (error) {
    console.error("Error updating subject:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Subject.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Subject not found" }, { status: 404 });
    }

    // Cleanup references
    const Class = mongoose.model("Class");
    const User = mongoose.model("User");
    await Class.updateMany({ subjects: id }, { $pull: { subjects: id } });
    await User.updateMany({ subjects: id }, { $pull: { subjects: id } });

    return NextResponse.json({ message: "Subject deleted successfully" });
  } catch (error) {
    console.error("Error deleting subject:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
