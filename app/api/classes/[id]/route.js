import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Class from "@/models/Class";
import Subject from "@/models/Subject";
import User from "@/models/User";
import mongoose from "mongoose";

export async function GET(_, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const classData = await Class.findById(id).populate("students", "name email").populate({
      path: "subjects",
      populate: {
        path: "teacher",
        select: "name", // Select which teacher fields to return
      },
    });

    if (!classData) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json(classData, { status: 200 });
  } catch (error) {
    console.error("Error fetching class details:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}


// PATCH - assign a teacher to a subject within this class
export async function PATCH(req, { params }) {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    await connectDB();
    const { id: classId } = await params;
    const { subjectId, teacherId } = await req.json();

    if (
      !mongoose.Types.ObjectId.isValid(classId) ||
      !mongoose.Types.ObjectId.isValid(subjectId) ||
      !mongoose.Types.ObjectId.isValid(teacherId)
    ) {
      return NextResponse.json(
        { error: "Invalid Class, Subject, or Teacher ID" },
        { status: 400 }
      );
    }

    const teacher = await User.findOne({ _id: teacherId, role: "teacher" }).session(session);
    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found or user is not a teacher." }, { status: 404 });
    }

    const subject = await Subject.findOne({ _id: subjectId, class: classId }).session(session);
    if (!subject) {
      return NextResponse.json({ error: "Subject not found in this class." }, { status: 404 });
    }

    // If subject was assigned to an old teacher, un-assign it
    const oldTeacherId = subject.teacher;
    if (oldTeacherId && oldTeacherId.toString() !== teacherId) {
      await User.updateOne({ _id: oldTeacherId }, { $pull: { subjects: subjectId } }, { session });
    }

    // Assign the subject to the new teacher
    await Subject.updateOne({ _id: subjectId }, { $set: { teacher: teacherId } }, { session });

    // Add the subject to the new teacher's list of subjects
    await User.updateOne({ _id: teacherId }, { $addToSet: { subjects: subjectId } }, { session });

    await session.commitTransaction();

    const updatedSubject = await Subject.findById(subjectId)
      .populate("teacher", "name email")
      .lean();

    return NextResponse.json(
      {
        message: "Teacher assigned to subject successfully.",
        subject: updatedSubject,
      },
      { status: 200 }
    );
  } catch (error) {
    await session.abortTransaction();
    console.error("Error assigning teacher to subject:", error);
    return NextResponse.json(
      { error: error.message || "Failed to assign teacher to subject" },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}

export async function DELETE(_, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const deleted = await Class.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ message: "Class not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Class deleted successfully" });
  } catch (error) {
    console.error("Error deleting class:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}
