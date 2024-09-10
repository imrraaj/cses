import { auth } from "@/auth";
import SubmissionsTableComponent from "../SubmissionTable";
import { db } from "@/db/db";
import { ProblemsTable, SubmissionsTable, UsersTable } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
export default async function Problem({ params }: { params: { id: string } }) {
    const userSession = await auth();
    console.log({ userSession });
    if (!userSession?.user) throw new Error("User not found");
    const userId = parseInt(userSession.user.id || "");
    if (!userId) throw new Error("User not found");

    const problemId = parseInt(params.id);
    const submissions = await db.select().from(SubmissionsTable).where(
        and(
            eq(SubmissionsTable.problemId, problemId),
            eq(SubmissionsTable.userId, userId)
        )).leftJoin(ProblemsTable, eq(SubmissionsTable.problemId, ProblemsTable.id)).leftJoin(UsersTable, eq(SubmissionsTable.userId, UsersTable.id)).orderBy(desc(SubmissionsTable.createdAt));

    return (
        <section className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-center my-4">
                My Submissions
            </h1>
            <SubmissionsTableComponent submissions={submissions} />
        </section>
    );
}