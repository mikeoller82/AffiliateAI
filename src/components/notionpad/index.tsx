'use client';

import React, { useState, useCallback } from 'react';
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
import { nanoid } from 'nanoid';

const initialBlocks: Block[] = [
  { id: '1', content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Welcome to NotionPad!' }] }] } },
  { id: '2', content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'This is a Notion-style block editor.' }] }] } },
  { id: '3', content: { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: "Drag the handles to reorder blocks." }] }] } },
];

export function NotionPad() {
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);

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

  return (
    <div className="w-full max-w-4xl mx-auto p-4 rounded-lg bg-card text-card-foreground shadow-md">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={blocks} strategy={verticalListSortingStrategy}>
          <div className="space-y-1">
            {blocks.map(block => (
              <EditorBlock key={block.id} block={block} updateContent={updateBlockContent} deleteBlock={deleteBlock} />
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
  );
}
