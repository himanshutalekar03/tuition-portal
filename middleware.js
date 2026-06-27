import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Check if the user is accessing a protected route
    if (path.startsWith("/admin") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/teacher") && token?.role !== "teacher" && token?.role !== "admin") {
      // Assuming admins might want to see teacher routes, or just restrict it.
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/student") && token?.role !== "student" && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/teacher/:path*", "/student/:path*"],
};
