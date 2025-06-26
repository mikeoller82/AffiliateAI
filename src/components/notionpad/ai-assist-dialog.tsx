
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Wand2, Sparkles, Languages, Pilcrow } from 'lucide-react';
import { editText, type EditTextInput } from '@/ai/flows/edit-text';
import { useToast } from '@/hooks/use-toast';
import type { JSONContent } from '@tiptap/react';
import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import { useAIKey } from '@/contexts/ai-key-context';

interface AiAssistDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  content: JSONContent;
  onReplaceContent: (newContent: string) => void;
}

const TIPTAP_EXTENSIONS = [
    StarterKit,
    Link.configure({
        // Tiptap Link config if needed
    }),
];


const presetInstructions = [
    { label: 'Fix Spelling & Grammar', instruction: 'Fix any spelling mistakes and correct the grammar.', icon: <Languages className="mr-2 h-4 w-4" /> },
    { label: 'Summarize', instruction: 'Summarize the following text in a few key points.', icon: <Pilcrow className="mr-2 h-4 w-4" /> },
    { label: 'Make it Punchier', instruction: 'Rewrite this to be more engaging and punchy for a marketing audience.', icon: <Sparkles className="mr-2 h-4 w-4" /> },
];

export function AiAssistDialog({ isOpen, onOpenChange, content, onReplaceContent }: AiAssistDialogProps) {
  const [customInstruction, setCustomInstruction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const { toast } = useToast();
  const { apiKey, promptApiKey } = useAIKey();

  const plainText = useMemo(() => {
    if (typeof window === 'undefined' || !content) return '';
    // Generate HTML from TipTap's JSON, then strip tags to get plain text
    const html = generateHTML(content, TIPTAP_EXTENSIONS);
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || '';
  }, [content]);


  const handleGenerate = async (instruction: string) => {
    if (!apiKey) {
        promptApiKey();
        return;
    }
    if (!instruction) {
        toast({
            variant: 'destructive',
            title: 'Instruction Required',
            description: 'Please provide an instruction for the AI.',
        });
        return;
    }
    if (!plainText) {
        toast({
            variant: 'destructive',
            title: 'No Content',
            description: 'There is no text in the block to edit.',
        });
        return;
    }

    setIsLoading(true);
    setResult('');
    try {
      const input: EditTextInput = {
        text: plainText,
        instruction,
      };
      const response = await editText(input);
      setResult(response.editedText);
    } catch (error) {
      console.error(error);
      toast({
        variant: 'destructive',
        title: 'AI Generation Failed',
        description: 'An error occurred. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseResult = () => {
    onReplaceContent(result);
  };
  
  const handleClose = () => {
    onOpenChange(false);
    // Reset state after a short delay to allow dialog to close
    setTimeout(() => {
        setCustomInstruction('');
        setResult('');
        setIsLoading(false);
    }, 300);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Assistant</DialogTitle>
          <DialogDescription>
            Use AI to improve or generate content for this block.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
            <div className="space-y-2">
                <Label>Original Content</Label>
                <div className="p-3 rounded-md border bg-muted/50 text-sm max-h-40 overflow-y-auto">
                    <p className="whitespace-pre-wrap">{plainText || 'No text content in this block.'}</p>
                </div>
            </div>
            
            <div className="space-y-2">
                <Label>Quick Actions</Label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {presetInstructions.map(preset => (
                        <Button key={preset.label} variant="outline" onClick={() => handleGenerate(preset.instruction)} disabled={isLoading}>
                            {preset.icon}
                            {preset.label}
                        </Button>
                    ))}
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="custom-instruction">Or, write a custom instruction</Label>
                 <Textarea
                    id="custom-instruction"
                    placeholder="e.g., 'Translate this to Spanish' or 'Turn this into a bulleted list.'"
                    value={customInstruction}
                    onChange={(e) => setCustomInstruction(e.target.value)}
                />
                <Button onClick={() => handleGenerate(customInstruction)} disabled={isLoading}>
                    {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Wand2 className="mr-2 h-4 w-4" />}
                    Generate
                </Button>
            </div>

            {(isLoading || result) && (
                <div className="space-y-2 pt-4">
                <Label>Generated Result</Label>
                <div className="p-4 rounded-md border bg-background min-h-[120px]">
                    {isLoading && <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /><span>Generating...</span></div>}
                    {result && <p className="whitespace-pre-wrap">{result}</p>}
                </div>
                {result && <Button onClick={handleUseResult}>Use this text</Button>}
            </div>
            )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
