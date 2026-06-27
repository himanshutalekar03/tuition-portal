import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Note from "@/models/Note";
import cloudinary from "@/lib/cloudinary";

export async function GET(req) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const subjectId = searchParams.get("subjectId");

    let query = {};
    if (subjectId) query.subjectId = subjectId;

    const notes = await Note.find(query)
      .populate("subjectId", "name")
      .populate("uploadedBy", "name email");
      
    return NextResponse.json(notes, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch notes" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectDB();
    // Assuming multipart form data
    const formData = await req.formData();
    const file = formData.get("file");
    const title = formData.get("title");
    const subjectId = formData.get("subjectId");
    const uploadedBy = formData.get("uploadedBy");

    if (!file || !title || !subjectId || !uploadedBy) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    // Cloudinary upload from buffer
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "notes", resource_type: "auto" },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(buffer);
    });

    const newNote = await Note.create({
      title,
      fileUrl: uploadResult.secure_url,
      subjectId,
      uploadedBy,
    });

    return NextResponse.json(newNote, { status: 201 });
  } catch (error) {
    console.error("Error creating note:", error);
    return NextResponse.json({ error: "Failed to create note" }, { status: 500 });
  }
}
