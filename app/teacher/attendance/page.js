"use client";

import { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import { useSession } from "next-auth/react";

export default function TeacherAttendance() {
  const { data: session } = useSession();
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceData, setAttendanceData] = useState({});

  useEffect(() => {
    fetch("/api/classes").then(res => res.json()).then(setClasses);
  }, []);

  const handleClassChange = async (e) => {
    const classId = e.target.value;
    setSelectedClass(classId);
    if (classId) {
      const res = await fetch("/api/students");
      const allStudents = await res.json();
      // Filter students by class if they have class array
      const classStudents = allStudents.filter(s => s.class === classId || (Array.isArray(s.class) && s.class.some(c => c._id === classId || c === classId)) || (s.class && s.class._id === classId));
      setStudents(classStudents);
      
      const initialAtt = {};
      classStudents.forEach(s => { initialAtt[s._id] = "Present"; });
      setAttendanceData(initialAtt);
    } else {
      setStudents([]);
    }
  };

  const submitAttendance = async () => {
    const records = Object.entries(attendanceData).map(([studentId, status]) => ({
      student: studentId,
      classId: selectedClass,
      date,
      status,
      markedBy: session?.user?.id
    }));

    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ records })
      });
      if (res.ok) alert("Attendance marked successfully!");
      else alert("Failed to mark attendance.");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <ProtectedRoute allowedRoles={["teacher"]}>
      <DashboardLayout role="teacher">
        <div className="space-y-8">
          <h1 className="text-3xl font-bold text-slate-800">Mark Attendance</h1>

          <div className="bg-white p-6 rounded-xl shadow flex gap-4">
            <select className="border p-2 rounded-lg text-black w-1/3" value={selectedClass} onChange={handleClassChange}>
              <option value="">Select Class</option>
              {classes.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
            <input type="date" className="border p-2 rounded-lg text-black" value={date} onChange={e => setDate(e.target.value)} />
          </div>

          {students.length > 0 && (
            <div className="bg-white p-6 rounded-xl shadow">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-4 border-b text-gray-800">Student Name</th>
                    <th className="p-4 border-b text-gray-800">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(s => (
                    <tr key={s._id} className="hover:bg-gray-50">
                      <td className="p-4 border-b text-gray-700">{s.name}</td>
                      <td className="p-4 border-b">
                        <select className="border p-1 rounded text-black" value={attendanceData[s._id]} onChange={(e) => setAttendanceData({...attendanceData, [s._id]: e.target.value})}>
                          <option value="Present">Present</option>
                          <option value="Absent">Absent</option>
                          <option value="Late">Late</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={submitAttendance} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Submit Attendance</button>
            </div>
          )}
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
