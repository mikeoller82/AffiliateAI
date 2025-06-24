
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Filter, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Lead {
    id: string;
    name: string;
    value: number;
    tags: string[];
    company: string;
}

interface PipelineData {
    newLeads: Lead[];
    contacted: Lead[];
    proposalSent: Lead[];
    won: Lead[];
}

const initialPipelineData: PipelineData = {
    newLeads: [],
    contacted: [],
    proposalSent: [],
    won: []
};

function LeadCard({ lead }: { lead: Lead }) {
    return (
        <Card className="mb-4 group">
            <CardContent className="p-4">
                <div className="flex justify-between items-start">
                    <h4 className="font-semibold text-sm">{lead.name}</h4>
                    <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab group-hover:opacity-100 opacity-0 transition-opacity" />
                </div>
                <p className="text-xs text-muted-foreground">{lead.company}</p>
                <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-primary">${lead.value.toLocaleString()}</span>
                    <Avatar className="h-6 w-6">
                        <AvatarImage src={`https://placehold.co/40x40`} data-ai-hint="profile avatar" />
                        <AvatarFallback>{lead.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                </div>
                <div className="mt-3 flex gap-1">
                    {lead.tags.map((tag: string) => (
                        <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}

export default function CrmPage() {
    const [pipelineData, setPipelineData] = useState<PipelineData>(initialPipelineData);

    const pipelineColumns = [
        { id: 'newLeads', title: 'New Leads', data: pipelineData.newLeads },
        { id: 'contacted', title: 'Contacted', data: pipelineData.contacted },
        { id: 'proposalSent', title: 'Proposal Sent', data: pipelineData.proposalSent },
        { id: 'won', title: 'Won', data: pipelineData.won },
    ];

    return (
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
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Add Lead
                    </Button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 overflow-x-auto">
                {pipelineColumns.map(column => (
                    <div key={column.id} className="bg-muted/50 rounded-lg p-4 flex flex-col">
                        <h3 className="text-lg font-semibold tracking-tight mb-4">{column.title} ({column.data.length})</h3>
                        <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                           {column.data.length === 0 ? (
                               <div className="flex flex-col items-center justify-center h-full text-center py-12 border-2 border-dashed rounded-lg">
                                   <p className="text-muted-foreground text-sm">Drag leads here</p>
                               </div>
                           ) : (
                            column.data.map(lead => <LeadCard key={lead.id} lead={lead} />)
                           )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
