
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Filter, GripVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const pipelineData = {
    newLeads: [
        { id: 'lead-1', name: 'Alice Johnson', value: 2500, tags: ['Hot Lead'], company: 'Innovate Corp' },
        { id: 'lead-2', name: 'Bob Williams', value: 1000, tags: ['Website'], company: 'Solutions Inc.' },
    ],
    contacted: [
        { id: 'lead-3', name: 'Charlie Brown', value: 8000, tags: ['Follow-up'], company: 'Tech Giant' },
    ],
    proposalSent: [
        { id: 'lead-4', name: 'Diana Miller', value: 5000, tags: ['Negotiating'], company: 'Marketing Pro' },
        { id: 'lead-5', name: 'Ethan Davis', value: 12000, tags: [], company: 'Synergy LLC' },
    ],
    won: [
        { id: 'lead-6', name: 'Fiona Garcia', value: 7500, tags: ['Closed'], company: 'Creative Co.' },
    ]
};

const pipelineColumns = [
    { id: 'newLeads', title: 'New Leads', data: pipelineData.newLeads },
    { id: 'contacted', title: 'Contacted', data: pipelineData.contacted },
    { id: 'proposalSent', title: 'Proposal Sent', data: pipelineData.proposalSent },
    { id: 'won', title: 'Won', data: pipelineData.won },
];

function LeadCard({ lead }: { lead: any }) {
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
                           {column.data.map(lead => <LeadCard key={lead.id} lead={lead} />)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
