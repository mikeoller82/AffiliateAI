
'use client';
import { Handle, Position, type NodeProps } from 'reactflow';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export type AutomationNodeData = {
  icon: keyof typeof Icons;
  title: string;
  config: any;
};

const nodeStyles = {
  base: 'rounded-xl border-2 w-72 shadow-md transition-shadow duration-300',
  trigger: 'bg-card border-cyan-500/50 hover:shadow-[0_0_15px] hover:shadow-cyan-500/30',
  action: 'bg-card border-purple-500/50 hover:shadow-[0_0_15px] hover:shadow-purple-500/30',
  delay: 'bg-card border-gray-500/50 hover:shadow-[0_0_15px] hover:shadow-gray-500/30',
  condition: 'bg-card border-amber-500/50 hover:shadow-[0_0_15px] hover:shadow-amber-500/30',
};

const getNodeDescription = (type: string, config: any): string => {
    switch (type) {
        case 'trigger':
            return `Form: ${config.formId || 'Any Form'}`;
        case 'action':
            return `Subject: ${config.subject || 'No Subject'}`;
        case 'delay':
            const duration = config.duration || 0;
            const unit = config.unit || 'minutes';
            return `Wait for ${duration} ${duration === 1 ? unit.slice(0, -1) : unit}`;
        case 'condition':
            return `If email...`; // Placeholder
        default:
            return 'Configure this node';
    }
};

function AutomationNode({ data, type, selected }: { data: AutomationNodeData; type: string; selected?: boolean }) {
  const IconComponent = Icons[data.icon] || Icons.HelpCircle;
  const typeStyle = nodeStyles[type as keyof typeof nodeStyles] || nodeStyles.action;
  const description = getNodeDescription(type, data.config);

  return (
    <Card className={cn(nodeStyles.base, typeStyle, selected && 'ring-2 ring-offset-2 ring-primary ring-offset-background')}>
      <CardHeader className="flex flex-row items-center gap-3 space-y-0 p-3">
          <IconComponent className="h-6 w-6" />
          <CardTitle className="text-base flex-1">{data.title}</CardTitle>
      </CardHeader>
      <CardContent className="px-3 pb-3 text-sm text-muted-foreground">
          {description}
      </CardContent>
    </Card>
  );
}

export function TriggerNode({ data, selected }: NodeProps<AutomationNodeData>) {
  return (
    <div>
      <AutomationNode data={data} type="trigger" selected={selected} />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-cyan-500" />
    </div>
  );
}

export function ActionNode({ data, selected }: NodeProps<AutomationNodeData>) {
  return (
    <div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-purple-500" />
      <AutomationNode data={data} type="action" selected={selected} />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-purple-500" />
    </div>
  );
}

export function DelayNode({ data, selected }: NodeProps<AutomationNodeData>) {
  return (
    <div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-500" />
      <AutomationNode data={data} type="delay" selected={selected}/>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-500" />
    </div>
  );
}

export function ConditionNode({ data, selected }: NodeProps<AutomationNodeData>) {
  return (
    <div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-amber-500" />
      <AutomationNode data={data} type="condition" selected={selected}/>
      <Handle type="source" id="true" position={Position.Bottom} style={{ left: '25%' }} className="!bg-green-500" />
      <Handle type="source" id="false" position={Position.Bottom} style={{ left: '75%' }} className="!bg-red-500" />
    </div>
  );
}
