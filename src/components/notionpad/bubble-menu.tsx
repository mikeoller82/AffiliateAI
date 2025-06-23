'use client';
import { BubbleMenu, type BubbleMenuProps } from '@tiptap/react';
import { Bold, Italic, Link as LinkIcon } from 'lucide-react';
import type { Editor } from '@tiptap/core';
import { Button } from '@/components/ui/button';
import { useCallback } from 'react';

type EditorBubbleMenuProps = Omit<BubbleMenuProps, 'children'> & {
    editor: Editor;
};

export const EditorBubbleMenu = ({ editor, ...props }: EditorBubbleMenuProps) => {
  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  }, [editor]);

  if (!editor) return null;

  return (
    <BubbleMenu
      editor={editor}
      tippyOptions={{ duration: 100 }}
      className="flex gap-1 bg-card border shadow-lg rounded-md p-1"
      {...props}
    >
      <Button
        size="icon"
        variant={editor.isActive('bold') ? 'secondary' : 'ghost'}
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive('italic') ? 'secondary' : 'ghost'}
        className="h-8 w-8"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>
      <Button
        size="icon"
        variant={editor.isActive('link') ? 'secondary' : 'ghost'}
        className="h-8 w-8"
        onClick={setLink}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </BubbleMenu>
  );
};
