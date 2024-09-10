import { signOut } from "@/auth";
import Link from "next/link";
import { Button } from "./ui/button";
import Image from "next/image";
import { redirect } from "next/navigation";


export default function Navbar({ isLoggedIn, username }: { isLoggedIn: boolean, username: string }) {
    return (
        <>
            <nav className="flex justify-between items-center py-4 border-b-[1px]">
                <Link href="/">
                    <Image src="https://codeforces.org/s/61612/images/codeforces-sponsored-by-ton.png" alt="Codeforces" height={200} width={200}></Image>
                </Link>
                <div className="flex gap-4 justify-between items-center">
                    {
                        !isLoggedIn && (
                            <>
                                <Link href="/login">Login</Link>
                                <Link href="/register">Register</Link>
                            </>
                        )
                    }
                    {
                        isLoggedIn && (
                            <>
                                <p>{username}</p>
                                <form action={async () => {
                                    "use server";
                                    await signOut();
                                    await redirect("/login");
                                }}>
                                    <Button type="submit">Logout</Button>
                                </form>
                            </>
                        )
                    }
                </div>
            </nav>
        </>
    );
}