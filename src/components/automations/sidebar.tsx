
'use client';

import * as Icons from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { cn } from '@/lib/utils';
import type { AutomationNodeData } from './nodes';

type DraggableNodeProps = {
  nodeType: 'trigger' | 'action' | 'delay' | 'condition';
  label: string;
  icon: keyof typeof Icons;
  defaultConfig: any;
};

const nodeStyles = {
    trigger: 'border-cyan-500/50 hover:border-cyan-500',
    action: 'border-purple-500/50 hover:border-purple-500',
    delay: 'border-gray-500/50 hover:border-gray-500',
    condition: 'border-amber-500/50 hover:border-amber-500',
};

const initialNodeData: Omit<AutomationNodeData, 'config'> = {
  icon: 'Settings',
  title: 'New Node',
};

function DraggableNode({ nodeType, label, icon, defaultConfig }: DraggableNodeProps) {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>) => {
        const nodeData: AutomationNodeData = {
          icon: icon,
          title: label,
          config: defaultConfig,
        };
        event.dataTransfer.setData('application/reactflow/node-type', nodeType);
        event.dataTransfer.setData('application/reactflow/node-data', JSON.stringify(nodeData));
        event.dataTransfer.effectAllowed = 'move';
    };
    
    const IconComponent = Icons[icon] || Icons.HelpCircle;
    const typeStyle = nodeStyles[nodeType];

    return (
        <div
            className={cn("p-3 rounded-lg border-2 bg-card cursor-grab flex items-center gap-3 transition-colors", typeStyle)}
            onDragStart={onDragStart}
            draggable
        >
            <IconComponent className="h-5 w-5" />
            <span className="text-sm font-medium">{label}</span>
        </div>
    );
}

export function NodeLibrarySidebar() {
  return (
    <aside className="w-80 bg-card border-r p-4 flex flex-col gap-6 h-full overflow-y-auto">
        <CardTitle>Node Library</CardTitle>
        <div>
            <h3 className="text-lg font-semibold tracking-tight mb-4 mt-2">Triggers</h3>
            <div className="space-y-2">
                <DraggableNode nodeType="trigger" label="Form Submitted" icon="ClipboardEdit" defaultConfig={{ formId: ''}} />
                <DraggableNode nodeType="trigger" label="Tag Added" icon="Tag" defaultConfig={{ tagName: ''}} />
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold tracking-tight mb-4">Actions</h3>
            <div className="space-y-2">
                <DraggableNode nodeType="action" label="Send Email" icon="Mail" defaultConfig={{ subject: '', body: ''}} />
                <DraggableNode nodeType="action" label="Send SMS" icon="MessageSquare" defaultConfig={{ message: ''}} />
                <DraggableNode nodeType="action" label="Add Tag" icon="Tag" defaultConfig={{ tagName: ''}} />
                <DraggableNode nodeType="action" label="Webhook" icon="ArrowRightLeft" defaultConfig={{ url: '', method: 'POST'}} />
            </div>
        </div>
        <div>
            <h3 className="text-lg font-semibold tracking-tight mb-4">Logic</h3>
            <div className="space-y-2">
                <DraggableNode nodeType="delay" label="Wait / Delay" icon="Hourglass" defaultConfig={{ duration: 1, unit: 'days'}} />
                <DraggableNode nodeType="condition" label="If/Else Condition" icon="GitFork" defaultConfig={{ source: '', operator: '', value: '' }} />
            </div>
        </div>
    </aside>
  );
}
