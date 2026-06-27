"use client";

import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import { BookOpen, FileText } from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout role="teacher">
        <div className="p-6 space-y-8">
          <h1 className="text-3xl font-bold text-blue-500">Teacher Dashboard</h1>
          <p className="text-gray-500">Welcome! Here are your tools:</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Subjects */}
            <div
              onClick={() => router.push("/teacher/subjects")}
              className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
            >
              <BookOpen className="text-blue-600 mb-3" size={32} />
              <h2 className="text-xl font-semibold text-black">My Subjects</h2>
              <p className="text-gray-500">View assigned subjects with classes.</p>
            </div>

            {/* Notes */}
            <div
              onClick={() => router.push("/teacher/notes")}
              className="cursor-pointer bg-white shadow-lg rounded-2xl p-6 hover:shadow-xl transition"
            >
              <FileText className="text-green-600 mb-3" size={32} />
              <h2 className="text-xl font-semibold text-black">Upload Notes</h2>
              <p className="text-gray-500">Upload and manage class notes.</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
