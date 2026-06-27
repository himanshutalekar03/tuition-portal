import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function GET() {
  try {
    await connectDB();

    const users = [
      { name: "Admin User", email: "admin@test.com", password: "password123", role: "admin" },
      { name: "Teacher User", email: "teacher@test.com", password: "password123", role: "teacher" },
      { name: "Student User", email: "student@test.com", password: "password123", role: "student" },
    ];

    
    const results = [];

    for (let u of users) {
      const exists = await User.findOne({ email: u.email });
      if (!exists) {
        const hashedPassword = await bcrypt.hash(u.password, 10);
        await User.create({ ...u, password: hashedPassword });
        results.push(`${u.role} created`);
      } else {
        results.push(`${u.role} already exists`);
      }
    }

    return NextResponse.json({ message: "Seeding complete", results }, { status: 200 });
  } catch (error) {
    console.error("Seeding error:", error);
    return NextResponse.json({ error: "Failed to seed users" }, { status: 500 });
  }
}
