import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb"; 
import Subject from "@/models/Subject";
import User from "@/models/User";
import Class from "@/models/Class";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    // find teacher in DB
    const teacher = await User.findOne({ email: session.user.email });
    if (!teacher) {
      return new Response(JSON.stringify({ error: "Teacher not found" }), { status: 404 });
    }

    // get subjects assigned to this teacher
    const subjects = await Subject.find({ teacher: teacher._id }).populate("class");
    return new Response(JSON.stringify(subjects), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
