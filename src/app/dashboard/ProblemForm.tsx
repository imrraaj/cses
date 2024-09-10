"use client"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import Markdown from "react-markdown";
import { useFormState } from "react-dom"

export default function ProblemForm({
    action,
    _id,
    _title,
    _description,
    _timeLimit,
    _memoryLimit,
    _sampleInputs,
    _sampleOutputs,
    _explaination
}: {
    action: (prev: any, formdata: FormData) => Promise<void>
    _id?: number,
    _title: string,
    _description: string,
    _timeLimit: number,
    _memoryLimit: number,
    _sampleInputs: string,
    _sampleOutputs: string,
    _explaination: string | null
}) {
    const [title, setTitle] = useState(_title)
    const [description, setDescription] = useState(_description)
    const [timeLimit, setTimeLimit] = useState(_timeLimit)
    const [memoryLimit, setMemoryLimit] = useState(_memoryLimit)
    const [sampleInputs, setSampleInputs] = useState(_sampleInputs)
    const [sampleOutputs, setSampleOutputs] = useState(_sampleOutputs)
    const [explaination, setExplaination] = useState(_explaination)
    const [inputFile, setInputFile] = useState<File | null>(null)
    const [outputFile, setOutputFile] = useState<File | null>(null)
    const [previewMode, setPreviewMode] = useState(false);

    const [state, formAction] = useFormState(action, { success: false, message: "" } as any);

    const PreviewModeSwitch = () => {
        return (
            <div className="col-start-12 flex gap-4 items-center justify-end">
                <Label htmlFor="preview-mode">Preview</Label>
                <Switch
                    id="preview-mode"
                    checked={previewMode}
                    onCheckedChange={() => setPreviewMode(!previewMode)}
                />
            </div>
        )
    }

    if (previewMode) {
        return (
            <div className="w-full max-w-4xl mx-auto p-6 md:p-10">
                <PreviewModeSwitch />
                <div className="rounded-sm p-4 my-8">
                    {title && (<h1 className="text-2xl font-bold mb-4 text-center">{title}</h1>)}
                    {timeLimit && memoryLimit && (
                        <div className="flex flex-col justify-center gap-2">
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
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">{sampleInputs}</pre>
                        </div>
                        <div>
                            <div className="flex justify-between">
                                <h2 className="text-lg font-semibold">Sample Outputs</h2>
                                <p className="px-2 py-1 border rounded text-sm cursor-pointer" onClick={e => navigator.clipboard.writeText(sampleOutputs)}>Copy</p>
                            </div>
                            <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-md">{sampleOutputs}</pre>
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
        )
    }

    return (
        <div className="w-full max-w-4xl mx-auto p-6 md:p-10">
            <section>
                <PreviewModeSwitch />
                {state?.success === false ? (
                    <div className="bg-red-100 text-red-700 rounded-md">
                        {state?.message}
                    </div>
                ) : (
                    <div className="bg-green-100 text-green-700 rounded-md">
                        {state?.message}
                    </div>
                )}
                <form action={formAction} className="space-y-8">
                    <div>
                        <Label className="sr-only" htmlFor="problemId">ID: </Label>
                        <Input className="sr-only" id="problemId" name="id" value={_id} readOnly />
                    </div>
                    <div>
                        <Label className="text-lg font-semibold" htmlFor="title">Problem Title</Label>
                        <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                    </div>
                    <div>
                        <Label className="text-lg font-semibold" htmlFor="description">Problem Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={description}
                            rows={25}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            You can use Markdown formatting in the description.
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <Label className="text-lg font-semibold" htmlFor="time-limit">Time Limit</Label>
                            <Input
                                id="time-limit"
                                name="timeLimit"
                                type="number"
                                value={timeLimit}
                                onChange={(e) => setTimeLimit(parseInt(e.target.value, 10))}
                                min={1}
                                required
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400">Time limit in mili-seconds.</p>
                        </div>
                        <div>
                            <Label className="text-lg font-semibold" htmlFor="memory-limit">Memory Limit</Label>
                            <Input
                                id="memory-limit"
                                name="memoryLimit"
                                type="number"
                                value={memoryLimit}
                                onChange={(e) => setMemoryLimit(parseInt(e.target.value, 10))}
                                min={1}
                                required
                            />
                            <p className="text-sm text-gray-500 dark:text-gray-400">Memory limit in megabytes.</p>
                        </div>
                    </div>
                    <div>
                        <div className="grid gap-4">
                            <div>
                                <Label className="text-lg font-semibold" htmlFor="sample-inputs">Sample Inputs</Label>
                                <Textarea
                                    id="sample-inputs"
                                    name="sampleTestCaseInput"
                                    value={sampleInputs}
                                    rows={10}
                                    onChange={(e) => setSampleInputs(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label className="text-lg font-semibold" htmlFor="sample-outputs">Sample Outputs</Label>
                                <Textarea
                                    id="sample-outputs"
                                    name="sampleTestCaseOutput"
                                    value={sampleOutputs}
                                    rows={10}
                                    onChange={(e) => setSampleOutputs(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <Label className="text-lg font-semibold" htmlFor="explaination">
                                    Explainaton
                                </Label>
                                <Textarea
                                    id="explaination"
                                    name="explaination"
                                    value={explaination || ""}
                                    rows={20}
                                    onChange={(e) => setExplaination(e.target.value)}
                                    placeholder="Explain the problem in detail"
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <Label className="text-lg font-semibold">Test Cases</Label>
                        <div className="grid gap-4">
                            <div>
                                <Label htmlFor="input-file">Input File</Label>
                                <Input id="input-file" type="file" name="inputTests" onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setInputFile(e.target.files[0])
                                    }
                                }} />
                            </div>
                            <div>
                                <Label htmlFor="output-file">Output File</Label>
                                <Input id="output-file" type="file" name="outputTests" onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setOutputFile(e.target.files[0])
                                    }
                                }} />
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <Button type="submit">Save Problem</Button>
                    </div>
                </form >
            </section>
        </div >
    )
}