"use client";

import React, { useState, useEffect } from "react";
import { CommandRegistry } from "../registry/CommandRegistry";

export function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  if (!isOpen) return null;

  const results = CommandRegistry.search(query);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[15vh] sm:pt-[20vh]">
      <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsOpen(false)} />
      
      <div className="relative w-full max-w-2xl transform divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden rounded-2xl bg-white dark:bg-gray-900 shadow-2xl ring-1 ring-black/5 transition-all">
        <div className="flex items-center px-4 py-3">
          <span className="text-gray-400">🔍</span>
          <input
            type="text"
            className="h-12 w-full bg-transparent px-4 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-0 sm:text-lg"
            placeholder="Search commands, pages, or entities..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>

        {results.length > 0 && (
          <ul className="max-h-96 overflow-y-auto p-2">
            {results.map((cmd) => (
              <li
                key={cmd.id}
                onClick={() => {
                  cmd.onSelect();
                  setIsOpen(false);
                }}
                className="group flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {cmd.icon && <span className="text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300">{cmd.icon}</span>}
                <div className="flex-auto">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{cmd.title}</p>
                  {cmd.subtitle && <p className="text-xs text-gray-500">{cmd.subtitle}</p>}
                </div>
              </li>
            ))}
          </ul>
        )}

        {query && results.length === 0 && (
          <div className="px-6 py-14 text-center text-sm sm:px-14">
            <p className="text-gray-500">No results found for <span className="font-semibold">"{query}"</span>.</p>
          </div>
        )}
      </div>
    </div>
  );
}
