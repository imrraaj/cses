"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea";
import { saveSubmission } from "../actions";
import { useFormState } from "react-dom";
import CodeEditor from "./CodeEditor";
import { useState } from "react";



export default function Problem({ params }: { params: { id: string } }) {
    const [state, dispatch] = useFormState(saveSubmission, {} as any);
    const [code, setCode] = useState<string>("");
    const [language, setLanguage] = useState<string>("");
    return (
        <section className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-center my-4">
                Submit Solution
            </h1>
            <form action={dispatch}>
                <div className="flex justify-end my-4 items-end">
                        <div className="flex gap-4">
                            <Select required name="language" onValueChange={setLanguage}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select a language" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="python">Python</SelectItem>
                                    <SelectItem value="cpp">C++</SelectItem>
                                </SelectContent>
                            </Select>
                            <Button>Submit</Button>
                        </div>
                </div>
                <div>
                    <Label className="sr-only" htmlFor="problemId">ID: </Label>
                    <Input className="sr-only" id="problemId" name="problemId" value={params.id} readOnly />
                </div>
                <Textarea id="code" name="code" defaultValue={code} className="sr-only" />
                <CodeEditor language={language} code={code} setCode={setCode} />
            </form>

        </section>
    );
}