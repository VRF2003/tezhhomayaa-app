import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { Heading1, Heading2, Heading3, Quote, List, ListOrdered, Image as ImageIcon, Type, MessageSquareQuote } from 'lucide-react';

export const CommandList = forwardRef((props: any, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];
    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === 'ArrowUp') {
        upHandler();
        return true;
      }
      if (event.key === 'ArrowDown') {
        downHandler();
        return true;
      }
      if (event.key === 'Enter') {
        enterHandler();
        return true;
      }
      return false;
    },
  }));

  const getIcon = (title: string) => {
    switch (title) {
      case 'Heading 1': return <Heading1 size={14} />;
      case 'Heading 2': return <Heading2 size={14} />;
      case 'Heading 3': return <Heading3 size={14} />;
      case 'Bullet List': return <List size={14} />;
      case 'Numbered List': return <ListOrdered size={14} />;
      case 'Quote': return <Quote size={14} />;
      case 'Luxury Quote': return <MessageSquareQuote size={14} />;
      case 'Image': return <ImageIcon size={14} />;
      default: return <Type size={14} />;
    }
  };

  return (
    <div className="bg-white border border-[#e8e4df] shadow-lg rounded-md overflow-hidden min-w-[200px] flex flex-col py-1">
      {props.items.length > 0 ? (
        props.items.map((item: any, index: number) => (
          <button
            key={index}
            onClick={() => selectItem(index)}
            className={`flex items-center gap-2 px-3 py-2 text-sm text-left w-full transition-colors ${
              index === selectedIndex ? 'bg-[#fafaf8] text-black font-medium' : 'text-gray-600 hover:bg-[#fafaf8]'
            }`}
          >
            <span className="w-5 h-5 flex items-center justify-center opacity-70 border border-[#e8e4df] rounded bg-white">
              {getIcon(item.title)}
            </span>
            <span>{item.title}</span>
          </button>
        ))
      ) : (
        <div className="p-3 text-sm text-gray-500 text-center">No results</div>
      )}
    </div>
  );
});

CommandList.displayName = 'CommandList';
