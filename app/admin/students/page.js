// app/admin/students/page.js
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye } from "lucide-react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

export default function ManageStudents() {
  const router = useRouter();
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "", classId: "" });
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      const [studentsRes, classesRes] = await Promise.all([
        fetch("/api/students"),
        fetch("/api/classes"),
      ]);
      const studentsData = await studentsRes.json();
      const classesData = await classesRes.json();
      setStudents(Array.isArray(studentsData) ? studentsData : []);
      setClasses(Array.isArray(classesData) ? classesData : []);
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    setAdding(true);
    setError(null);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to add student");
      }

      // API returns POPULATED student
      const newStudent = await res.json();
      setStudents((prev) => [...prev, newStudent]);
      setForm({ name: "", email: "", password: "", classId: "" });
    } catch (err) {
      console.error("Add student error:", err);
      setError(err.message);
    } finally {
      setAdding(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    setError(null);
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to delete student");
      }
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error("Delete student error:", err);
      setError(err.message);
    }
  };

  if (loading) return <p className="p-4 text-gray-500">Loading students...</p>;

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin">
        <div className="p-6 space-y-8">
          <h1 className="text-3xl font-bold text-slate-800">Manage Students</h1>

          {/* Add Student Form */}
          <form onSubmit={handleAddStudent} className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Add New Student</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                placeholder="Full Name"
                className="border p-2 rounded-lg text-black"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <input
                type="email"
                placeholder="Email"
                className="border p-2 rounded-lg text-black"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              <input
                type="password"
                placeholder="Password"
                className="border p-2 rounded-lg text-black"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              <select
                className="border p-2 rounded-lg text-black"
                value={form.classId}
                onChange={(e) => setForm({ ...form, classId: e.target.value })}
                required
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls._id} value={cls._id}>{cls.name}</option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={adding}
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Plus size={18} />
              {adding ? "Adding..." : "Add Student"}
            </button>
          </form>

          {/* Students Table */}
          <div className="bg-white rounded-xl shadow overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-4 border-b text-gray-800">Name</th>
                  <th className="p-4 border-b text-gray-800">Email</th>
                  <th className="p-4 border-b text-gray-800">Class</th>
                  <th className="p-4 border-b text-gray-800">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr key={student._id} className="hover:bg-gray-50">
                      <td className="p-4 border-b text-gray-500">{student.name}</td>
                      <td className="p-4 border-b text-gray-500">{student.email}</td>
                      <td className="p-4 border-b text-gray-500">
                        {student.class && student.class.name
                          ? student.class.name
                          : "N/A"}
                      </td>
                      <td className="p-4 border-b flex gap-2 text-gray-500">
                        <button
                          onClick={() => router.push(`/admin/students/${student._id}`)}
                          className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(student._id)}
                          className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-4 text-gray-500" colSpan="4">
                      No students found.
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
