import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Assignment from "@/models/Assignment";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");
    const subject = searchParams.get("subject");

    let query = {};
    if (classId) query.classId = classId;
    if (subject) query.subject = subject;

    const assignments = await Assignment.find(query)
      .populate("subject", "name")
      .populate("teacher", "name")
      .populate("classId", "name")
      .sort({ dueDate: 1 });

    return NextResponse.json(assignments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch assignments" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const newAssignment = await Assignment.create(body);
    return NextResponse.json(newAssignment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create assignment" }, { status: 500 });
  }
}
