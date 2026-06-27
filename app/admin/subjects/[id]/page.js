// app/admin/subjects/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";

export default function SubjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSubject() {
      try {
        const res = await fetch(`/api/subjects/${id}`);
        if (res.ok) {
          const data = await res.json();
          setSubject(data);
        } else {
          console.error("Failed to fetch subject details");
        }
      } catch (error) {
        console.error("Error fetching subject:", error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      fetchSubject();
    }
  }, [id]);

  if (loading) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout role="admin">
          <p>Loading subject details...</p>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  if (!subject) {
    return (
      <ProtectedRoute allowedRoles={["admin"]}>
        <DashboardLayout role="admin">
          <p>Subject not found.</p>
        </DashboardLayout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role="admin">
        <h2 className="text-2xl font-bold mb-4 text-slate-800">Subject Details</h2>
        <div className="bg-white p-4 rounded-lg shadow text-black">
          <p>
            <strong>Name:</strong> {subject.name}
          </p>
          <p>
            <strong>Class:</strong> {subject.class?.name || "N/A"}
          </p>
          <p>
            <strong>Teacher:</strong> {subject.teacher?.name || "N/A"}
          </p>
        </div>

        <button
          onClick={() => router.push("/admin/subjects")}
          className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
        >
          Back to Subjects
        </button>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
