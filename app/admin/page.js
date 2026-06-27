"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import {
  Users,
  User,
  Library,
  Book,
  ArrowRight,
  Percent,
  Banknote,
  Trophy,
} from "lucide-react";

import DashboardLayout from "@/components/DashboardLayout";

export default function AdminPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  const statsConfig = [
    {
      name: "Total Students",
      key: "students",
      icon: <Users className="text-indigo-500" />,
      href: "/admin/students",
      bgColor: "bg-indigo-100",
      value: stats ? stats.students : "...",
    },
    {
      name: "Total Teachers",
      key: "teachers",
      icon: <User className="text-teal-500" />,
      href: "/admin/teachers",
      bgColor: "bg-teal-100",
      value: stats ? stats.teachers : "...",
    },
    {
      name: "Total Classes",
      key: "classes",
      icon: <Library className="text-amber-500" />,
      href: "/admin/classes",
      bgColor: "bg-amber-100",
      value: stats ? stats.classes : "...",
    },
    {
      name: "Total Subjects",
      key: "subjects",
      icon: <Book className="text-rose-500" />,
      href: "/admin/subjects",
      bgColor: "bg-rose-100",
      value: stats ? stats.subjects : "...",
    },
    {
      name: "Attendance Rate",
      key: "attendancePercentage",
      icon: <Percent className="text-emerald-500" />,
      href: "/admin/students",
      bgColor: "bg-emerald-100",
      value: stats ? `${stats.attendancePercentage}%` : "...",
    },
    {
      name: "Fee Collection",
      key: "fees",
      icon: <Banknote className="text-blue-500" />,
      href: "/admin", // fee management page would go here
      bgColor: "bg-blue-100",
      value: stats ? `₹${stats.fees?.collected || 0} / ₹${stats.fees?.expected || 0}` : "...",
    },
  ];

  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <DashboardLayout role={"admin"}>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h2 className="text-3xl font-bold text-slate-800">Admin Analytics Dashboard</h2>
            <p className="mt-2 text-slate-600">
              Welcome back! Here's an overview of your institution's health and analytics.
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {statsConfig.map((item) => (
              <div
                key={item.name}
                className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{item.name}</p>
                    <p className="text-2xl font-bold text-slate-800 mt-1">
                      {item.value}
                    </p>
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${item.bgColor}`}>
                    {item.icon}
                  </div>
                </div>
                <a
                  href={item.href}
                  className="mt-4 text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group"
                >
                  Manage
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </a>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Performers */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="text-yellow-500" />
                <h3 className="text-xl font-semibold text-slate-800">
                  Top Performing Students
                </h3>
              </div>
              
              {stats?.topPerformers?.length > 0 ? (
                <div className="space-y-4">
                  {stats.topPerformers.map((student, index) => (
                    <div key={student.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 font-bold rounded-full flex items-center justify-center">
                          #{index + 1}
                        </div>
                        <p className="font-semibold text-slate-800">{student.name}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-emerald-600">{student.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-slate-500 italic">No result data available yet to rank students.</p>
              )}
            </div>

            {/* Fee Collection Progress */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                Fee Collection Status
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm font-medium text-slate-600">
                  <span>Collected: ₹{stats?.fees?.collected || 0}</span>
                  <span>Target: ₹{stats?.fees?.expected || 0}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <div 
                    className="bg-indigo-600 h-4 rounded-full transition-all duration-1000" 
                    style={{ 
                      width: stats?.fees?.expected > 0 
                        ? `${Math.min((stats.fees.collected / stats.fees.expected) * 100, 100)}%` 
                        : '0%' 
                    }}
                  ></div>
                </div>
                
                <p className="text-sm text-slate-500 mt-2">
                  {stats?.fees?.expected > 0 
                    ? `${((stats.fees.collected / stats.fees.expected) * 100).toFixed(1)}% of total expected fees collected.`
                    : "No fee records established yet."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
