"use client";

import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      // Re-fetch session after login
      const sessionRes = await fetch("/api/auth/session");
      const data = await sessionRes.json();

      if (data?.user?.role === "admin") router.push("/admin");
      else if (data?.user?.role === "teacher") router.push("/teacher");
      else if (data?.user?.role === "student") router.push("/student");
      
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gradient-to-br from-blue-900 via-indigo-800 to-purple-900">
      {/* Left Side - Branding */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-10 text-white"
      >
        <h1 className="text-4xl font-bold mb-4">Welcome to Tuition Portal</h1>
        <p className="text-lg text-gray-300 max-w-md text-center">
          Manage classes, notes, and marks with ease — for Admins, Teachers, and Students.
        </p>
        <img
          src="/illustrations/login-graphic.svg"
          alt="Education Illustration"
          className="mt-10 max-w-sm drop-shadow-lg"
        />
      </motion.div>

      {/* Right Side - Login Form */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="flex-1 flex items-center justify-center p-6"
      >
        <div className="w-full max-w-md bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-white mb-6">
            Sign In
          </h2>

          {error && (
            <p className="bg-red-500/20 text-red-200 p-2 rounded text-center mb-4 text-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-white text-sm block mb-1">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-white text-sm block mb-1">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-400 transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:from-indigo-600 hover:to-purple-600 transition-all"
            >
              Sign In
            </motion.button>
          </form>

          <p className="text-gray-300 text-sm text-center mt-6">
            © {new Date().getFullYear()} Tuition Portal. All rights reserved.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
