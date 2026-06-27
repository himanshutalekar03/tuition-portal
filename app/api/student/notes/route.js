import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Note from "@/models/Note";


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
      return new Response(JSON.stringify([]), { status: 200 });
    }

    // Fetch notes related to student's class
    const notes = await Note.find({ class: student.class._id })
      .populate("subject", "name")
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(notes), { status: 200 });
  } catch (error) {
    console.error("Error fetching notes:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch notes" }), {
      status: 500,
    });
  }
}
