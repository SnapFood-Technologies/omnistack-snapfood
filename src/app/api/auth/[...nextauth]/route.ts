// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

interface ExtendedUser extends User {
    role?: string;
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt'
    },
    providers: [
        CredentialsProvider({
            name: 'credentials',
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "hello@example.com"
                },
                password: {
                    label: "Password",
                    type: "password"
                }
            },
            async authorize(credentials): Promise<ExtendedUser | null> {
                // @ts-ignore
                if (!credentials?.email || !credentials?.password) {
                    return null
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                })

                if (!user || !user.password) {
                    return null
                }

                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)

                if (!isPasswordValid) {
                    return null
                }

                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT, user?: ExtendedUser }): Promise<JWT> {
            if (user) {
                // @ts-ignore
                token.role = user.role
                token.id = user.id
            }
            return token
        },
        async session({ session, token }: { session: Session, token: JWT }): Promise<Session> {
            if (token && session.user) {
                // @ts-ignore
                session.user.role = token.role as string
                session.user.id = token.id as string
            }
            return session
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }