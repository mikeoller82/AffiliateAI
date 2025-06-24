
'use client';

import { NotionPad } from "@/components/notionpad";

export default function NotionPadPage() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">NotionPad Editor</h2>
                <p className="text-muted-foreground">
                    A modular, Notion-style rich text editor component.
                </p>
            </div>
            <NotionPad />
        </div>
    );
}

