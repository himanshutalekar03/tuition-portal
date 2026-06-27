import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Fee from "@/models/Fee";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const student = searchParams.get("student");
    const classId = searchParams.get("classId");

    let query = {};
    if (student) query.student = student;
    if (classId) query.classId = classId;

    const fees = await Fee.find(query)
      .populate("student", "name email")
      .populate("classId", "name");

    return NextResponse.json(fees, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch fees" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const newFee = await Fee.create(body);
    return NextResponse.json(newFee, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create fee record" }, { status: 500 });
  }
}
