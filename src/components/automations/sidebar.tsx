
'use client';

import * as Icons from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';

type DraggableNodeProps = {
  nodeType: 'trigger' | 'action' | 'delay' | 'condition';
  label: string;
  icon: keyof typeof Icons;
};

const nodeStyles = {
    trigger: 'border-cyan-500/50 hover:border-cyan-500',
    action: 'border-purple-500/50 hover:border-purple-500',
    delay: 'border-gray-500/50 hover:border-gray-500',
    condition: 'border-amber-500/50 hover:border-amber-500',
};


function DraggableNode({ nodeType, label, icon }: DraggableNodeProps) {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };
    
    const IconComponent = Icons[icon] || Icons.HelpCircle;
    const typeStyle = nodeStyles[nodeType];

    return (
        <div
            className={cn("p-3 rounded-lg border-2 bg-card cursor-grab flex items-center gap-3 transition-colors", typeStyle)}
            onDragStart={(event) => onDragStart(event, nodeType)}
            draggable
        >
            <IconComponent className="h-5 w-5" />
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}

export function AutomationSidebar() {
  return (
    <aside className="w-72 bg-card border-r p-4 flex flex-col gap-6">
        <div>
            <h2 className="text-lg font-semibold tracking-tight mb-4">Triggers</h2>
            <div className="space-y-2">
                <DraggableNode nodeType="trigger" label="Form Submitted" icon="ClipboardEdit" />
                <DraggableNode nodeType="trigger" label="Tag Added" icon="Tag" />
            </div>
        </div>
        <div>
            <h2 className="text-lg font-semibold tracking-tight mb-4">Actions</h2>
            <div className="space-y-2">
                <DraggableNode nodeType="action" label="Send Email" icon="Mail" />
                <DraggableNode nodeType="action" label="Send SMS" icon="MessageSquare" />
                <DraggableNode nodeType="action" label="Add Tag" icon="Tag" />
                <DraggableNode nodeType="action" label="Webhook" icon="ArrowRightLeft" />
            </div>
        </div>
        <div>
            <h2 className="text-lg font-semibold tracking-tight mb-4">Logic</h2>
            <div className="space-y-2">
                <DraggableNode nodeType="delay" label="Wait / Delay" icon="Hourglass" />
                <DraggableNode nodeType="condition" label="If/Else Condition" icon="GitFork" />
            </div>
        </div>
    </aside>
  );
}
