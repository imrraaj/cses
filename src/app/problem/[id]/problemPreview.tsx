"use client";

import Markdown from "react-markdown";

export default function ProblemPreview({ problem }: { problem: any }) {
    const { title, description, timeLimit, memoryLimit, sampleTestCaseInput: sampleInputs, sampleTestCaseOutput: sampleOutputs, explaination } = problem;
    return (
        <section>
            <div className="w-full max-w-4xl mx-auto">
                <div className="rounded-sm">
                    {title && (<h1 className="text-3xl font-black mb-4 text-center">{title}</h1>)}
                    {timeLimit && memoryLimit && (
                        <div className="flex flex-col justify-center gap-2 my-8">
                            <p className="text-center text-sm">Time Limit: {timeLimit} ms</p>
                            <p className="text-center text-sm">Memory Limit: {memoryLimit} MB</p>
                        </div>
                    )}
                    {
                        description && (
                            <Markdown className="my-4 prose prose-headings:text-lg dark:prose-invert">
                                {description}
                            </Markdown>
                        )
                    }
                    <div className="grid gap-4">
                        <div>
                            <div className="flex justify-between">
                                <h2 className="text-lg font-semibold">Sample Inputs</h2>
                                <p className="px-2 py-1 border rounded text-sm cursor-pointer" onClick={e => navigator.clipboard.writeText(sampleInputs)}>Copy</p>
                            </div>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                                <code>
                                    {sampleInputs}
                                </code>
                            </pre>
                        </div>
                        <div>
                            <div className="flex justify-between">
                                <h2 className="text-lg font-semibold">Sample Outputs</h2>
                                <p className="px-2 py-1 border rounded text-sm cursor-pointer" onClick={e => navigator.clipboard.writeText(sampleOutputs)}>Copy</p>
                            </div>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">
                                <code>
                                    {sampleOutputs}
                                </code>
                            </pre>
                        </div>
                    </div>
                    <div className="my-4">
                        <h2 className="text-lg font-semibold">Note</h2>
                        {
                            explaination && (
                                <Markdown className="prose prose-headings:text-lg dark:prose-invert">
                                    {explaination}
                                </Markdown>
                            )
                        }
                    </div>
                </div>
            </div>
        </section>
    );
}