import { db } from "@/db/db";
import SubmissionsTableComponent from "../SubmissionTable";
import { ProblemsTable, SubmissionsTable, UsersTable } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export default async function Status({ params }: { params: { id: string } }) {

    const problemId = parseInt(params.id);
    const submissions = await db.select().from(SubmissionsTable).where(eq(SubmissionsTable.problemId, problemId)).leftJoin(ProblemsTable, eq(SubmissionsTable.problemId, ProblemsTable.id)).leftJoin(UsersTable, eq(SubmissionsTable.userId, UsersTable.id)).orderBy(desc(SubmissionsTable.createdAt));

    return (
        <section className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-center my-4">
                Status
            </h1>
            <SubmissionsTableComponent submissions={submissions} />
        </section>
    );
}