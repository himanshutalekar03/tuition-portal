// app/api/subjects/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Subject from "@/models/Subject";
import User from "@/models/User";
import Class from "@/models/Class";

// GET - Fetch all subjects
export async function GET() {
  try {
    await connectDB();

    const subjects = await Subject.find({})
      .populate({ path: "class", select: "name" })
      .populate({ path: "teacher", select: "name" })
      .lean();

    return NextResponse.json(subjects, { status: 200 });
  } catch (error) {
    console.error("Error fetching all subjects:", error);
    return NextResponse.json({ error: "Failed to fetch subjects" }, { status: 500 });
  }
}

// POST - Add a new subject
export async function POST(request) {
  try {
    await connectDB();

    const { name, classId } = await request.json();

    if (!name) {
      return NextResponse.json({ error: "Subject name is required" }, { status: 400 });
    }

    // If subject must belong to a class
    let assignedClass = null;
    if (classId) {
      assignedClass = await Class.findById(classId);
      if (!assignedClass) {
        return NextResponse.json({ error: "Invalid class ID" }, { status: 400 });
      }
    }

    const newSubject = new Subject({
      name,
      class: assignedClass ? assignedClass._id : null,
    });

    await newSubject.save();

    if (assignedClass) {
      await Class.findByIdAndUpdate(assignedClass._id, {
        $push: { subjects: newSubject._id }
      });
    }

    return NextResponse.json(newSubject, { status: 201 });
  } catch (error) {
    console.error("Error creating subject:", error);
    return NextResponse.json({ error: "Failed to create subject" }, { status: 500 });
  }
}

