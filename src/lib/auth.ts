import { getServerSession } from "next-auth"
import { DefaultSession, NextAuthOptions } from "next-auth"
import { authOptions as nextAuthOptions } from "@/app/api/auth/[...nextauth]/route"

// Type assertion for authOptions since it's properly typed in the route file
export const authOptions = nextAuthOptions as NextAuthOptions
export const getAuthSession = () => getServerSession(authOptions)

declare module "next-auth" {
    interface User {
        role?: string
        id?: string
    }

    interface Session {
        user: {
            role?: string
            id?: string
        } & DefaultSession["user"]
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        role?: string
        id?: string
    }
}