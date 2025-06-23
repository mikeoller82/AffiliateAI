'use client';

import React, { useState, useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import type { Block } from './types';
import { EditorBlock } from './editor-block';
import { AiAssistDialog } from './ai-assist-dialog';
import { nanoid } from 'nanoid';
import { useToast } from '@/hooks/use-toast';
import type { JSONContent } from '@tiptap/react';

const initialBlocks: Block[] = [
  { id: '1', content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Welcome to NotionPad!' }] }] } },
  { id: '2', content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'This is a Notion-style block editor.' }] }] } },
  { id: '3', content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: "Drag the handles to reorder blocks, or use the hover menu to duplicate, delete, or use AI!" }] }] } },
];

export function NotionPad() {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [aiAssistState, setAiAssistState] = useState<{ isOpen: boolean; block: Block | null }>({
    isOpen: false,
    block: null,
  });
  const { toast } = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);
  
  const updateBlockContent = useCallback((id: string, content: any) => {
    setBlocks(currentBlocks => currentBlocks.map(b => b.id === id ? {...b, content} : b));
  }, []);
  
  const addBlock = useCallback(() => {
    const newBlock: Block = {
      id: nanoid(),
      content: {type: 'doc', content: [{type: 'paragraph'}]}
    };
    setBlocks(prev => [...prev, newBlock]);
  }, []);
  
  const deleteBlock = useCallback((id: string) => {
    setBlocks(prev => prev.filter(b => b.id !== id));
  }, []);

  const duplicateBlock = useCallback((id: string) => {
    setBlocks(prev => {
        const blockIndex = prev.findIndex(b => b.id === id);
        if (blockIndex === -1) return prev;
        const blockToDuplicate = prev[blockIndex];
        const newBlock: Block = {
            ...blockToDuplicate,
            id: nanoid(),
        };
        const newBlocks = [...prev];
        newBlocks.splice(blockIndex + 1, 0, newBlock);
        return newBlocks;
    });
  }, []);

  const openAiAssist = useCallback((id: string) => {
      const block = blocks.find(b => b.id === id);
      if (block) {
          setAiAssistState({ isOpen: true, block });
      }
  }, [blocks]);

  const handleReplaceContent = useCallback((newText: string) => {
      if (!aiAssistState.block) return;
      
      const newJsonContent: JSONContent = {
          type: 'doc',
          content: [{
              type: 'paragraph',
              content: [{ type: 'text', text: newText }]
          }]
      };

      updateBlockContent(aiAssistState.block.id, newJsonContent);
      setAiAssistState({ isOpen: false, block: null });
      toast({
          title: 'Content Replaced',
          description: 'The block content has been updated with the AI suggestion.',
      });
  }, [aiAssistState.block, updateBlockContent, toast]);

  return (
    <>
      <div className="w-full max-w-4xl mx-auto p-4 rounded-lg bg-card text-card-foreground shadow-md">
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {blocks.map(block => (
                <EditorBlock
                    key={block.id}
                    block={block}
                    updateContent={updateBlockContent}
                    deleteBlock={deleteBlock}
                    duplicateBlock={duplicateBlock}
                    openAiAssist={openAiAssist}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        <div className="mt-4 border-t pt-4">
          <Button variant="outline" onClick={addBlock}>
              <Plus className="mr-2 h-4 w-4"/>
              Add Block
          </Button>
        </div>
      </div>
      {aiAssistState.isOpen && aiAssistState.block && (
        <AiAssistDialog
            isOpen={aiAssistState.isOpen}
            onOpenChange={(isOpen) => setAiAssistState({ isOpen, block: isOpen ? aiAssistState.block : null })}
            content={aiAssistState.block.content}
            onReplaceContent={handleReplaceContent}
        />
      )}
    </>
  );
}
