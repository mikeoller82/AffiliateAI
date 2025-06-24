
'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { EmailGenerator } from '@/components/ai/tools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { emailTemplates } from '@/lib/email-templates';

function NewEmailCreator() {
    const searchParams = useSearchParams();
    const templateId = searchParams.get('template');
    const template = emailTemplates.find(t => t.id === templateId);

    const defaultValues = template ? {
        objective: template.objective,
        tone: template.tone,
        productDetails: template.productDetails,
    } : undefined;

    return (
        <div className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Email Campaign Creator</CardTitle>
                    <CardDescription>
                        {template ? `Using template: ${template.title}` : 'Generate compelling email subject lines and body copy in seconds.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EmailGenerator key={templateId} defaultValues={defaultValues} />
                </CardContent>
            </Card>
        </div>
    );
}

export default function NewEmailPage() {
    return (
        <Suspense fallback={<div>Loading template...</div>}>
            <NewEmailCreator />
        </Suspense>
    );
}

    