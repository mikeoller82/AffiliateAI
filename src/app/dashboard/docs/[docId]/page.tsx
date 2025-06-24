
'use client';
import { useParams } from 'next/navigation';
import { getDocById } from '@/lib/docs-templates';
import { DocViewer } from '@/components/docs/doc-viewer';

export default function DocViewerPage() {
    const params = useParams<{ docId: string }>();
    const doc = getDocById(params.docId);

    if (!doc) {
        return (
             <div className="space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Document not found</h2>
                <p className="text-muted-foreground">
                    The document you are looking for does not exist.
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-bold tracking-tight">{doc.title}</h2>
                <p className="text-muted-foreground">
                    {doc.description}
                </p>
            </div>
            <DocViewer content={doc.content} />
        </div>
    );
}
