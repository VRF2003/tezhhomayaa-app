"use client";

import React, { useState, useRef, useEffect } from "react";
import { type Editor } from "@tiptap/react";
import { 
  Bold, Italic, Underline, Strikethrough, 
  AlignLeft, AlignCenter, AlignRight,
  List, ListOrdered, Quote, Heading1, Heading2, Heading3,
  Undo, Redo, Image as ImageIcon, MessageSquareQuote,
  Type, Layout, MoreHorizontal, Table as TableIcon, Check
} from "lucide-react";

interface ToolbarProps {
  editor: Editor | null;
}

function Dropdown({ icon, label, children, isActive, className = "" }: { icon?: React.ReactNode, label?: string, children: React.ReactNode, isActive?: boolean, className?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button 
        type="button"
        onClick={() => setOpen(!open)} 
        className={`flex items-center gap-1.5 p-1.5 px-2.5 rounded transition-colors text-xs uppercase tracking-widest ${isActive ? "bg-white text-black shadow-sm" : "text-gray-500 hover:bg-white hover:text-black"} ${className}`}
      >
        {icon}
        {label && <span>{label}</span>}
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-[#e8e4df] shadow-md rounded p-1 min-w-[180px] z-50 flex flex-col gap-0.5" onClick={() => setOpen(false)}>
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ icon, label, isActive, onClick }: { icon?: React.ReactNode, label: string, isActive?: boolean, onClick: () => void }) {
  return (
    <button 
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 w-full text-left p-1.5 px-2 rounded text-xs transition-colors ${isActive ? "bg-[#fafaf8] text-black font-medium" : "text-gray-600 hover:bg-[#fafaf8] hover:text-black"}`}
    >
      <span className="w-4 h-4 flex items-center justify-center opacity-70">{icon}</span>
      <span className="flex-1">{label}</span>
      {isActive && <Check size={14} className="opacity-50" />}
    </button>
  );
}

export function Toolbar({ editor }: ToolbarProps) {
  if (!editor) return null;

  const activeTextType = () => {
    if (editor.isActive("heading", { level: 1 })) return "Heading 1";
    if (editor.isActive("heading", { level: 2 })) return "Heading 2";
    if (editor.isActive("heading", { level: 3 })) return "Heading 3";
    if (editor.isActive("luxuryQuote")) return "Luxury Quote";
    if (editor.isActive("blockquote")) return "Quote";
    return "Paragraph";
  };

  return (
    <div className="flex flex-wrap items-center gap-1 p-1.5 bg-[#fafaf8] border-b border-[#ccc9c4] sticky top-0 z-10">
      
      {/* ── Text Type Dropdown ── */}
      <Dropdown 
        icon={<Type size={14} />} 
        label={activeTextType()} 
        isActive={editor.isActive("heading") || editor.isActive("blockquote") || editor.isActive("luxuryQuote")}
      >
        <DropdownItem 
          label="Paragraph" 
          isActive={!editor.isActive("heading") && !editor.isActive("blockquote") && !editor.isActive("luxuryQuote")}
          onClick={() => editor.chain().focus().setParagraph().run()} 
        />
        <div className="h-px bg-[#e8e4df] my-1 mx-1" />
        <DropdownItem 
          icon={<Heading1 size={14} />} 
          label="Heading 1" 
          isActive={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} 
        />
        <DropdownItem 
          icon={<Heading2 size={14} />} 
          label="Heading 2" 
          isActive={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} 
        />
        <DropdownItem 
          icon={<Heading3 size={14} />} 
          label="Heading 3" 
          isActive={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} 
        />
        <div className="h-px bg-[#e8e4df] my-1 mx-1" />
        <DropdownItem 
          icon={<MessageSquareQuote size={14} />} 
          label="Luxury Quote" 
          isActive={editor.isActive("luxuryQuote")}
          onClick={() => editor.chain().focus().toggleLuxuryQuote().run()} 
        />
        <DropdownItem 
          icon={<Quote size={14} />} 
          label="Blockquote" 
          isActive={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()} 
        />
      </Dropdown>

      <div className="w-px h-4 bg-[#e8e4df] mx-1" />

      {/* ── Basic Formatting (Inline) ── */}
      <div className="flex items-center gap-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive("bold") ? "bg-white shadow-sm text-black" : "text-gray-500 hover:bg-white hover:text-black"}`}
          title="Bold"
        >
          <Bold size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive("italic") ? "bg-white shadow-sm text-black" : "text-gray-500 hover:bg-white hover:text-black"}`}
          title="Italic"
        >
          <Italic size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive("underline") ? "bg-white shadow-sm text-black" : "text-gray-500 hover:bg-white hover:text-black"}`}
          title="Underline"
        >
          <Underline size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded transition-colors ${editor.isActive("strike") ? "bg-white shadow-sm text-black" : "text-gray-500 hover:bg-white hover:text-black"}`}
          title="Strikethrough"
        >
          <Strikethrough size={14} />
        </button>
      </div>

      <div className="w-px h-4 bg-[#e8e4df] mx-1" />

      {/* ── Alignment Dropdown ── */}
      <Dropdown 
        icon={<AlignLeft size={14} />} 
        isActive={editor.isActive({ textAlign: 'center' }) || editor.isActive({ textAlign: 'right' })}
      >
        <DropdownItem 
          icon={<AlignLeft size={14} />} 
          label="Align Left" 
          isActive={editor.isActive({ textAlign: 'left' })}
          onClick={() => editor.chain().focus().setTextAlign('left').run()} 
        />
        <DropdownItem 
          icon={<AlignCenter size={14} />} 
          label="Align Center" 
          isActive={editor.isActive({ textAlign: 'center' })}
          onClick={() => editor.chain().focus().setTextAlign('center').run()} 
        />
        <DropdownItem 
          icon={<AlignRight size={14} />} 
          label="Align Right" 
          isActive={editor.isActive({ textAlign: 'right' })}
          onClick={() => editor.chain().focus().setTextAlign('right').run()} 
        />
      </Dropdown>

      {/* ── Lists Dropdown ── */}
      <Dropdown 
        icon={<List size={14} />} 
        isActive={editor.isActive("bulletList") || editor.isActive("orderedList")}
      >
        <DropdownItem 
          icon={<List size={14} />} 
          label="Bullet List" 
          isActive={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()} 
        />
        <DropdownItem 
          icon={<ListOrdered size={14} />} 
          label="Numbered List" 
          isActive={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()} 
        />
      </Dropdown>

      {/* ── Insert Dropdown ── */}
      <Dropdown icon={<MoreHorizontal size={14} />} label="Insert">
        <DropdownItem 
          icon={<ImageIcon size={14} />} 
          label="Image" 
          onClick={() => {
            const url = window.prompt("Image URL");
            if (url) editor.chain().focus().setImage({ src: url }).run();
          }} 
        />
        <DropdownItem 
          icon={<TableIcon size={14} />} 
          label="Table" 
          onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} 
        />
      </Dropdown>

      {/* ── Table Tools Dropdown (Conditional) ── */}
      {editor.isActive("table") && (
        <>
          <div className="w-px h-4 bg-[#e8e4df] mx-1" />
          <Dropdown icon={<TableIcon size={14} />} label="Table Tools">
            <DropdownItem label="Add Column Before" onClick={() => editor.chain().focus().addColumnBefore().run()} />
            <DropdownItem label="Add Column After" onClick={() => editor.chain().focus().addColumnAfter().run()} />
            <DropdownItem label="Delete Column" onClick={() => editor.chain().focus().deleteColumn().run()} />
            <div className="h-px bg-[#e8e4df] my-1 mx-1" />
            <DropdownItem label="Add Row Before" onClick={() => editor.chain().focus().addRowBefore().run()} />
            <DropdownItem label="Add Row After" onClick={() => editor.chain().focus().addRowAfter().run()} />
            <DropdownItem label="Delete Row" onClick={() => editor.chain().focus().deleteRow().run()} />
            <div className="h-px bg-[#e8e4df] my-1 mx-1" />
            <DropdownItem label="Delete Table" onClick={() => editor.chain().focus().deleteTable().run()} />
          </Dropdown>
        </>
      )}

      <div className="flex flex-1 items-center justify-end gap-0.5">
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().undo()}
          className="p-1.5 rounded transition-colors text-gray-500 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
          title="Undo"
        >
          <Undo size={14} />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().redo()}
          className="p-1.5 rounded transition-colors text-gray-500 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
          title="Redo"
        >
          <Redo size={14} />
        </button>
      </div>
    </div>
  );
}
