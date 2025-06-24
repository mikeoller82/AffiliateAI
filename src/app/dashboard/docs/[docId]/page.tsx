
'use client';
import { useParams } from 'next/navigation';
import { NotionPad } from "@/components/notionpad";
import { getDocById } from '@/lib/docs-templates';

export default function DocEditorPage() {
    const params = useParams<{ docId: string }>();
    const doc = getDocById(params.docId);

    const title = doc ? doc.title : 'New Document';
    const description = doc ? doc.description : 'Start writing your new document here.';

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
                <p className="text-muted-foreground">
                    {description}
                </p>
            </div>
            <NotionPad />
        </div>
    );
}
