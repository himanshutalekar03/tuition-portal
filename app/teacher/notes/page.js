"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

export default function TeacherNotes() {
  const [notes, setNotes] = useState([]);
  const [form, setForm] = useState({ title: "", file: null, subjectId: "" });
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotes();
    fetchSubjects();
  }, []);

  async function fetchNotes() {
    const res = await fetch("/api/teacher/notes");
    const data = await res.json();
    setNotes(data);
  }

  async function fetchSubjects() {
    const res = await fetch("/api/teacher/subjects");
    const data = await res.json();
    setSubjects(data);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("subjectId", form.subjectId);
    if (form.file) formData.append("file", form.file);

    try {
      const res = await fetch("/api/teacher/notes", {
        method: "POST",
        body: formData,
      });
      if (res.ok) {
        setForm({ title: "", file: null, subjectId: "" });
        fetchNotes();
      }
    } catch (err) {
      console.error("Error uploading notes:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout role="teacher">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">Upload Notes</h1>

          {/* Upload Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-3 gap-4"
          >
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border p-2 rounded text-black"
              required
            />

            <select
              value={form.subjectId}
              onChange={(e) => setForm({ ...form, subjectId: e.target.value })}
              className="border p-2 rounded text-black"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name} ({s.class?.name})
                </option>
              ))}
            </select>

            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
              className="border p-2 rounded text-black"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            >
              {loading ? "Uploading..." : "Upload"}
            </button>
          </form>

          {/* Notes Table */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border text-black">Title</th>
                  <th className="p-3 border text-black">Subject</th>
                  <th className="p-3 border text-black">Class</th>
                  <th className="p-3 border text-black">File</th>
                </tr>
              </thead>
              <tbody>
                {notes.length > 0 ? (
                  notes.map((n) => (
                    <tr key={n._id} className="hover:bg-gray-50">
                      <td className="p-3 border text-gray-600">{n.title}</td>
                      <td className="p-3 border text-gray-600">{n.subject?.name}</td>
                      <td className="p-3 border text-gray-600">{n.subject?.class?.name}</td>
                      <td className="p-3 border text-gray-600">
                        <a
                          href={n.fileUrl}
                          target="_blank"
                          className="text-blue-600 underline"
                        >
                          View File
                        </a>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 border text-center" colSpan="4">
                      No notes uploaded
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
