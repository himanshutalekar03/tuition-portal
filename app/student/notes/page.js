"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

export default function StudentNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNotes() {
      try {
        const res = await fetch("/api/notes");
        const data = await res.json();
        setNotes(data);
      } catch (err) {
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotes();
  }, []);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DashboardLayout role="student">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-slate-800">Study Notes</h1>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <h2 className="text-lg font-bold p-6 border-b border-slate-200 text-slate-800">Available Resources</h2>
            <div className="p-6">
              {loading ? (
                <p>Loading notes...</p>
              ) : notes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notes.map(note => (
                    <div key={note._id} className="border border-slate-200 rounded-lg p-4 hover:shadow-md transition">
                      <h3 className="font-bold text-slate-800 text-lg mb-2">{note.title}</h3>
                      <p className="text-sm text-slate-500 mb-4">Subject: {note.subjectId?.name || "N/A"}</p>
                      <a 
                        href={note.fileUrl} 
                        target="_blank" 
                        className="inline-block w-full text-center bg-indigo-50 text-indigo-600 font-semibold py-2 rounded-lg hover:bg-indigo-100 transition"
                      >
                        Download PDF
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 text-center py-8">No notes have been uploaded yet.</p>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
