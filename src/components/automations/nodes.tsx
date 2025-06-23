
'use client';
import { Handle, Position, type NodeProps } from 'reactflow';
import * as Icons from 'lucide-react';
import { cn } from '@/lib/utils';

type AutomationNodeData = {
  icon: keyof typeof Icons;
  title: string;
  description: string;
};

const nodeStyles = {
  base: 'rounded-xl border-2 p-4 w-64 shadow-glow-primary transition-shadow duration-300',
  trigger: 'bg-card border-cyan-500/50',
  action: 'bg-card border-purple-500/50',
  delay: 'bg-card border-gray-500/50',
  condition: 'bg-card border-amber-500/50',
};

function AutomationNode({ data, type }: { data: AutomationNodeData; type: 'trigger' | 'action' | 'delay' | 'condition' }) {
  const IconComponent = Icons[data.icon] || Icons.HelpCircle;
  const typeStyle = nodeStyles[type] || nodeStyles.action;

  return (
    <div className={cn(nodeStyles.base, typeStyle)}>
        <div className="flex items-center gap-3">
            <IconComponent className="h-6 w-6" />
            <div className="flex-1">
                <div className="font-bold text-card-foreground">{data.title}</div>
                <div className="text-xs text-muted-foreground">{data.description}</div>
            </div>
        </div>
    </div>
  );
}

export function TriggerNode({ data }: NodeProps<AutomationNodeData>) {
  return (
    <div>
      <AutomationNode data={data} type="trigger" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-cyan-500" />
    </div>
  );
}

export function ActionNode({ data }: NodeProps<AutomationNodeData>) {
  return (
    <div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-purple-500" />
      <AutomationNode data={data} type="action" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-purple-500" />
    </div>
  );
}

export function DelayNode({ data }: NodeProps<AutomationNodeData>) {
  return (
    <div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-gray-500" />
      <AutomationNode data={data} type="delay" />
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 !bg-gray-500" />
    </div>
  );
}

export function ConditionNode({ data }: NodeProps<AutomationNodeData>) {
  return (
    <div>
      <Handle type="target" position={Position.Top} className="w-2 h-2 !bg-amber-500" />
      <AutomationNode data={data} type="condition" />
      <Handle type="source" id="true" position={Position.Bottom} style={{ left: '25%' }} className="w-2 h-2 !bg-green-500" />
      <Handle type="source" id="false" position={Position.Bottom} style={{ left: '75%' }} className="w-2 h-2 !bg-red-500" />
    </div>
  );
}
