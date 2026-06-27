"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { GraduationCap, LayoutDashboard, LogIn, LogOut } from "lucide-react";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const { data: session } = useSession(); // ✅ NextAuth hook
  const user = session?.user;
  const userName = user?.name || "Guest";
  const userRole = user?.role || "visitor";

  const profileBtnRef = useRef(null);
  const profileMenuRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownOpen &&
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target) &&
        profileBtnRef.current &&
        !profileBtnRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleDashboardRedirect = () => {
    if (!user) {
      router.push("/login");
      return;
    }
    if (userRole === "admin") router.push("/admin");
    else if (userRole === "teacher") router.push("/teacher");
    else if (userRole === "student") router.push("/student");
    else router.push("/");
  };

  return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
        <GraduationCap className="h-8 w-8 text-indigo-600" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
           EduTech
          </span>
        </Link>

        <div className="flex items-center md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
          <div className="relative">
            <button
              ref={profileBtnRef}
              onClick={toggleDropdown}
              type="button"
              className="flex text-sm bg-gray-800 rounded-full md:me-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
            >
              <span className="sr-only">Open user menu</span>
              <img
                className="w-8 h-8 rounded-full"
                src="/docs/images/people/profile-picture-3.jpg"
                alt="user photo"
              />
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div
                ref={profileMenuRef}
                className="absolute right-0 z-50 mt-2 w-48 bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600"
              >
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {userName}
                  </span>
                  <span className="block text-sm text-gray-500 truncate dark:text-gray-400">
                    {userRole}
                  </span>
                </div>
                <ul className="py-2">
                  <li>
                    <button
                      onClick={handleDashboardRedirect}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Dashboard
                    </button>
                  </li>
                  <li>
                    {!user ? (
                      <button
                        onClick={() => router.push("/login")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign in
                      </button>
                    ) : (
                      <button
                        onClick={() => signOut()} // ✅ NextAuth signOut
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                      >
                        Sign out
                      </button>
                    )}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
