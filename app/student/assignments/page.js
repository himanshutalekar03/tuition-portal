"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function StudentAssignments() {
  const { data: session } = useSession();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!session?.user?.id) return;
      try {
        const studentRes = await fetch(`/api/students/${session.user.id}`);
        const student = await studentRes.json();
        
        // Ensure we check for array or single object representation of class
        const classId = Array.isArray(student.class) && student.class.length > 0 
          ? student.class[0]._id 
          : student.class?._id || student.class;

        if (classId) {
          const assnRes = await fetch(`/api/assignments?classId=${classId}`);
          setAssignments(await assnRes.json());
        }
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
          <h1 className="text-3xl font-bold text-slate-800">My Assignments</h1>
          
          {loading ? (
            <p>Loading assignments...</p>
          ) : assignments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments.map(a => (
                <div key={a._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-xl font-bold text-slate-800">{a.title}</h2>
                    <span className="bg-orange-100 text-orange-600 px-2 py-1 rounded text-xs font-bold">
                      Due: {new Date(a.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-4">{a.description}</p>
                  <div className="pt-4 border-t border-slate-100 text-sm text-slate-500">
                    <p><strong>Subject:</strong> {a.subject?.name}</p>
                    <p><strong>Teacher:</strong> {a.teacher?.name}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
              <p className="text-slate-500 text-lg">No pending assignments found.</p>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
