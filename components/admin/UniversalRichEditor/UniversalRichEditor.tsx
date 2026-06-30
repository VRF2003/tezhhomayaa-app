"use client";

import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { Toolbar } from "./Toolbar";
import { LuxuryQuote } from "./extensions/LuxuryQuote";
import SlashCommand, { getSuggestionItems, renderItems } from "./extensions/SlashCommand";

interface UniversalRichEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

export function UniversalRichEditor({ value, onChange, placeholder, className = "" }: UniversalRichEditorProps) {
  // Use a ref to prevent onChange loops if value prop changes from external source while typing
  const isUpdatingRef = useRef(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-gold-400 underline decoration-gold-400/30 underline-offset-4 hover:decoration-gold-400 transition-colors',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'rounded-xl border border-gray-200 my-4 max-w-full',
        },
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'w-full border-collapse border border-gray-200 my-4',
        },
      }),
      TableRow,
      TableHeader.configure({
        HTMLAttributes: {
          class: 'border border-gray-200 bg-gray-50 p-3 text-left font-semibold text-[#1a1a18]',
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          class: 'border border-gray-200 p-3 text-[#1a1a18]',
        },
      }),
      LuxuryQuote,
      Placeholder.configure({
        placeholder: placeholder || "Type '/' to insert a block or start writing...",
        emptyEditorClass: 'is-editor-empty before:content-[attr(data-placeholder)] before:text-gray-400 before:float-left before:pointer-events-none before:h-0',
      }),
      SlashCommand.configure({
        suggestion: {
          items: getSuggestionItems,
          render: renderItems,
        },
      }),
    ],
    content: value || "",
    editorProps: {
      attributes: {
        class: 'prose prose-sm md:prose-base focus:outline-none min-h-[250px] p-4 text-[#1a1a18] prose-headings:font-light prose-p:leading-relaxed max-w-none',
      },
    },
    onUpdate: ({ editor }) => {
      isUpdatingRef.current = true;
      const html = editor.getHTML();
      // Prevent saving an empty paragraph tag if the editor is virtually empty
      const cleanHtml = (html === "<p></p>" || html === "") ? "" : html;
      onChange(cleanHtml);
      setTimeout(() => {
        isUpdatingRef.current = false;
      }, 0);
    },
  });

  // Sync external value changes (e.g., when switching sections in LivePreviewBuilder)
  useEffect(() => {
    if (editor && value !== undefined && !isUpdatingRef.current) {
      // Check if content actually differs to avoid resetting cursor
      if (editor.getHTML() !== value) {
        editor.commands.setContent(value);
      }
    }
  }, [value, editor]);

  return (
    <div className={`flex flex-col border border-[#ccc9c4] rounded bg-white shadow-sm overflow-hidden ${className}`}>
      <Toolbar editor={editor} />
      <div className="flex-1 cursor-text" onClick={() => editor?.commands.focus()}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
