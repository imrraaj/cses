import { signOut } from "@/auth";
import { redirect } from "next/navigation";

export default async function Logout() {
    await signOut();
    redirect("/login");
}