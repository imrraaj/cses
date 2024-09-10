import ProblemHeader from "./ProblemHeader";

export default function ProblemLayout({
    children,
    params
}: Readonly<{
    children: React.ReactNode,
    params: { id: string }
}>) {
    return (
        <section className="max-w-[1440px] mx-auto">
            <ProblemHeader id={params.id} />
            {children}
        </section>
    );
}
