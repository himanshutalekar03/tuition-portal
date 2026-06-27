import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Announcement from "@/models/Announcement";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const role = searchParams.get("role");
    const classId = searchParams.get("classId");

    let query = {};
    if (role) query.targetRoles = { $in: [role] };
    if (classId) query.$or = [{ classId: classId }, { classId: null }];

    const announcements = await Announcement.find(query)
      .populate("author", "name email")
      .populate("classId", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json(announcements, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch announcements" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    if (!body.title || !body.content || !body.author) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newAnnouncement = await Announcement.create(body);
    return NextResponse.json(newAnnouncement, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create announcement" }, { status: 500 });
  }
}
