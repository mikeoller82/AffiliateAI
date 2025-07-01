'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Filter, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DndContext, useDraggable, useDroppable, type DragEndEvent } from '@dnd-kit/core';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';

interface Lead {
    id: string;
    name: string;
    value: number;
    tags: string[];
    company: string;
}

type PipelineStage = 'newLeads' | 'contacted' | 'proposalSent' | 'won';

interface PipelineData {
    newLeads: Lead[];
    contacted: Lead[];
    proposalSent: Lead[];
    won: Lead[];
}

const initialPipelineData: PipelineData = {
    newLeads: [
        { id: 'lead-1', name: 'Acme Inc.', value: 5000, tags: ['Hot Lead', 'SaaS'], company: 'Acme Inc.' },
        { id: 'lead-2', name: 'Stark Industries', value: 12000, tags: ['Enterprise'], company: 'Stark Industries' },
    ],
    contacted: [
        { id: 'lead-3', name: 'Wayne Enterprises', value: 8000, tags: ['Follow Up'], company: 'Wayne Enterprises' },
    ],
    proposalSent: [
        { id: 'lead-4', name: 'Cyberdyne Systems', value: 25000, tags: ['High Value'], company: 'Cyberdyne Systems' },
    ],
    won: [
        { id: 'lead-5', name: 'Ollivanders Wand Shop', value: 1500, tags: ['SMB', 'Closed Won'], company: 'Ollivanders' },
    ]
};

function DraggableLeadCard({ lead }: { lead: Lead }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: lead.id,
        data: { lead },
    });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 100, // Ensure the dragged item is on top
    } : undefined;

    return (
        <Card ref={setNodeRef} style={style} className="mb-4 group bg-card touch-none">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm">{lead.name}</h4>
                    <div {...listeners} {...attributes} className="cursor-grab p-1">
                        <GripVertical className="h-5 w-5 text-muted-foreground group-hover:opacity-100 opacity-0 transition-opacity" />
                    </div>
                </div>
                <p className="text-xs text-muted-foreground">{lead.company}</p>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-primary">${lead.value.toLocaleString()}</span>
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://placehold.co/40x40.png`} data-ai-hint="profile avatar" />
                        <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="mt-3 flex gap-1 flex-wrap">
                    {lead.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

function DroppablePipelineColumn({ id, title, leads }: { id: string; title: string; leads: Lead[] }) {
    const { setNodeRef, isOver } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className={`bg-muted/50 rounded-lg p-4 flex flex-col ${isOver ? 'ring-2 ring-primary' : ''}`}>
            <h3 className="text-lg font-semibold tracking-tight mb-4">{title} ({leads.length})</h3>
            <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-4">
               {leads.length === 0 ? (
                   <div className="flex flex-col items-center justify-center h-full text-center py-12 border-2 border-dashed rounded-lg">
                       <p className="text-muted-foreground text-sm">Drag leads here</p>
                   </div>
               ) : (
                leads.map(lead => <DraggableLeadCard key={lead.id} lead={lead} />)
               )}
            </div>
        </div>
    );
}

export default function CrmPage() {
    const [pipelineData, setPipelineData] = useState<PipelineData>(initialPipelineData);
    const [isAddLeadOpen, setIsAddLeadOpen] = useState(false);
    const [newLead, setNewLead] = useState({ name: '', company: '', value: '', tags: '' });
    const { toast } = useToast();

    const handleDragEnd = (event: DragEndEvent) => {
        const { over, active } = event;

        if (over && active.id) {
            const activeLeadId = active.id;
            const targetStage = over.id as PipelineStage;

            // Find the lead and its current stage
            let sourceStage: PipelineStage | null = null;
            let movingLead: Lead | undefined;

            for (const stage in pipelineData) {
                const s = stage as PipelineStage;
                const lead = pipelineData[s].find(l => l.id === activeLeadId);
                if (lead) {
                    sourceStage = s;
                    movingLead = lead;
                    break;
                }
            }

            if (sourceStage && movingLead && sourceStage !== targetStage) {
                setPipelineData(prevData => {
                    const newData = { ...prevData };
                    // Remove from source
                    newData[sourceStage!] = prevData[sourceStage!].filter(l => l.id !== activeLeadId);
                    // Add to target
                    newData[targetStage].push(movingLead!);
                    return newData;
                });
            }
        }
    };
    
    const handleAddLead = () => {
        if (!newLead.name || !newLead.company || !newLead.value) {
            toast({ variant: 'destructive', title: 'Missing Fields', description: 'Please fill out Name, Company, and Value.' });
            return;
        }

        const lead: Lead = {
            id: nanoid(),
            name: newLead.name,
            company: newLead.company,
            value: Number(newLead.value),
            tags: newLead.tags.split(',').map(t => t.trim()).filter(t => t),
        };

        setPipelineData(prevData => ({
            ...prevData,
            newLeads: [lead, ...prevData.newLeads],
        }));
        
        setIsAddLeadOpen(false);
        setNewLead({ name: '', company: '', value: '', tags: '' });
        toast({ title: 'Lead Added', description: `${lead.name} has been added to the pipeline.` });
    };

    const pipelineColumns = [
        { id: 'newLeads', title: 'New Leads', data: pipelineData.newLeads },
        { id: 'contacted', title: 'Contacted', data: pipelineData.contacted },
        { id: 'proposalSent', title: 'Proposal Sent', data: pipelineData.proposalSent },
        { id: 'won', title: 'Won', data: pipelineData.won },
    ];

    return (
        <DndContext onDragEnd={handleDragEnd}>
            <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-4">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Lead Pipeline</h2>
                        <p className="text-muted-foreground">
                            Manage your sales process from lead to close.
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline">
                            <Filter className="mr-2 h-4 w-4" />
                            Filter
                        </Button>
                        <Dialog open={isAddLeadOpen} onOpenChange={setIsAddLeadOpen}>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    Add Lead
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Add New Lead</DialogTitle>
                                    <DialogDescription>Enter the details for the new lead below.</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                    <div className="space-y-2"><Label htmlFor="lead-name">Name</Label><Input id="lead-name" value={newLead.name} onChange={e => setNewLead({...newLead, name: e.target.value})} /></div>
                                    <div className="space-y-2"><Label htmlFor="lead-company">Company</Label><Input id="lead-company" value={newLead.company} onChange={e => setNewLead({...newLead, company: e.target.value})} /></div>
                                    <div className="space-y-2"><Label htmlFor="lead-value">Value ($)</Label><Input id="lead-value" type="number" value={newLead.value} onChange={e => setNewLead({...newLead, value: e.target.value})} /></div>
                                    <div className="space-y-2"><Label htmlFor="lead-tags">Tags (comma-separated)</Label><Input id="lead-tags" value={newLead.tags} onChange={e => setNewLead({...newLead, tags: e.target.value})} /></div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setIsAddLeadOpen(false)}>Cancel</Button>
                                    <Button onClick={handleAddLead}>Add Lead</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto">
                    {pipelineColumns.map(column => (
                        <DroppablePipelineColumn key={column.id} id={column.id} title={column.title} leads={column.data} />
                    ))}
                </div>
            </div>
        </DndContext>
    );
}
