"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function TeacherAnnouncements() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [form, setForm] = useState({ title: "", content: "", targetRoles: ["student"], classId: "" });

  useEffect(() => {
    fetch("/api/announcements").then(r => r.json()).then(setAnnouncements);
    fetch("/api/classes").then(r => r.json()).then(setClasses);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.classId) return alert("Please select a class to broadcast to.");

    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        author: session?.user?.id
      })
    });
    
    if (res.ok) {
      const newAnn = await res.json();
      setAnnouncements([newAnn, ...announcements]);
      setForm({ title: "", content: "", targetRoles: ["student"], classId: "" });
      alert("Announcement Published to Class!");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout role="teacher">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-slate-800">Class Announcements</h1>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Post to Class</h2>
            <input 
              type="text" placeholder="Announcement Title" required 
              className="w-full border p-2 rounded-lg text-black" 
              value={form.title} onChange={e => setForm({...form, title: e.target.value})} 
            />
            <textarea 
              placeholder="Content details..." required 
              className="w-full border p-2 rounded-lg text-black h-24" 
              value={form.content} onChange={e => setForm({...form, content: e.target.value})}
            />
            <select 
              className="border p-2 rounded-lg text-black w-full sm:w-1/2" required
              value={form.classId} onChange={e => setForm({...form, classId: e.target.value})}
            >
              <option value="">Select Target Class</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <button type="submit" className="block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Publish</button>
          </form>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Past Announcements</h2>
            <div className="space-y-4">
              {announcements.map(a => (
                <div key={a._id} className="border-l-4 border-indigo-500 p-4 bg-slate-50 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-800">{a.title}</h3>
                    <span className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-600 mt-2">{a.content}</p>
                  <p className="text-xs text-slate-400 mt-2">Class: {a.classId?.name || "Global"}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
