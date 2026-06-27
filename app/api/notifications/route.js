import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Notification from "@/models/Notification";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const user = searchParams.get("user");

    let query = {};
    if (user) query.user = user;

    const notifications = await Notification.find(query).sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(notifications, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    const notification = await Notification.create(body);
    return NextResponse.json(notification, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create notification" }, { status: 500 });
  }
}
