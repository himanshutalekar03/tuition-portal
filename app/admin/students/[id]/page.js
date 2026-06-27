// app/admin/students/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

export default function StudentDetailsPage() {
  const { id } = useParams();
  const [student, setStudent] = useState(null);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const [s, c] = await Promise.all([
          fetch(`/api/students/${id}`).then((r) => r.json()),
          fetch("/api/classes").then((r) => r.json()),
        ]);
        setStudent(s);
        setClasses(Array.isArray(c) ? c : []);
        setSelectedClass(s?.class?.[0]?._id || ""); // first class if exists
      } catch (e) {
        console.error("Failed to load student/classes:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  const handleSave = async () => {
    if (!selectedClass) return alert("Please select a class.");
    if (!confirm("Assign selected class to this student?")) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ classId: selectedClass }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to assign class");
      }
      const updated = await res.json();
      setStudent(updated);
      alert("Class assigned successfully.");
    } catch (e) {
      console.error(e);
      alert(e.message || "Error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin">
        <p>Loading...</p>
      </DashboardLayout>
    </ProtectedRoute>
  );

  if (!student) return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin">
        <p>Student not found</p>
      </DashboardLayout>
    </ProtectedRoute>
  );

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin">
        <div className="max-w-3xl mx-auto space-y-6 p-6 bg-white rounded-lg shadow">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-black">{student.name}</h1>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="text-m text-gray-800">Email:</p>
              <p className="font-medium text-gray-600">{student.email}</p>
            </div>

            <div>
              <p className="text-m text-gray-800">Current Class(es):</p>
              <p className="font-medium text-gray-600">
                {student.class && student.class.name
                  ? student.class.name
                  : "Not assigned"}
              </p>
            </div>
          </div>

          <div className="border-t pt-4">
            <h2 className="text-lg font-semibold mb-2 text-black">Assign / Add Class</h2>
            <div className="flex gap-3 items-center">
              <select
                id="class-select"
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="border px-3 py-2 rounded flex-1 text-gray-800"
              >
                <option value="">Select class</option>
                {classes.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>

              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Assigning adds the class to the student&apos;s class list.
            </p>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
