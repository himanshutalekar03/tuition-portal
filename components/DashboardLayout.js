"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react"; // ✅ real session
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  User, 
  Book, 
  Library, 
  FileText, 
  Upload, 
  GraduationCap, 
  LogOut
} from "lucide-react";

const cn = (...classes) => classes.filter(Boolean).join("");

// Icon mapping
const iconMap = {
  Dashboard: <LayoutDashboard size={20} />,
  "Manage Teachers": <User size={20} />,
  "Manage Students": <Users size={20} />,
  "Manage Classes": <Library size={20} />,
  "Manage Subjects": <Book size={20} />,
  "My Subjects": <Book size={20} />,
  "Upload Notes": <Upload size={20} />,
  "Notes": <FileText size={20} />,
  "Assignments": <FileText size={20} />,
  "Attendance": <Users size={20} />,
  "Results": <Book size={20} />,
  "Announcements": <FileText size={20} />,
};

export default function DashboardLayout({ children, role }) {
  const { data: session } = useSession(); // ✅ pull from NextAuth
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setPathname(window.location.pathname);
    }
  }, []);

  const menus = {
    admin: [
      { name: "Dashboard", path: "/admin" },
      { name: "Manage Teachers", path: "/admin/teachers" },
      { name: "Manage Students", path: "/admin/students" },
      { name: "Manage Classes", path: "/admin/classes" },
      { name: "Manage Subjects", path: "/admin/subjects" },
      { name: "Announcements", path: "/admin/announcements" },
    ],
    teacher: [
      { name: "Dashboard", path: "/teacher" },
      { name: "My Subjects", path: "/teacher/subjects" },
      { name: "Upload Notes", path: "/teacher/notes" },
      { name: "Assignments", path: "/teacher/assignments" },
      { name: "Attendance", path: "/teacher/attendance" },
      { name: "Results", path: "/teacher/results" },
      { name: "Announcements", path: "/teacher/announcements" },
    ],
    student: [
      { name: "Dashboard", path: "/student" },
      { name: "My Subjects", path: "/student/subjects" },
      { name: "Notes", path: "/student/notes" },
      { name: "Assignments", path: "/student/assignments" },
      { name: "Attendance", path: "/student/attendance" },
      { name: "Results", path: "/student/results" },
    ],
  };

  const capitalize = (s) => s && s.charAt(0).toUpperCase() + s.slice(1);

  const userName = session?.user?.name || capitalize(role);
  const userEmail = session?.user?.email || "";
  const userInitial = userName?.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -256 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="w-64 bg-white border-r border-slate-200 flex flex-col"
      >
        <div className="p-4 border-b border-slate-200">
          <Link href="/" className="inline-block">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <GraduationCap className="text-indigo-600" />
              <span>EduPortal</span>
            </h2>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          {menus[role]?.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200",
                pathname === item.path
                  ? "bg-indigo-50 text-indigo-600 font-semibold"
                  : "text-black hover:bg-slate-100"
              )}
            >
              {iconMap[item.name]}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-200">
          <button
            onClick={() => signOut()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-600 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6">
          <h1 className="text-xl font-semibold text-slate-800">
            Welcome, {userName}!
          </h1>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold">
              {userInitial}
            </div>
            <div className="text-sm">
              <p className="font-semibold text-slate-800">{userName}</p>
              <p className="text-slate-500">{userEmail}</p>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
