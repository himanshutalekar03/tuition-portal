import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";
import User from "@/models/User";
import cloudinary from "@/lib/cloudinary";

export async function GET(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const teacher = await User.findOne({ email: session.user.email });
    const notes = await Note.find({ uploadedBy: teacher._id })
      .populate({
        path: "subjectId",
        populate: { path: "class" },
      })
      .sort({ createdAt: -1 });

    return new Response(JSON.stringify(notes), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function POST(req) {
  await connectDB();
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "teacher") {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const formData = await req.formData();
    const title = formData.get("title");
    const subjectId = formData.get("subjectId");
    const file = formData.get("file");

    const teacher = await User.findOne({ email: session.user.email });

    let fileUrl = "";
    if (file) {
      // Convert file to buffer
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Upload to Cloudinary
      const uploadRes = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ resource_type: "auto", folder: "tuition-notes" }, (err, result) => {
            if (err) reject(err);
            else resolve(result);
          })
          .end(buffer);
      });

      fileUrl = uploadRes.secure_url;
    }

    const note = await Note.create({
      title,
      fileUrl,
      subjectId,
      uploadedBy: teacher._id,
    });

    return new Response(JSON.stringify(note), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
