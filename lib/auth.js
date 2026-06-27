// lib/auth.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        await connectDB();

        const user = await User.findOne({ email: credentials.email });
        if (!user) throw new Error("No user found");

        const isValid = await bcrypt.compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid credentials");

        return {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Store role in JWT
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.role = token.role; // Add role to session
        session.user.id = token.id;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export const authHandler = NextAuth(authOptions);
