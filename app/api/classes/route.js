import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Class from "@/models/Class";


export async function GET() {
  try {
    await connectDB();
    const classes = await Class.find({});
    return NextResponse.json(classes);
  } catch (error) {
    console.error("Error fetching classes:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { name } = await req.json();

    if (!name || !name.trim()) {
      return NextResponse.json({ message: "Class name is required" }, { status: 400 });
    }

    const newClass = await Class.create({
      name: name.trim(),
      students: [],
      subjects: [],
    });

    return NextResponse.json(newClass, { status: 201 });
  } catch (error) {
    console.error("Error adding class:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
