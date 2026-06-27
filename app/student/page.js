"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { Book, FileText, CheckCircle, Target } from "lucide-react";
import Link from "next/link";

export default function StudentPage() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Student";
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    async function fetchAnnouncements() {
      if (!session?.user?.id) return;
      try {
        const studentRes = await fetch(`/api/students/${session.user.id}`);
        const student = await studentRes.json();
        
        const classId = Array.isArray(student.class) && student.class.length > 0 
          ? student.class[0]._id 
          : student.class?._id || student.class;

        if (classId) {
          const res = await fetch(`/api/announcements?role=student&classId=${classId}`);
          setAnnouncements(await res.json());
        } else {
          const res = await fetch(`/api/announcements?role=student`);
          setAnnouncements(await res.json());
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchAnnouncements();
  }, [session]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DashboardLayout role="student">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Welcome, {userName}!</h1>
            <p className="mt-2 text-slate-600">Here is a quick overview of your academic progress.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/student/subjects" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <Book size={24} />
                </div>
                <div>
                  <h3 className="text-slate-500 font-medium text-sm">My Subjects</h3>
                  <p className="text-slate-800 font-bold">View Curriculum</p>
                </div>
              </div>
            </Link>

            <Link href="/student/assignments" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <div>
                  <h3 className="text-slate-500 font-medium text-sm">Assignments</h3>
                  <p className="text-slate-800 font-bold">Check Deadlines</p>
                </div>
              </div>
            </Link>

            <Link href="/student/attendance" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle size={24} />
                </div>
                <div>
                  <h3 className="text-slate-500 font-medium text-sm">Attendance</h3>
                  <p className="text-slate-800 font-bold">View Logs</p>
                </div>
              </div>
            </Link>

            <Link href="/student/results" className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center">
                  <Target size={24} />
                </div>
                <div>
                  <h3 className="text-slate-500 font-medium text-sm">Results</h3>
                  <p className="text-slate-800 font-bold">Check Grades</p>
                </div>
              </div>
            </Link>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-xl font-semibold text-slate-800 mb-4">Latest Announcements</h3>
            {announcements.length > 0 ? (
              <div className="space-y-4">
                {announcements.map(a => (
                  <div key={a._id} className="border-l-4 border-blue-500 p-4 bg-slate-50 rounded-r-lg">
                    <div className="flex justify-between items-start">
                      <h4 className="font-bold text-slate-800">{a.title}</h4>
                      <span className="text-xs text-slate-500">{new Date(a.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{a.content}</p>
                    <p className="text-xs font-semibold text-indigo-600 mt-2">
                      From: {a.author?.name || "Administration"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 italic">No recent announcements.</p>
            )}
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
