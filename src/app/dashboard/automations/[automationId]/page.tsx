
'use client';

import { FlowBuilder } from "@/components/automations/flow-builder";
import { useParams } from "next/navigation";
import { getTemplateById } from "@/lib/automation-templates";

export default function AutomationEditorPage() {
    const params = useParams<{ automationId: string }>();
    const template = getTemplateById(params.automationId);
    
    return <FlowBuilder initialNodes={template.nodes} initialEdges={template.edges} />;
}
