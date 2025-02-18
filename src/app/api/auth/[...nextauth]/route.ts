// app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions, Session, User } from 'next-auth'
import { JWT } from 'next-auth/jwt'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcrypt'

interface ExtendedUser extends User {
    role?: string;
    clientId?: string;
    client?: {
        id: string;
        name: string;
        isSuperClient: boolean;
        omniGatewayId?: string;
        omniGatewayApiKey?: string;
    };
}

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    pages: {
        signIn: '/auth/login',
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
                if (!credentials?.email || !credentials?.password) {
                    return null
                }
            
                // First get the user with their client
                const user = await prisma.user.findFirst({
                    where: {
                        email: credentials.email
                    },
                    include: {
                        client: true
                    }
                })
            
                if (!user || !user.password) {
                    return null
                }
            
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
            
                if (!isPasswordValid) {
                    return null
                }
            
                // If user is admin and doesn't have a client, find the super client
                if (user.role === 'ADMIN' && !user.clientId) {
                    const superClient = await prisma.client.findFirst({
                        where: {
                            isSuperClient: true
                        }
                    });
            
                    if (superClient) {
                        // Update the user with the super client
                        await prisma.user.update({
                            where: { id: user.id },
                            data: { clientId: superClient.id }
                        });
            
                        return {
                            id: user.id,
                            email: user.email,
                            name: user.name,
                            role: user.role,
                            clientId: superClient.id,
                            client: superClient
                        }
                    }
                }
            
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    role: user.role,
                    clientId: user.clientId || undefined,
                    client: user.client || undefined
                }
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }: { token: JWT, user?: ExtendedUser }): Promise<JWT> {
            if (user) {
                token.role = user.role
                token.id = user.id
                token.clientId = user.clientId
                token.client = user.client
            }
            return token
        },
        async session({ session, token }: { session: Session, token: JWT }): Promise<Session> {
            if (token && session.user) {
                session.user.role = token.role as string
                session.user.id = token.id as string
                session.user.clientId = token.clientId as string
                session.user.client = token.client as any
            }
            return session
        }
    }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }