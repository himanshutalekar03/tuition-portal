"use client";

import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

export default function TeacherSubjects() {
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    fetchSubjects();
  }, []);

  async function fetchSubjects() {
    try {
      const res = await fetch("/api/teacher/subjects");
      const data = await res.json();
      setSubjects(data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    }
  }

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout role="teacher">
        <div className="p-6 space-y-6">
          <h1 className="text-2xl font-bold">My Subjects & Classes</h1>
          <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
            <table className="min-w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 border text-black">Subject</th>
                  <th className="p-3 border text-black">Class</th>
                </tr>
              </thead>
              <tbody>
                {subjects.length > 0 ? (
                  subjects.map((s) => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="p-3 border text-gray-600">{s.name}</td>
                      <td className="p-3 border text-gray-600">{s.class?.name}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="p-3 border text-center" colSpan="2">
                      No subjects assigned
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
