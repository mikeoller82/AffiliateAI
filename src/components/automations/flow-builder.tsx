
'use client';

import React, { useState, useRef, useCallback, useMemo } from 'react';
import ReactFlow, {
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  MiniMap,
  Background,
  type Connection,
  type Edge,
  type Node,
  type OnNodesChange,
  type OnEdgesChange,
  type NodeProps,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { NodeLibrarySidebar } from './sidebar';
import { ConfigSidebar } from './config-sidebar';
import { TriggerNode, ActionNode, DelayNode, ConditionNode } from './nodes';
import { Button } from '../ui/button';
import { Save, PanelLeft } from 'lucide-react';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { 
        icon: 'PlayCircle', 
        title: 'Lead Form Submitted', 
        config: { formId: 'form_1' } 
    },
  },
  {
    id: '2',
    type: 'action',
    position: { x: 250, y: 250 },
    data: { 
        icon: 'Mail', 
        title: 'Send Welcome Email', 
        config: { 
            subject: 'Welcome to the family!', 
            body: 'Hi {{contact.name}}, thanks for signing up!' 
        }
    },
  },
  {
    id: '3',
    type: 'delay',
    position: { x: 250, y: 450 },
    data: {
        icon: 'Hourglass',
        title: 'Wait',
        config: {
            duration: 2,
            unit: 'days'
        }
    }
  }
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e1-3', source: '2', target: '3', animated: true },
];

let id = 4;
const getId = () => `${id++}`;

export function FlowBuilder() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const nodeTypes = useMemo(() => ({
    trigger: TriggerNode,
    action: ActionNode,
    delay: DelayNode,
    condition: ConditionNode,
  }), []);
  
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node);
    setIsSidebarOpen(true);
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNode(null);
  }, []);
  
  const onNodesDelete = useCallback(() => {
      setSelectedNode(null);
  }, []);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge({ ...params, animated: true }, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();

      if (!reactFlowWrapper.current || !reactFlowInstance) {
          return;
      }

      const type = event.dataTransfer.getData('application/reactflow/node-type');
      const nodeData = JSON.parse(event.dataTransfer.getData('application/reactflow/node-data'));

      if (typeof type === 'undefined' || !type) {
        return;
      }
      
      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: getId(),
        type,
        position,
        data: nodeData,
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [reactFlowInstance, setNodes]
  );

  const handleConfigChange = (config: any) => {
      if(!selectedNode) return;
      setNodes((nds) => nds.map(node => {
          if (node.id === selectedNode.id) {
              node.data = { ...node.data, config };
          }
          return node;
      }));
       // Also update the selectedNode state to have the latest data
      setSelectedNode(prev => prev ? {...prev, data: {...prev.data, config}} : null);
  }
  
  const handleSave = () => {
    // In a real app, you'd send this to a server
    const flowData = {
        nodes,
        edges,
    };
    console.log("Saving flow:", JSON.stringify(flowData, null, 2));
    alert("Flow saved! Check the console for the JSON output.");
  }

  return (
    <div className="flex h-full w-full bg-background">
        <div className={`transition-all duration-300 ${isSidebarOpen ? 'w-80' : 'w-0'} h-full`}>
            {selectedNode ? (
                <ConfigSidebar
                    key={selectedNode.id}
                    node={selectedNode}
                    onConfigChange={handleConfigChange}
                    onClose={() => setSelectedNode(null)}
                />
            ) : (
                <NodeLibrarySidebar />
            )}
        </div>
        <div className="flex-grow h-full" ref={reactFlowWrapper}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                onInit={setReactFlowInstance}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onNodeClick={onNodeClick}
                onPaneClick={onPaneClick}
                onNodesDelete={onNodesDelete}
                fitView
            >
                <div className="absolute top-4 left-4 z-10 flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="bg-card">
                        <PanelLeft className="h-4 w-4" />
                    </Button>
                     <Button onClick={handleSave} className="bg-card text-card-foreground hover:bg-card/80">
                        <Save className="mr-2 h-4 w-4" /> Save
                    </Button>
                </div>
                <Controls />
                <MiniMap />
                <Background gap={16} />
            </ReactFlow>
        </div>
    </div>
  );
}
