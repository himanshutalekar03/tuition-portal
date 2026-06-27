"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function TeacherResults() {
  const { data: session } = useSession();
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  
  const [form, setForm] = useState({ classId: "", subjectId: "", examName: "", totalMarks: 100 });
  const [marksData, setMarksData] = useState({});

  useEffect(() => {
    fetch("/api/classes").then(res => res.json()).then(setClasses);
    fetch("/api/subjects").then(res => res.json()).then(setSubjects);
  }, []);

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setForm({ ...form, classId });
    if (classId) {
      const res = await fetch("/api/students");
      const allStudents = await res.json();
      const classStudents = allStudents.filter(s => s.class === classId || (Array.isArray(s.class) && s.class.some(c => c._id === classId || c === classId)) || (s.class && s.class._id === classId));
      setStudents(classStudents);
      const initialMarks = {};
      classStudents.forEach(s => { initialMarks[s._id] = 0; });
      setMarksData(initialMarks);
    } else {
      setStudents([]);
    }
  };

  const submitResults = async () => {
    if (!form.subjectId || !form.examName) return alert("Please fill all details.");
    
    try {
      const promises = Object.entries(marksData).map(([studentId, marks]) => 
        fetch("/api/results", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            student: studentId,
            subject: form.subjectId,
            examName: form.examName,
            marksObtained: marks,
            totalMarks: form.totalMarks,
            addedBy: session?.user?.id
          })
        })
      );
      await Promise.all(promises);
      alert("Results uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading results");
    }
  };

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout role="teacher">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-slate-800">Upload Results</h1>

          <div className="bg-white p-6 rounded-xl shadow grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <select className="border p-2 rounded-lg text-black" value={form.classId} onChange={handleClassChange}>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <select className="border p-2 rounded-lg text-black" value={form.subjectId} onChange={e => setForm({...form, subjectId: e.target.value})}>
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
            <input type="text" placeholder="Exam Name (e.g. Midterm)" className="border p-2 rounded-lg text-black" value={form.examName} onChange={e => setForm({...form, examName: e.target.value})} />
            <input type="number" placeholder="Total Marks" className="border p-2 rounded-lg text-black" value={form.totalMarks} onChange={e => setForm({...form, totalMarks: e.target.value})} />
          </div>

          {students.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 border-b text-gray-800">Student Name</th>
                    <th className="p-4 border-b text-gray-800">Marks Obtained</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="p-4 border-b text-gray-700">{s.name}</td>
                      <td className="p-4 border-b">
                        <input type="number" className="border p-1 rounded text-black w-24" value={marksData[s._id]} onChange={(e) => setMarksData({...marksData, [s._id]: e.target.value})} />
                        <span className="ml-2 text-gray-500">/ {form.totalMarks}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={submitResults} className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700">Publish Results</button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
