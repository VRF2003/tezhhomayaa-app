"use client";

import React, { createContext, useContext, useState, useCallback, useMemo } from "react";
import { v4 as uuidv4 } from "uuid";

export type DeviceMode = "desktop" | "laptop" | "tablet" | "mobile";

interface HistoryState {
  sections: any[];
}

interface CanvasContextType {
  // Data
  sections: any[];
  setSections: (sections: any[]) => void;
  
  // Selection & Hover
  selectedId: string | null;
  setSelectedId: (id: string | null) => void;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  
  // Viewport
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
  
  // History
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  saveHistory: (newSections: any[]) => void;
  
  // Clipboard
  clipboard: any | null;
  copyBlock: (id: string) => void;
  pasteBlock: (index?: number) => void;
  
  // Block Actions
  updateBlock: (id: string, updates: any) => void;
  deleteBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
}

const CanvasContext = createContext<CanvasContextType | undefined>(undefined);

export function CanvasProvider({ children, initialSections = [] }: { children: React.ReactNode, initialSections?: any[] }) {
  const [sections, setSectionsState] = useState<any[]>(initialSections);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("desktop");
  const [zoom, setZoom] = useState<number>(100);
  const [clipboard, setClipboard] = useState<any | null>(null);

  // History Stack
  const [history, setHistory] = useState<HistoryState[]>([{ sections: initialSections }]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const saveHistory = useCallback((newSections: any[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ sections: JSON.parse(JSON.stringify(newSections)) }); // deep copy
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setSectionsState(newSections);
  }, [history, historyIndex]);

  const undo = useCallback(() => {
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      setHistoryIndex(prevIndex);
      setSectionsState(history[prevIndex].sections);
    }
  }, [history, historyIndex]);

  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setSectionsState(history[nextIndex].sections);
    }
  }, [history, historyIndex]);

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  // Block Actions
  const updateBlock = useCallback((id: string, updates: any) => {
    const newSections = sections.map(s => s.id === id ? { ...s, ...updates } : s);
    saveHistory(newSections);
  }, [sections, saveHistory]);

  const deleteBlock = useCallback((id: string) => {
    const newSections = sections.filter(s => s.id !== id);
    if (selectedId === id) setSelectedId(null);
    saveHistory(newSections);
  }, [sections, selectedId, saveHistory]);

  const copyBlock = useCallback((id: string) => {
    const block = sections.find(s => s.id === id);
    if (block) setClipboard(JSON.parse(JSON.stringify(block)));
  }, [sections]);

  const pasteBlock = useCallback((index?: number) => {
    if (!clipboard) return;
    const newBlock = { ...clipboard, id: uuidv4() };
    const newSections = [...sections];
    if (index !== undefined) {
      newSections.splice(index, 0, newBlock);
    } else {
      newSections.push(newBlock);
    }
    saveHistory(newSections);
    setSelectedId(newBlock.id);
  }, [clipboard, sections, saveHistory]);

  const duplicateBlock = useCallback((id: string) => {
    const idx = sections.findIndex(s => s.id === id);
    if (idx === -1) return;
    const blockToClone = sections[idx];
    const newBlock = JSON.parse(JSON.stringify({ ...blockToClone, id: uuidv4() }));
    const newSections = [...sections];
    newSections.splice(idx + 1, 0, newBlock);
    saveHistory(newSections);
    setSelectedId(newBlock.id);
  }, [sections, saveHistory]);

  const value = useMemo(() => ({
    sections, setSections: saveHistory,
    selectedId, setSelectedId,
    hoveredId, setHoveredId,
    deviceMode, setDeviceMode,
    zoom, setZoom,
    undo, redo, canUndo, canRedo, saveHistory,
    clipboard, copyBlock, pasteBlock,
    updateBlock, deleteBlock, duplicateBlock
  }), [
    sections, selectedId, hoveredId, deviceMode, zoom,
    undo, redo, canUndo, canRedo, saveHistory,
    clipboard, copyBlock, pasteBlock, updateBlock, deleteBlock, duplicateBlock
  ]);

  return (
    <CanvasContext.Provider value={value}>
      {children}
    </CanvasContext.Provider>
  );
}

export const useCanvas = () => {
  const context = useContext(CanvasContext);
  if (!context) throw new Error("useCanvas must be used within CanvasProvider");
  return context;
};
