"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import ProtectedRoute from "@/components/ProtectedRoute";

export default function ClassDetailsPage() {
  const { id } = useParams();
  const [classDetails, setClassDetails] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State to manage teacher assignments for each subject
  const [assignments, setAssignments] = useState({});

  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        const [classRes, teachersRes] = await Promise.all([
          fetch(`/api/classes/${id}`),
          fetch("/api/teachers"),
        ]);

        if (!classRes.ok || !teachersRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const classData = await classRes.json();
        const teachersData = await teachersRes.json();

        setClassDetails(classData);
        setTeachers(teachersData);

        // Initialize assignments state from fetched data
        const initialAssignments = {};
        classData.subjects.forEach((subject) => {
          initialAssignments[subject._id] = subject.teacher?._id || "";
        });
        setAssignments(initialAssignments);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [id]);

  const handleAssignmentChange = (subjectId, teacherId) => {
    setAssignments((prev) => ({ ...prev, [subjectId]: teacherId }));
  };

  const handleSaveAssignment = async (subjectId) => {
    const teacherId = assignments[subjectId];
    if (!teacherId) {
      alert("Please select a teacher.");
      return;
    }

    try {
      const res = await fetch(`/api/classes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subjectId, teacherId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to assign teacher");
      }

      const { subject: updatedSubject } = await res.json();

      // Update the local state to reflect the change
      setClassDetails((prev) => ({
        ...prev,
        subjects: prev.subjects.map((s) =>
          s._id === updatedSubject._id ? { ...s, teacher: updatedSubject.teacher } : s
        ),
      }));

      alert("Teacher assigned successfully!");
    } catch (err) {
      console.error("Assignment error:", err);
      alert(`Error: ${err.message}`);
    }
  };

  if (loading) return <p className="p-4 text-gray-500">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;
  if (!classDetails) return <p className="p-4 text-gray-500">Class not found.</p>;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin">
        <div className="p-6 space-y-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Manage Class: {classDetails.name}
          </h1>

          <div className="bg-white p-6 rounded-xl shadow space-y-6">
            <h2 className="text-xl font-semibold text-gray-700">
              Assign Teachers to Subjects
            </h2>
            <div className="space-y-4">
              {classDetails.subjects.map((subject) => (
                <div
                  key={subject._id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{subject.name}</p>
                    <p className="text-sm text-gray-500">
                      Current Teacher: {subject.teacher?.name || "Not Assigned"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <select
                      value={assignments[subject._id] || ""}
                      onChange={(e) =>
                        handleAssignmentChange(subject._id, e.target.value)
                      }
                      className="border p-2 rounded-lg text-black"
                    >
                      <option value="">Select Teacher</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleSaveAssignment(subject._id)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                      Save
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">
              Enrolled Students ({classDetails.students?.length || 0})
            </h2>
            {classDetails.students?.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {classDetails.students.map((student) => (
                  <li key={student._id} className="py-3">
                    <p className="text-gray-800">{student.name}</p>
                    <p className="text-sm text-gray-500">{student.email}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">
                No students are enrolled in this class yet.
              </p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

