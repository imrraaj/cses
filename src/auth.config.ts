import type { NextAuthConfig } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/lib/definations';
import { db } from './db/db';
import { UsersTable } from './db/schema';
import { eq } from 'drizzle-orm';


async function getUser(email: string): Promise<User | undefined> {
    if (!email) throw new Error('Email is required.');
    try {
        const users = await db.select().from(UsersTable).where(eq(UsersTable.email, email));
        return users[0];
    } catch (error) {
        console.error('Failed to fetch user:', error);
        throw new Error('Failed to fetch user.');
    }
}

export const authConfig = {
    pages: {
        signIn: '/login',
    },
    providers: [
        Credentials({
            async authorize(credentials) {
                const parsedCredentials = z
                    .object({ email: z.string().email(), password: z.string().min(6) })
                    .safeParse(credentials);

                if (parsedCredentials.success) {
                    const { email, password } = parsedCredentials.data;
                    const user = await getUser(email);
                    if (!user) return null;

                    if (password === user.password) {
                        return { ...user, id: user.id.toString() };
                    }
                    return null;
                }
                return null;
            },
        }),
    ],
    callbacks: {
        authorized({ auth, request: { nextUrl } }) {
            const publicallyAccessible = ["", "login", "register", "problems"];
            const userAccessible = ["problem"];
            const adminAccessible = ["dashboard"];
            const currentPath = nextUrl.pathname;

            const isLoggedIn = !!auth?.user;
            const isAdmin = auth?.user.admin;
            
            // Check if the current path is accessible for logged-in users
            if (isLoggedIn && userAccessible.includes(currentPath.split("/")[1])) {
                return true;
            }

            // Check if the current path is accessible for admins
            if (isLoggedIn && isAdmin && adminAccessible.includes(currentPath.split("/")[1])) {
                return true;
            }

            // Check if the current path is publicly accessible
            if (publicallyAccessible.includes(currentPath.split("/")[1])) {
                return true;
            }

            // If none of the above conditions are met, return false
            return false;
        },
        jwt: async ({ token, user }) => {
            if (user) {
                token.email = user.email;
                token.admin = user.admin;
            }
            return token;
        },
        session: ({ session, token, user }) => {

            session.user.email = token.email || "";
            session.user.id = (token.sub || "").toString();
            session.user.admin = token.admin;

            return session;
        },
    },
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60,
    },
    debug: process.env.NODE_ENV === "development",
} satisfies NextAuthConfig;