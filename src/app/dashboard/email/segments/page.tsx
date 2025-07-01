
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { PlusCircle, Users, Filter, X, FolderKanban } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

interface Rule {
    field: string;
    operator: string;
    value: string;
}

interface RuleGroup {
    logic: 'AND' | 'OR';
    rules: Rule[];
}

interface Segment {
    id: number;
    name: string;
    description: string;
    count: number;
    rules: RuleGroup[];
}

const fieldOptions = ["Tag", "Date Added", "Email Address", "Last Email Open", "Last Click"];
const operatorOptions: Record<string, string[]> = {
    Tag: ["is", "is not", "contains", "does not contain"],
    "Date Added": ["is on", "is before", "is after", "is within the last"],
    "Email Address": ["contains", "does not contain", "ends with"],
    "Last Email Open": ["is within the last", "is not within the last"],
    "Last Click": ["is within the last", "is not within the last"],
};

const initialSegments: Segment[] = [
    {
        id: 1,
        name: "Active Subscribers",
        description: "Contacts who have opened an email in the last 30 days.",
        count: 1204,
        rules: [{ logic: 'AND', rules: [{ field: "Last Email Open", operator: "is within the last", value: "30 days" }] }]
    },
    {
        id: 2,
        name: "Potential Customers",
        description: "Hot leads who have not yet purchased.",
        count: 89,
        rules: [{ logic: 'AND', rules: [{ field: "Tag", operator: "is", value: "Hot Lead" }, { field: "Tag", operator: "is not", value: "Customer" }] }]
    },
    {
        id: 3,
        name: "Pro Plan Users",
        description: "All contacts who are on the Pro subscription plan.",
        count: 432,
        rules: [{ logic: 'AND', rules: [{ field: "Tag", operator: "is", value: "Pro Plan" }] }]
    },
];

export default function SegmentsPage() {
    const { toast } = useToast();
    const [segments, setSegments] = useState<Segment[]>(initialSegments);
    const [isRuleEditorOpen, setIsRuleEditorOpen] = useState(false);
    const [selectedSegment, setSelectedSegment] = useState<Segment | null>(null);
    
    const handleAction = (action: string) => {
        toast({
            title: "Action Triggered",
            description: `The "${action}" action is not yet implemented.`,
        });
    };

    const handleEditRulesClick = (segment: Segment) => {
        setSelectedSegment(JSON.parse(JSON.stringify(segment)));
        setIsRuleEditorOpen(true);
    };

    const handleSaveRules = () => {
        toast({
            title: "Rules Saved",
            description: `The rules for "${selectedSegment?.name}" have been updated.`
        });
        setIsRuleEditorOpen(false);
        setSelectedSegment(null);
    }

    const RuleEditor = () => {
        if (!selectedSegment) return null;

        return (
            <div className="space-y-4">
                {selectedSegment.rules.map((group, groupIndex) => (
                    <div key={groupIndex} className="p-4 border rounded-lg bg-muted/50 space-y-4">
                        {group.rules.map((rule, ruleIndex) => (
                             <div key={ruleIndex} className="space-y-4">
                                {ruleIndex > 0 && (
                                    <div className="flex items-center gap-2">
                                        <Separator className="flex-1"/>
                                        <span className="text-xs font-semibold text-muted-foreground">{group.logic}</span>
                                        <Separator className="flex-1"/>
                                    </div>
                                )}
                                <div className="flex flex-col sm:flex-row gap-2 items-center">
                                    <Select defaultValue={rule.field}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {fieldOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                     <Select defaultValue={rule.operator}>
                                        <SelectTrigger><SelectValue/></SelectTrigger>
                                        <SelectContent>
                                            {(operatorOptions[rule.field as keyof typeof operatorOptions] || []).map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <Input defaultValue={rule.value} placeholder="Value"/>
                                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive flex-shrink-0">
                                        <X className="h-4 w-4"/>
                                    </Button>
                                </div>
                             </div>
                        ))}
                        <Button variant="outline" size="sm" className="w-full">
                            <PlusCircle className="mr-2 h-4 w-4"/>
                            Add Condition
                        </Button>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Segments</h2>
                        <p className="text-muted-foreground">
                            Create dynamic groups of contacts based on rules and filters.
                        </p>
                    </div>
                    <Button onClick={() => handleAction('Create Segment')}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Create Segment
                    </Button>
                </div>
                {segments.length === 0 ? (
                    <Card className="flex flex-col items-center justify-center border-dashed min-h-[400px]">
                        <div className="text-center">
                            <FolderKanban className="h-12 w-12 mx-auto text-muted-foreground" />
                            <h3 className="mt-4 text-lg font-semibold">No Segments Found</h3>
                            <p className="mt-1 text-sm text-muted-foreground">Group your contacts with powerful filtering.</p>
                            <Button className="mt-4" onClick={() => handleAction('Create Segment')}>
                                <PlusCircle className="mr-2 h-4 w-4" />
                                Create Segment
                            </Button>
                        </div>
                    </Card>
                ) : (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {segments.map(segment => (
                            <Card key={segment.id} className="flex flex-col">
                                <CardHeader>
                                    <CardTitle>{segment.name}</CardTitle>
                                    <CardDescription className="h-10">{segment.description}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="flex items-center gap-2 text-2xl font-bold">
                                        <Users className="h-6 w-6 text-muted-foreground"/>
                                        {segment.count.toLocaleString()}
                                    </div>
                                    <p className="text-xs text-muted-foreground">Contacts in segment</p>
                                </CardContent>
                                <CardFooter className="mt-auto">
                                    <Button variant="outline" className="w-full" onClick={() => handleEditRulesClick(segment)}>
                                        <Filter className="mr-2 h-4 w-4" />
                                        View & Edit Rules
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            
            <Dialog open={isRuleEditorOpen} onOpenChange={setIsRuleEditorOpen}>
                <DialogContent className="sm:max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>Edit Rules for "{selectedSegment?.name}"</DialogTitle>
                        <DialogDescription>
                            Define the conditions a contact must meet to be included in this segment.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4 max-h-[60vh] overflow-y-auto pr-4">
                        <RuleEditor />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsRuleEditorOpen(false)}>Cancel</Button>
                        <Button onClick={handleSaveRules}>Save Rules</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}
