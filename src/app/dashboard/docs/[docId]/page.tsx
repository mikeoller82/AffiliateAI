'use client';
import { useParams } from 'next/navigation';
import { getDocById } from '@/lib/docs-templates';
import { DocViewer } from '@/components/docs/doc-viewer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocViewerPage() {
    const params = useParams<{ docId: string }>();
    const doc = getDocById(params.docId);

    if (!doc) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle>Document Not Found</CardTitle>
                    <CardDescription>
                        The document you are looking for does not exist or could not be loaded.
                    </CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-3xl">{doc.title}</CardTitle>
                <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent>
                <DocViewer content={doc.content} />
            </CardContent>
        </Card>
    );
}
