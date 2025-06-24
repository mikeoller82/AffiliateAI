
'use client';

import React from 'react';
import { useEditor, EditorContent, type JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';

interface DocViewerProps {
  content: JSONContent;
}

export function DocViewer({ content }: DocViewerProps) {
  const editor = useEditor({
    editable: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: true,
        autolink: true,
        HTMLAttributes: {
          class: 'text-primary underline hover:text-primary/90',
        },
      }),
    ],
    content: content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none',
      },
    },
  });

  return (
    <div className="w-full max-w-4xl mx-auto p-8 rounded-lg bg-card text-card-foreground shadow-md">
        <EditorContent editor={editor} />
    </div>
  );
}
