import clsx from "clsx";
import Link from "next/link";
import CodeEditor from "./CodeEditor";
import { db } from "@/db/db";
import { ProblemsTable, SubmissionsTable, UsersTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function Problem({ params }: { params: { sid: string } }) {
    const subId = parseInt(params.sid);
    const submissions = await db.select().from(SubmissionsTable).where(eq(SubmissionsTable.id, subId)).leftJoin(ProblemsTable, eq(SubmissionsTable.problemId, ProblemsTable.id)).leftJoin(UsersTable, eq(SubmissionsTable.userId, UsersTable.id));
    const submission = submissions[0];
    const verdict = submission.submissions.verdict;
    return (
        <section>
            <div className="flex justify-between my-4">
                <h1 className="text-3xl font-black">{submission.problems?.title}</h1>
                <div className="flex gap-4">
                    <p>
                        By: <Link href={"/"}>{submission.users?.username}</Link>
                    </p>
                    <p>
                        Verdict: {" "}
                        <span className={clsx(
                            "font-bold",
                            verdict === "ACCEPTED" ? "text-green-500" : verdict === "PENDING" ? "text-slate-400" : "text-red-400"
                        )}>
                            {verdict}
                        </span>
                    </p>
                </div>
            </div>
            <div>
                <CodeEditor
                    language={submission.submissions.language}
                    code={submission.submissions.code}
                />
            </div>
        </section>
    );
}