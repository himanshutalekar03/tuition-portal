import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    const teacher = await User.findOne({ _id: id, role: "teacher" })
    .populate({
      path: "subjects",
      select: "name class",
      populate: {
        path: "class",
        select: "name",
      },
    })
    .lean();

    if (!teacher) {
      return NextResponse.json({ error: "Teacher not found" }, { status: 404 });
    }

    return NextResponse.json(teacher, { status: 200 });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    return NextResponse.json({ error: "Failed to fetch teacher" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    await User.findByIdAndDelete(id);
    return NextResponse.json({ message: "Teacher deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    return NextResponse.json({ error: "Failed to delete teacher" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();

    const updatedTeacher = await User.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json(updatedTeacher, { status: 200 });
  } catch (error) {
    console.error("Error updating teacher:", error);
    return NextResponse.json({ error: "Failed to update teacher" }, { status: 500 });
  }
  }

