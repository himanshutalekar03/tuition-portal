"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function AdminAnnouncements() {
  const { data: session } = useSession();
  const [announcements, setAnnouncements] = useState([]);
  const [classes, setClasses] = useState([]);
  
  const [form, setForm] = useState({ title: "", content: "", targetRoles: [], classId: "" });

  useEffect(() => {
    fetch("/api/announcements").then(r => r.json()).then(setAnnouncements);
    fetch("/api/classes").then(r => r.json()).then(setClasses);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      setForm({ title: "", content: "", targetRoles: [], classId: "" });
      alert("Announcement Published!");
    }
  };

  const toggleRole = (role) => {
    setForm(prev => {
      const roles = prev.targetRoles.includes(role) 
        ? prev.targetRoles.filter(r => r !== role)
        : [...prev.targetRoles, role];
      return { ...prev, targetRoles: roles };
    });
  };

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-slate-800">Manage Announcements</h1>

          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
            <h2 className="text-xl font-semibold text-slate-800">Create New Announcement</h2>
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
            <div className="flex gap-4 items-center">
              <span className="text-slate-700 font-medium">Target Audience:</span>
              {["student", "teacher", "admin"].map(role => (
                <label key={role} className="flex items-center gap-1 text-slate-700">
                  <input type="checkbox" checked={form.targetRoles.includes(role)} onChange={() => toggleRole(role)} />
                  <span className="capitalize">{role}s</span>
                </label>
              ))}
            </div>
            {form.targetRoles.includes("student") && (
              <select 
                className="border p-2 rounded-lg text-black mt-2 block" 
                value={form.classId} onChange={e => setForm({...form, classId: e.target.value})}
              >
                <option value="">All Classes (Optional)</option>
                {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            )}
            <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Publish</button>
          </form>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Announcement History</h2>
            <div className="space-y-4">
              {announcements.map(a => (
                <div key={a._id} className="border-l-4 border-blue-500 p-4 bg-slate-50 rounded-r-lg">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-lg text-slate-800">{a.title}</h3>
                    <span className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleString()}</span>
                  </div>
                  <p className="text-slate-600 mt-2">{a.content}</p>
                  <p className="text-xs text-slate-400 mt-2">Targeted to: {a.targetRoles.join(", ")} {a.classId?.name ? `(${a.classId.name})` : ""}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
