"use client";

import { Editor } from "@monaco-editor/react";

export default function CodeEditor({ language, code }: { language: string, code: string }) {
    return (
        <Editor
            height="60vh"
            language={language}
            defaultValue={code}
            options={{
                minimap: { enabled: false },
                readOnly: true
            }}
        />
    );
}