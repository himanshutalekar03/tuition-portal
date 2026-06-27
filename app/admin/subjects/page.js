"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState("");
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const router = useRouter();

  // Fetch subjects, teachers, and classes
  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
    fetchClasses();
  }, []);

  const fetchSubjects = async () => {
    const res = await fetch("/api/subjects");
    const data = await res.json();
    setSubjects(data);
  };

  const fetchTeachers = async () => {
    const res = await fetch("/api/teachers");
    const data = await res.json();
    setTeachers(data);
  };

  const fetchClasses = async () => {
    const res = await fetch("/api/classes");
    const data = await res.json();
    setClasses(data);
  };

  // Add subject
  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;
    await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSubject }),
    });
    setNewSubject("");
    fetchSubjects();
  };

  // Delete subject
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    await fetch(`/api/subjects/${id}`, { method: "DELETE" });
    fetchSubjects();
  };

  // View subject details
  const handleView = (id) => {
    router.push(`/admin/subjects/${id}`);
  };

  // Assign teacher
  const handleAssignTeacher = async (subjectId, teacherId) => {
    await fetch(`/api/subjects/${subjectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ teacherId }),
    });
    fetchSubjects();
  };

  // Assign class
  const handleAssignClass = async (subjectId, classId) => {
    await fetch(`/api/subjects/${subjectId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ classId }),
    });
    fetchSubjects();
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin">
        <h2 className="text-2xl font-bold">Manage Subjects</h2>

        {/* Add Subject */}
        <div className="flex mt-4">
          <input
            type="text"
            placeholder="Enter subject name"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            className="border p-2 flex-grow rounded-l-md"
          />
          <button
            onClick={handleAddSubject}
            className="bg-blue-600 text-white px-4 rounded-r-md"
          >
            Add Subject
          </button>
        </div>

        {/* Subjects Table */}
        <div className="mt-6 bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 border-b text-black">Subject</th>
                <th className="p-3 border-b text-black">Class</th>
                <th className="p-3 border-b text-black">Assign Class</th>
                <th className="p-3 border-b text-black">Teacher</th>
                <th className="p-3 border-b text-black">Assign Teacher</th>
                <th className="p-3 border-b text-black">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject._id} className="hover:bg-gray-50 text-gray-600">
                  <td className="p-3 border-b">{subject.name}</td>
                  <td className="p-3 border-b">
                    {subject.class ? subject.class.name : "N/A"}
                  </td>
                  <td className="p-3 border-b">
                    <select
                      className="border p-2 rounded"
                      value={subject.class?._id || ""}
                      onChange={(e) =>
                        handleAssignClass(subject._id, e.target.value)
                      }
                    >
                      <option value="">-- Select Class --</option>
                      {classes.map((cls) => (
                        <option key={cls._id} value={cls._id}>
                          {cls.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 border-b">
                    {subject.teacher ? subject.teacher.name : "N/A"}
                  </td>
                  <td className="p-3 border-b">
                    <select
                      className="border p-2 rounded"
                      value={subject.teacher?._id || ""}
                      onChange={(e) =>
                        handleAssignTeacher(subject._id, e.target.value)
                      }
                    >
                      <option value="">-- Select Teacher --</option>
                      {teachers.map((teacher) => (
                        <option key={teacher._id} value={teacher._id}>
                          {teacher.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3 border-b space-x-2">
                    <button
                      onClick={() => handleDelete(subject._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => handleView(subject._id)}
                      className="bg-green-500 text-white px-3 py-1 rounded"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
