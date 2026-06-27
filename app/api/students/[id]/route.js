import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Class from "@/models/Class";
import mongoose from "mongoose";

const isValidObjectId = (id) => id && mongoose.Types.ObjectId.isValid(id);

// GET /api/students/:id -> single student
export async function GET(_, { params }) {
  try {
    await connectDB();
    const {id} = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
    }

    const student = await User.findOne({ _id: id, role: "student" }).populate("class", "name");
    if (!student) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student, { status: 200 });
  } catch (error) {
    console.error("Error fetching student:", error);
    return NextResponse.json({ error: "Failed to fetch student" }, { status: 500 });
  }
}

// PATCH /api/students/:id -> assign/add a class (keeps array, no duplicates)
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const { classId } = await req.json();

    if (!isValidObjectId(id) || !isValidObjectId(classId)) {
      return NextResponse.json({ error: "Invalid student or class ID" }, { status: 400 });
    }

    const cls = await Class.findById(classId);
    if (!cls) {
      return NextResponse.json({ error: "Class not found" }, { status: 404 });
    }

    // Add class to the student's class array (no duplicates)
    const updated = await User.findOneAndUpdate(
      { _id: id, role: "student" },
      { class: classId }, // direct assignment
      { new: true }
    ).populate("class", "name");
    

    if (!updated) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Maintain inverse relation
    await Class.findByIdAndUpdate(classId, { $addToSet: { students: id } });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("Error assigning class to student:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE /api/students/:id -> delete student and clean up class references
export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!isValidObjectId(id)) {
      return NextResponse.json({ error: "Invalid student ID" }, { status: 400 });
    }

    const deleted = await User.findOneAndDelete({ _id: id, role: "student" });
    if (!deleted) {
      return NextResponse.json({ error: "Student not found" }, { status: 404 });
    }

    // Remove the student from any Class.students arrays
    await Class.updateMany({ students: id }, { $pull: { students: id } });

    return NextResponse.json({ message: "Student deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting student:", error);
    return NextResponse.json({ error: "Failed to delete student" }, { status: 500 });
  }
}
