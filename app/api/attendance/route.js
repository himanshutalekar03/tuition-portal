import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Attendance from "@/models/Attendance";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const student = searchParams.get("student");
    const classId = searchParams.get("classId");

    let query = {};
    if (student) query.student = student;
    if (classId) query.classId = classId;

    const records = await Attendance.find(query).populate("student", "name email");
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch attendance" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const { records } = await req.json(); 
    // records: [{ student, classId, date, status, markedBy }]

    if (!records || !Array.isArray(records)) {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const inserted = await Attendance.insertMany(records);
    return NextResponse.json(inserted, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to mark attendance" }, { status: 500 });
  }
}
