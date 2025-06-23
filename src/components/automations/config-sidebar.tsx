
'use client';
import type { Node } from 'reactflow';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import * as Icons from 'lucide-react';

interface ConfigSidebarProps {
  node: Node;
  onConfigChange: (config: any) => void;
  onClose: () => void;
}

const mockForms = [
    { id: 'form_1', name: 'Lead Magnet Download' },
    { id: 'form_2', name: 'Contact Us Page' },
    { id: 'form_3', name: 'Webinar Registration' },
];

const TriggerConfigForm = ({ config, onConfigChange }: { config: any, onConfigChange: (c:any) => void}) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="formId">Trigger Form</Label>
                <Select
                    value={config.formId || ''}
                    onValueChange={(value) => onConfigChange({ ...config, formId: value })}
                >
                    <SelectTrigger id="formId"><SelectValue placeholder="Select a form..." /></SelectTrigger>
                    <SelectContent>
                        {mockForms.map(form => (
                            <SelectItem key={form.id} value={form.id}>{form.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

const ActionConfigForm = ({ config, onConfigChange }: { config: any, onConfigChange: (c:any) => void}) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="subject">Email Subject</Label>
                <Input 
                    id="subject" 
                    placeholder="Enter email subject"
                    value={config.subject || ''}
                    onChange={(e) => onConfigChange({ ...config, subject: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="body">Email Body</Label>
                <Textarea
                    id="body"
                    placeholder="Enter email body. Use {{contact.name}} for personalization."
                    value={config.body || ''}
                    onChange={(e) => onConfigChange({ ...config, body: e.target.value })}
                    className="min-h-[200px]"
                />
            </div>
        </div>
    );
};

const DelayConfigForm = ({ config, onConfigChange }: { config: any, onConfigChange: (c:any) => void}) => {
    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <Label>Wait Duration</Label>
                <div className="flex gap-2">
                    <Input
                        type="number"
                        min="1"
                        value={config.duration || '1'}
                        onChange={(e) => onConfigChange({ ...config, duration: parseInt(e.target.value, 10) || 1 })}
                        className="w-24"
                    />
                    <Select
                        value={config.unit || 'days'}
                        onValueChange={(value) => onConfigChange({ ...config, unit: value })}
                    >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="minutes">Minutes</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="weeks">Weeks</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
}

const renderConfigForm = (node: Node, onConfigChange: (c:any) => void) => {
    switch (node.type) {
        case 'trigger':
            return <TriggerConfigForm config={node.data.config} onConfigChange={onConfigChange} />;
        case 'action':
             return <ActionConfigForm config={node.data.config} onConfigChange={onConfigChange} />;
        case 'delay':
            return <DelayConfigForm config={node.data.config} onConfigChange={onConfigChange} />;
        default:
            return <p className="text-muted-foreground">Configuration for this node is not yet available.</p>;
    }
};

export function ConfigSidebar({ node, onConfigChange, onClose }: ConfigSidebarProps) {
  const IconComponent = Icons[node.data.icon as keyof typeof Icons] || Icons.HelpCircle;

  return (
    <aside className="w-80 bg-card border-r p-4 flex flex-col h-full">
        <div className="flex items-center justify-between pb-4 border-b">
            <div className="flex items-center gap-2">
                <IconComponent className="h-5 w-5" />
                <h2 className="text-lg font-semibold tracking-tight">{node.data.title}</h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
                <Icons.X className="h-4 w-4" />
            </Button>
        </div>
        <div className="flex-1 py-4 overflow-y-auto">
            {renderConfigForm(node, onConfigChange)}
        </div>
    </aside>
  );
}
