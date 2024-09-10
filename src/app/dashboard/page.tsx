import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { db } from "@/db/db";
import { ProblemsTable } from "@/db/schema";
import Link from "next/link";

export default async function ProblemTable() {
    const problems = await db.select().from(ProblemsTable);
    const userSession = await auth();
    console.log({ userSession });
    if (!userSession?.user) throw new Error("User not found");
    return (
        <section>
            <div className="min-h-96 mt-8">
                <Table>
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Problem</TableHead>
                            <TableHead>Time Limit</TableHead>
                            <TableHead>Memory Limit</TableHead>
                            <TableHead>Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            problems.map((p) => (
                                <TableRow key={p.id}>
                                    <TableCell>{p.id}</TableCell>
                                    <TableCell>{p.title}</TableCell>
                                    <TableCell>{p.timeLimit}</TableCell>
                                    <TableCell>{p.memoryLimit}</TableCell>
                                    <TableCell>
                                        <Link href={`/dashboard/edit/problem/${p.id}`} passHref className="bg-blue-200 py-1 px-2 rounded-sm shadow-sm">
                                            Edit
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </div>

            <div className="flex gap-4 justify-center items-center">
                <Button>
                    <Link href={'/dashboard/create/problem'} passHref>
                        Create Problem
                    </Link>
                </Button>
                <Button>
                    <Link href={'/dashboard/create/contest'} passHref>
                        Create Contest
                    </Link>
                </Button>
            </div>
        </section>
    );
}