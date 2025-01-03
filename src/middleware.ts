// middleware.ts
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token
        const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
        const isRestaurantRoute = req.nextUrl.pathname.startsWith('/restaurant')

        if (isAdminRoute && token?.role !== "ADMIN") {
            return NextResponse.redirect(new URL("/restaurant/dashboard", req.url))
        }

        // if (isRestaurantRoute && token?.role !== "RESTAURANT") {
        //     return NextResponse.redirect(new URL("/admin/dashboard", req.url))
        // }
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        }
    }
)

export const config = {
    matcher: ["/admin/:path*", "/restaurant/:path*"]
}