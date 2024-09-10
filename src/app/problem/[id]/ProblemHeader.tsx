import Link from "next/link";

export default function ProblemHeader({ id }: { id: string }) {
    return (
        <div className="flex gap-4 my-4">
            <Link href={`/problems`}>Problem List</Link>
            <Link href={`/problem/${id}`}>Problem</Link>
            <Link href={`/problem/${id}/submit`}>Submit Code</Link>
            <Link href={`/problem/${id}/my`}>My Submissions</Link>
            <Link href={`/problem/${id}/status`}>Status</Link>
        </div>
    );
}