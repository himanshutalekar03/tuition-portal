"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function StudentResults() {
  const { data: session } = useSession();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.id) return;
      try {
        const res = await fetch(`/api/results?student=${session.user.id}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [session]);

  return (
    <ProtectedRoute allowedRoles={["student"]}>
      <DashboardLayout role="student">
        <div className="space-y-6">
          <h1 className="text-3xl font-bold text-slate-800">My Results</h1>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <h2 className="text-lg font-bold p-6 border-b border-slate-200 text-slate-800">Gradebook</h2>
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-600">
                  <th className="p-4 border-b font-medium">Exam Name</th>
                  <th className="p-4 border-b font-medium">Subject</th>
                  <th className="p-4 border-b font-medium">Marks Obtained</th>
                  <th className="p-4 border-b font-medium">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {results.length > 0 ? results.map(r => {
                  const percentage = ((r.marksObtained / r.totalMarks) * 100).toFixed(1);
                  return (
                    <tr key={r._id} className="hover:bg-slate-50">
                      <td className="p-4 border-b text-slate-800 font-medium">{r.examName}</td>
                      <td className="p-4 border-b text-slate-600">{r.subject?.name}</td>
                      <td className="p-4 border-b text-slate-700 font-bold">{r.marksObtained} / {r.totalMarks}</td>
                      <td className="p-4 border-b">
                        <span className={`px-2 py-1 rounded text-sm font-bold ${
                          percentage >= 80 ? "bg-green-100 text-green-700" :
                          percentage >= 50 ? "bg-blue-100 text-blue-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {percentage}%
                        </span>
                      </td>
                    </tr>
                  )
                }) : (
                  <tr><td colSpan="4" className="p-6 text-center text-slate-500">No result records found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
