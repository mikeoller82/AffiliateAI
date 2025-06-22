import { EmailGenerator } from '@/components/ai/tools';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewEmailPage() {
    return (
        <div className="space-y-8">
             <Card>
                <CardHeader>
                    <CardTitle>AI-Powered Email Campaign Creator</CardTitle>
                    <CardDescription>
                        Generate compelling email subject lines and body copy in seconds.
                        Use the result as a starting point for your next campaign.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <EmailGenerator />
                </CardContent>
            </Card>
        </div>
    );
}
