"use client";

import { Editor } from "@monaco-editor/react";

export default function CodeEditor({ language, code, setCode }: { language: string, code: string, setCode: (value: string) => void }) {
    return (
        <Editor
            height="60vh"
            language={language}
            defaultValue="// write your code here"
            value={code}
            onChange={(e) => setCode(e ?? "")}
            options={{
                minimap: { enabled: false },
            }}
        />
    );
}