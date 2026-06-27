"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return; // Wait until session is loaded

    if (!session) {
      // User not logged in → redirect to login
      router.replace("/login");
    } else if (!allowedRoles.includes(session.user.role)) {
      // User has wrong role → send them to their correct dashboard
      if (session.user.role === "admin") router.replace("/admin");
      else if (session.user.role === "teacher") router.replace("/teacher");
      else router.replace("/student");
    }
  }, [session, status, router, allowedRoles]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <p className="animate-pulse">Loading...</p>
      </div>
    );
  }

  return <>{children}</>;
}
