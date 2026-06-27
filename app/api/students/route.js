// app/api/students/route.js
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Class from "@/models/Class";

// GET /api/students -> list all students
export async function GET() {
  try {
    await connectDB();
    const students = await User.find({ role: "student" }).populate("class", "name");
    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
  }
}

// POST /api/students -> create a student (optionally in a class)
export async function POST(req) {
  try {
    await connectDB();
    const { name, email, password, classId } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
    }

    // Unique email check
    const existing = await User.findOne({ email });
    if (existing) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 });
    }

    // Hash password
    const bcrypt = await import("bcryptjs");
    const hashedPassword = await bcrypt.hash(password, 10);

    // Build doc; class is an array in your schema
    const doc = {
      name,
      email,
      password: hashedPassword,
      role: "student",
      class: classId ? [classId] : [],
    };

    const newStudent = await User.create(doc);

    // If a class was chosen, add the student to that Class.students as well
    if (classId) {
      await Class.findByIdAndUpdate(classId, { $addToSet: { students: newStudent._id } });
    }

    // Return populated for UI convenience
    await newStudent.populate("class", "name");
    return NextResponse.json(newStudent, { status: 201 });
  } catch (error) {
    console.error("Error creating student:", error);
    return NextResponse.json({ error: "Failed to create student" }, { status: 500 });
  }
}
