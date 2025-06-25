
'use client';

import { useParams } from 'next/navigation';

// This is a placeholder for the future course editor.
export default function CourseEditorPage() {
    const params = useParams<{ courseId: string }>();

    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="text-center">
                <h1 className="text-3xl font-bold">Course Editor</h1>
                <p className="mt-2 text-muted-foreground">
                    Now editing course: <span className="font-mono text-primary">{params.courseId}</span>
                </p>
                 <p className="mt-4 text-sm text-muted-foreground">
                    The full course curriculum builder will be developed here.
                </p>
            </div>
        </div>
    );
}
