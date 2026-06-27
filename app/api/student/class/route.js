import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Class from "@/models/Class";
import Subject from "@/models/Subject";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "student") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });
  }

  try {
    const student = await User.findById(session.user.id).populate("class");
    if (!student || !student.class) {
      return new Response(JSON.stringify({ error: "No class assigned" }), {
        status: 404,
      });
    }

    const subjects = await Subject.find({ class: student.class._id });

    return new Response(
      JSON.stringify({ class: student.class, subjects }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching student class:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch class info" }),
      { status: 500 }
    );
  }
}
