import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Timetable from "@/models/Timetable";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const classId = searchParams.get("classId");

    let query = {};
    if (classId) query.classId = classId;

    const timetables = await Timetable.find(query)
      .populate("classId", "name")
      .populate("periods.subject", "name")
      .populate("periods.teacher", "name");

    return NextResponse.json(timetables, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch timetable" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const newTimetable = await Timetable.create(body);
    return NextResponse.json(newTimetable, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create timetable" }, { status: 500 });
  }
}
