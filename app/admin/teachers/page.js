"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

export default function ManageTeachers() {
  const router = useRouter();
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  // Fetch teachers
  useEffect(() => {
    fetchTeachers();
  }, []);

  async function fetchTeachers() {
    try {
      const res = await fetch("/api/teachers");
      const data = await res.json();
      setTeachers(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  }

  // Handle form submit
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({ name: "", email: "", password: "" });
        fetchTeachers();
      }
    } catch (error) {
      console.error("Error adding teacher:", error);
    } finally {
      setLoading(false);
    }
  }

  // Handle delete
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      const res = await fetch(`/api/teachers/${id}`, { method: "DELETE" });
      if (res.ok) fetchTeachers();
    } catch (error) {
      console.error("Error deleting teacher:", error);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin">
        <div className="p-6 space-y-8">
          <h1 className="text-3xl font-bold">Manage Teachers</h1>

          {/* Add Teacher Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-lg rounded-lg p-6 grid grid-cols-1 md:grid-cols-4 gap-4"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="border p-2 rounded text-black"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="border p-2 rounded text-black"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="border p-2 rounded text-black"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition"
            >
              <Plus size={18} />
              {loading ? "Adding..." : "Add Teacher"}
            </button>
          </form>

          {/* Teachers Table */}
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border text-black">Name</th>
                  <th className="p-3 border text-black">Email</th>
                  <th className="p-3 border text-black">Subjects</th>
                  <th className="p-3 border text-black">Classes</th>
                  <th className="p-3 border text-black">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.length > 0 ? (
                  teachers.map((teacher) => {
                    // Collect subject names
                    const subjectNames =
                      teacher.subjects?.map((s) => s.name).join(", ") || "—";

                    // Collect unique class names from subjects
                    const classNames =
                      teacher.subjects
                        ?.map((s) => s.class?.name)
                        .filter(Boolean) // remove null/undefined
                        .filter((value, index, self) => self.indexOf(value) === index) // unique
                        .join(", ") || "—";

                    return (
                      <tr key={teacher._id} className="hover:bg-gray-50">
                        <td className="p-3 border text-gray-600">{teacher.name}</td>
                        <td className="p-3 border text-gray-600">{teacher.email}</td>
                        <td className="p-3 border text-gray-600">{subjectNames}</td>
                        <td className="p-3 border text-gray-600">{classNames}</td>
                        <td className="p-3 border space-x-2 text-gray-600">
                          <button
                            onClick={() => router.push(`/admin/teachers/${teacher._id}`)}
                            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            onClick={() => handleDelete(teacher._id)}
                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td className="p-3 border text-center" colSpan="5">
                      No teachers found
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
