'use client';

import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Copy, Wand2 } from 'lucide-react';
import type { Block } from './types';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EditorBubbleMenu } from './bubble-menu';

interface EditorBlockProps {
  block: Block;
  updateContent: (id: string, content: any) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  openAiAssist: (id: string) => void;
}

export function EditorBlock({ block, updateContent, deleteBlock, duplicateBlock, openAiAssist }: EditorBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        HTMLAttributes: {
            class: 'text-primary underline hover:text-primary/90',
        },
      }),
      Placeholder.configure({
        placeholder: "Type '/' for commands, or just start writing...",
      }),
    ],
    content: block.content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      updateContent(block.id, editor.getJSON());
    },
  });

  return (
    <div ref={setNodeRef} style={style} className={cn('relative group flex items-start gap-2 py-1', isDragging && 'z-10')}>
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 cursor-grab"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex-1 relative">
        {editor && <EditorBubbleMenu editor={editor} />}
        <EditorContent editor={editor} />
      </div>
       <div className="absolute right-0 top-0.5 flex items-center gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => openAiAssist(block.id)} title="AI Assist">
              <Wand2 className="h-4 w-4 text-muted-foreground hover:text-primary"/>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => duplicateBlock(block.id)} title="Duplicate">
              <Copy className="h-4 w-4 text-muted-foreground hover:text-primary"/>
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => deleteBlock(block.id)} title="Delete">
            <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive"/>
          </Button>
      </div>
    </div>
  );
}
