import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const teachers = await User.find({ role: "teacher" })
      .populate({
        path: "subjects",
        populate: { path: "class", model: "Class" }, // include class info of each subject
      })
      .lean();

    return NextResponse.json(teachers, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch teachers" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    const { name, email, password, subjects } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newTeacher = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      subjects: subjects || [],
    });

    return NextResponse.json(newTeacher, { status: 201 });
  } catch (error) {
    console.error("Error creating teacher:", error);
    return NextResponse.json(
      { error: "Failed to create teacher" },
      { status: 500 }
    );
  }
}
