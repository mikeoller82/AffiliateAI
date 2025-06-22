
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

export default function EmailSettingsPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
             <div>
                <h2 className="text-2xl font-bold tracking-tight">Email Settings</h2>
                <p className="text-muted-foreground">
                    Configure your sending provider, domains, and deliverability settings.
                </p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Sending Provider (SMTP)</CardTitle>
                    <CardDescription>Connect to a service to send your emails. We recommend Amazon SES for deliverability.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="provider">Provider</Label>
                        <Select defaultValue="ses">
                            <SelectTrigger id="provider">
                                <SelectValue placeholder="Select a provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="ses">Amazon SES</SelectItem>
                                <SelectItem value="sendgrid">SendGrid</SelectItem>
                                <SelectItem value="mailgun">Mailgun</SelectItem>
                                <SelectItem value="postmark">Postmark</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="api-key">API Key</Label>
                        <Input id="api-key" type="password" placeholder="••••••••••••••••••••••••" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="region">AWS Region (if using SES)</Label>
                        <Input id="region" placeholder="e.g., us-east-1" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Sending Defaults</CardTitle>
                    <CardDescription>Default settings for all outgoing campaigns.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <Label htmlFor="from-name">"From" Name</Label>
                        <Input id="from-name" placeholder="Your Company Name" />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="from-email">"From" Email Address</Label>
                        <Input id="from-email" type="email" placeholder="hello@yourdomain.com" />
                    </div>
                </CardContent>
            </Card>
             <div className="flex justify-end">
                <Button>Save Settings</Button>
            </div>
        </div>
    )
}
