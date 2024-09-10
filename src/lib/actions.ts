"use server";

import { signIn } from '@/auth';
import { db } from '@/db/db';
import { UsersTable } from '@/db/schema';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';


export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    try {
        await signIn('credentials', {
            email,
            password,
            redirect: true,
            redirectTo: '/',
        });
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
    redirect('/dashboard');
}


export async function registerUser(
    prevState: any,
    formData: FormData
) {
    // Register user
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string; // Add this line

    try {
        const user = await db.insert(UsersTable).values({
            name, // Add this line
            email,
            username,
            password,
        });
        console.log('user:', user);
        await signIn('credentials', { email, password });
    } catch (error) {
        console.error('Failed to register user:', error);
        throw error;
    }
}