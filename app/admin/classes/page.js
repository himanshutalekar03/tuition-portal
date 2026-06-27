"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";


export default function ManageClasses() {
    const [classes, setClasses] = useState([]);
    const [name, setName] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    // Fetch classes
    const fetchClasses = async () => {
        try {
            const res = await fetch("/api/classes");
            const data = await res.json();
            setClasses(data);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    };

    useEffect(() => {
        fetchClasses();
    }, []);

    // Add new class
    const handleAddClass = async (e) => {
        e.preventDefault();
        if (!name.trim()) return alert("Class name is required");

        setLoading(true);
        try {
            const res = await fetch("/api/classes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name }),
            });

            if (!res.ok) throw new Error("Failed to add class");

            setName("");
            fetchClasses();
        } catch (error) {
            console.error("Error adding class:", error);
        } finally {
            setLoading(false);
        }
    };

    // Delete class with confirmation
    const handleDeleteClass = async (id) => {
        const confirmDelete = confirm("Are you sure you want to delete this class?");
        if (!confirmDelete) return;

        try {
            const res = await fetch(`/api/classes/${id}`, {
                method: "DELETE",
            });
            if (res.ok) {
                router.refresh(); // Refresh page after delete
              }
            if (!res.ok) throw new Error("Failed to delete class");

            setClasses((prev) => prev.filter((cls) => cls._id !== id));
        } catch (error) {
            console.error("Error deleting class:", error);
        }
    };

    return (
        <ProtectedRoute allowedRoles={["admin"]}>
            <DashboardLayout role="admin">
                <h2 className="text-2xl font-bold mb-6">Manage Classes</h2>

                {/* Add Class Form */}
                <form
                    onSubmit={handleAddClass}
                    className="mb-6 flex items-center gap-4 bg-white p-4 rounded-lg shadow"
                >
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter class name"
                        className="border border-gray-300 rounded text-black px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
                    >
                        {loading ? "Adding..." : "Add Class"}
                    </button>
                </form>

                {/* Class List Table */}
                <div className="overflow-x-auto bg-white rounded-lg shadow">
                    <table className="min-w-full text-left">
                        <thead>
                            <tr className="border-b bg-gray-100">
                                <th className="px-6 py-3 text-black">Class Name</th>
                                <th className="px-6 py-3 text-right text-black">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {classes.length > 0 ? (
                                classes.map((cls) => (
                                    <tr key={cls._id} className="border-b hover:bg-gray-50">
                                        <td className="px-6 py-3 text-gray-600">{cls.name}</td>
                                        <td className="px-6 py-3 text-right">
                                            <button
                                                onClick={() => handleDeleteClass(cls._id)}
                                                className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700"
                                            >
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => router.push(`/admin/classes/${cls._id}`)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 mr-2"
                                            >
                                                View
                                            </button>

                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td className="px-6 py-3" colSpan="2">
                                        No classes found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </DashboardLayout>
        </ProtectedRoute>
    );
}
