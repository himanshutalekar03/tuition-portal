"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function TeacherAssignments() {
  const { data: session } = useSession();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [form, setForm] = useState({
    title: "",
    description: "",
    classId: "",
    subject: "",
    dueDate: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [clsRes, subRes, assnRes] = await Promise.all([
          fetch("/api/classes"),
          fetch("/api/subjects"),
          fetch("/api/assignments")
        ]);
        setClasses(await clsRes.json());
        setSubjects(await subRes.json());
        setAssignments(await assnRes.json());
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          teacher: session?.user?.id
        })
      });
      if (res.ok) {
        const newAssignment = await res.json();
        setAssignments([...assignments, newAssignment]);
        setForm({ title: "", description: "", classId: "", subject: "", dueDate: "" });
        alert("Assignment created successfully!");
      } else {
        alert("Failed to create assignment");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout role="teacher">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-slate-800">Manage Assignments</h1>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-semibold text-gray-700">Create New Assignment</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <input type="text" placeholder="Assignment Title" required className="border p-2 rounded-lg text-black" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} />
              <input type="date" required className="border p-2 rounded-lg text-black" value={form.dueDate} onChange={(e) => setForm({...form, dueDate: e.target.value})} />
              <select required className="border p-2 rounded-lg text-black" value={form.classId} onChange={(e) => setForm({...form, classId: e.target.value})}>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
              <select required className="border p-2 rounded-lg text-black" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})}>
                <option value="">Select Subject</option>
                {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
              </select>
            </div>
            <textarea placeholder="Description" required className="w-full border p-2 rounded-lg text-black h-24" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})}></textarea>
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">Publish Assignment</button>
          </form>

          <div className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Past Assignments</h2>
            <div className="space-y-4">
              {assignments.map(a => (
                <div key={a._id} className="border p-4 rounded-lg">
                  <h3 className="font-bold text-lg text-slate-800">{a.title}</h3>
                  <p className="text-sm text-gray-500">Due: {new Date(a.dueDate).toLocaleDateString()}</p>
                  <p className="mt-2 text-slate-600">{a.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
