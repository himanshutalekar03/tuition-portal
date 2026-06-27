"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ViewTeacherPage() {
  const { id } = useParams();
  const router = useRouter();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchTeacher() {
      try {
        const res = await fetch(`/api/teachers/${id}`);
        if (!res.ok) throw new Error("Failed to fetch teacher");

        const data = await res.json();
        setTeacher(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchTeacher();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg text-gray-500">Loading teacher details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <p className="text-red-500 text-lg mb-4">Error: {error}</p>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  // Derive unique classes from the teacher's subjects
  const taughtClasses =
    teacher?.subjects?.reduce((acc, subject) => {
      if (subject.class && !acc.find((c) => c._id === subject.class._id)) {
        acc.push(subject.class);
      }
      return acc;
    }, []) || [];

  if (!teacher) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen text-center">
        <p className="text-gray-500 text-lg mb-4">Teacher not found</p>
        <button
          onClick={() => router.back()}
          className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-6 border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {teacher.name}
        </h1>

        <div className="mb-4">
          <p className="text-gray-600">
            <span className="font-semibold">Email:</span> {teacher.email}
          </p>
          <p className="text-gray-600 mt-2">
            <span className="font-semibold">Role:</span> {teacher.role}
          </p>
        </div>

        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Subjects
          </h2>
          {teacher.subjects?.length ? (
            <ul className="list-disc list-inside text-gray-600">
              {teacher.subjects.map((subject) => (
                <li key={subject._id}>
                {subject.name} (Class: {subject.class?.name || "N/A"})
              </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No subjects assigned</p>
          )}
        </div>

        <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Classes Taught
          </h2>
          {taughtClasses.length > 0 ? (
            <ul className="list-disc list-inside text-gray-600">
              {taughtClasses.map((cls) => (
                <li key={cls._id}>{cls.name}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No classes assigned</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => router.push("/admin/teachers")}
            className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition"
          >
            Back to Teachers
          </button>
          <button
            onClick={() => router.push(`/admin/teachers/edit/${id}`)}
            className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Edit Teacher
          </button>
        </div>
      </div>
    </div>
  );
}
