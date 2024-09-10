import { db } from "@/db/db";
import { ProblemsTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import ProblemPreview from "./problemPreview";

export default async function Problem({ params }: { params: { id: string } }) {
    const problems = await db.select().from(ProblemsTable).where(eq(ProblemsTable.id, parseInt(params.id)));
    const problem = problems[0];
    if (!problem) return (<div>Problem not found</div>);
    return (
        <ProblemPreview problem={problem} />
    );
}