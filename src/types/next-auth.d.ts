import NextAuth, { type DefaultSession, User } from "next-auth"
import { JWT } from "next-auth/jwt"

declare module "next-auth/jwt" {
    interface JWT {
        id: string
        admin: boolean
    }
}

declare module "next-auth" {
    /**
     * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
     */
    interface Session extends DefaultSession {
        user: {
            id: string
            admin: boolean
        }
    }

    interface User {
        id: string
        admin: boolean
    }
}