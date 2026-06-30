import { Node, mergeAttributes } from '@tiptap/core';

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    luxuryQuote: {
      setLuxuryQuote: () => ReturnType,
      toggleLuxuryQuote: () => ReturnType,
    }
  }
}

export const LuxuryQuote = Node.create({
  name: 'luxuryQuote',

  group: 'block',

  content: 'inline*',

  defining: true,

  parseHTML() {
    return [
      { tag: 'blockquote[data-type="luxury-quote"]' },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'blockquote', 
      mergeAttributes(HTMLAttributes, { 
        'data-type': 'luxury-quote',
        class: 'relative my-8 border-l-2 border-gold-400/50 pl-6 py-2 before:content-[""] before:absolute before:-left-[1px] before:top-0 before:w-[2px] before:h-1/3 before:bg-gold-400 italic text-xl text-zinc-300 font-serif leading-relaxed'
      }), 
      0
    ]
  },

  addCommands() {
    return {
      setLuxuryQuote: () => ({ commands }) => {
        return commands.setNode(this.name)
      },
      toggleLuxuryQuote: () => ({ commands }) => {
        return commands.toggleNode(this.name, 'paragraph')
      },
    }
  },
});
