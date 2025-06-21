"use client";

import { useEditor, EditorContent, Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import React from "react";
import Menubar from "./Menubar";

function RichTextEditor({ field }: { field: any }) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      Text,
      Heading,
      TextAlign.configure({
        types: ["heading", "paragraph", "bulletList", "orderedList"],
      }),
    ],
    editorProps: {
      attributes: {
        class:
          "min-h-[300px] dark:prose-invert  focus:outline-none  p-4 prose prose-sm:prose lg:prose-lg xl:prose-xl !w-full  !max-w-none",
      },
    },
    onUpdate: ({ editor }) => {
      field.onChange(JSON.stringify(editor.getJSON()));
    },
    content: field.value ? JSON.parse(field.value) : "",
  });
  return (
    <div className="border-input dark:bg-input/30 w-full overflow-hidden rounded-lg border">
      <Menubar editor={editor} />
      <EditorContent editor={editor as Editor} />
    </div>
  );
}

export default RichTextEditor;
