"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function StudentAttendance() {
  const { data: session } = useSession();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`/api/attendance?student=${session.user.id}`);
        const data = await res.json();
        setRecords(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session]);

  const total = records.length;
  const present = records.filter(r => r.status === "Present").length;
  const percentage = total > 0 ? ((present / total) * 100).toFixed(1) : 0;

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DashboardLayout role="student">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-slate-800">My Attendance</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-600 text-white p-6 rounded-xl shadow-sm">
              <p className="text-indigo-100 font-medium">Overall Attendance</p>
              <p className="text-4xl font-bold mt-2">{percentage}%</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <p className="text-slate-500 font-medium">Total Classes</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{total}</p>
            </div>
            <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
              <p className="text-slate-500 font-medium">Classes Attended</p>
              <p className="text-3xl font-bold text-slate-800 mt-2">{present}</p>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <h2 className="text-lg font-bold p-6 border-b border-slate-200 text-slate-800">Attendance Log</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="p-4 border-b font-medium">Date</th>
                  <th className="p-4 border-b font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? records.map(r => (
                  <tr key={r._id} className="hover:bg-slate-50">
                    <td className="p-4 border-b text-slate-700">{new Date(r.date).toLocaleDateString()}</td>
                    <td className="p-4 border-b">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        r.status === "Present" ? "bg-green-100 text-green-700" :
                        r.status === "Absent" ? "bg-red-100 text-red-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="2" className="p-6 text-center text-slate-500">No attendance records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
