import { auth } from "@/auth";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Problem, Submission, User } from "@/lib/definations";
import clsx from "clsx";
import Link from "next/link";


type Props = {
    submissions: Submission;
    problems: Problem | null;
    users: User | null;
}

export default async function SubmissionsTable({ submissions }: { submissions: Props[] }) {
    return (
        <section className="max-w-7xl mx-auto p-6 md:p-10">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>When</TableHead>
                        <TableHead>Who</TableHead>
                        <TableHead>Problem</TableHead>
                        <TableHead>Language</TableHead>
                        <TableHead>Verdict</TableHead>
                        <TableHead>Time Limit</TableHead>
                        <TableHead>Memory Limit</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {
                        submissions.map((submission) => (
                            <TableRow key={submission.submissions.id}>
                                <TableCell>{submission.submissions.id}</TableCell>
                                <TableCell>{submission.submissions.createdAt.toLocaleString()}</TableCell>
                                <TableCell>{submission.users?.username}</TableCell>
                                <TableCell>
                                    <Link href={`/problem/${submission.problems?.id}`}>
                                        {submission.problems?.title}
                                    </Link>
                                </TableCell>
                                <TableCell>{submission.submissions.language}</TableCell>
                                <TableCell className={clsx("font-bold text-xs", submission.submissions.verdict === "ACCEPTED" ? "text-green-500" : submission.submissions.verdict === "PENDING" ? "text-slate-400" : "text-red-400")}>
                                    {submission.submissions.verdict}
                                </TableCell>
                                <TableCell className={clsx("font-bold text-xs")}>{submission.submissions.time || "N/A"}</TableCell>
                                <TableCell className={clsx("font-bold text-xs")}>{submission.submissions.memory || "N/A"}</TableCell>
                                <TableCell>
                                    <Link href={`/problem/${submission.problems?.id}/submission/${submission.submissions.id}`} className="underline text-sm">
                                        View
                                    </Link>
                                </TableCell>
                            </TableRow>
                        ))
                    }
                </TableBody>
            </Table>
        </section>
    );
}