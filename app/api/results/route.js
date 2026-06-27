import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Result from "@/models/Result";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const student = searchParams.get("student");

    let query = {};
    if (student) query.student = student;

    const records = await Result.find(query)
      .populate("student", "name email")
      .populate("subject", "name");
      
    return NextResponse.json(records, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch results" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json(); 
    
    const newResult = await Result.create(body);
    return NextResponse.json(newResult, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to add result" }, { status: 500 });
  }
}
