import { db } from "@/db/db";
import { ProblemsTable, SubmissionsTable } from "@/db/schema";

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import { count, desc, eq } from "drizzle-orm";



export default async function Problems() {
    const problems = await db.select({
        id: ProblemsTable.id,
        title: ProblemsTable.title,
        description: ProblemsTable.description,
        sampleTestCaseInput: ProblemsTable.sampleTestCaseInput,
        sampleTestCaseOutput: ProblemsTable.sampleTestCaseOutput,
        explaination: ProblemsTable.explaination,
        timeLimit: ProblemsTable.timeLimit,
        memoryLimit: ProblemsTable.memoryLimit,
        createdAt: ProblemsTable.createdAt,
        submissionCount: count(SubmissionsTable.id),
    }).from(ProblemsTable).leftJoin(SubmissionsTable, eq(ProblemsTable.id, SubmissionsTable.problemId)).groupBy(ProblemsTable.id).orderBy(desc(ProblemsTable.id));
    return (
        <section className="max-w-7xl mx-auto p-6 md:p-10">
            <h1 className="text-3xl font-black text-center my-4">
                Problems
            </h1>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Time Limit</TableHead>
                        <TableHead>Memory Limit</TableHead>
                        <TableHead>Submissions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {problems.map((problem) => (
                        <TableRow key={problem.id}>
                            <TableCell>{problem.id}</TableCell>
                            <TableCell>
                                <Link href={`/problem/${problem.id}`}>
                                    {problem.title}
                                </Link>
                            </TableCell>
                            <TableCell>{problem.timeLimit}</TableCell>
                            <TableCell>{problem.memoryLimit}</TableCell>
                            <TableCell>
                                <Link href={`/problem/${problem.id}/status`}>
                                    x{problem.submissionCount}
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    );
}