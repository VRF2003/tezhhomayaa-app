import { useState, useEffect, useRef } from "react";

export function useWysiwygDrag({ sectionId, slideId, defaultDesktop, defaultMobile }: { 
  sectionId?: string, 
  slideId?: string, 
  defaultDesktop: { x: number, y: number },
  defaultMobile: { x: number, y: number }
}) {
  const [mounted, setMounted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [localPos, setLocalPos] = useState({ x: 50, y: 50 });
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const isPreviewMode = mounted && typeof window !== "undefined" && (window !== window.parent || sectionId === "preview-banner");

  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isPreviewMode) return;
    e.preventDefault(); e.stopPropagation();
    
    // Set initial position based on viewport at the exact moment drag begins
    const isMobile = window.innerWidth < 768;
    setLocalPos({
      x: isMobile ? (defaultMobile.x ?? 50) : (defaultDesktop.x ?? 50),
      y: isMobile ? (defaultMobile.y ?? 50) : (defaultDesktop.y ?? 50)
    });
    
    setIsDragging(true);
    
    const handlePointerMove = (moveEv: PointerEvent) => {
      if (!containerRef.current?.parentElement) return;
      const rect = containerRef.current.parentElement.getBoundingClientRect();
      let newX = ((moveEv.clientX - rect.left) / rect.width) * 100;
      let newY = ((moveEv.clientY - rect.top) / rect.height) * 100;
      setLocalPos({ x: Math.max(0, Math.min(100, newX)), y: Math.max(0, Math.min(100, newY)) });
    };

    const handlePointerUp = (upEv: PointerEvent) => {
      setIsDragging(false);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      
      if (!containerRef.current?.parentElement) return;
      const rect = containerRef.current.parentElement.getBoundingClientRect();
      let newX = ((upEv.clientX - rect.left) / rect.width) * 100;
      let newY = ((upEv.clientY - rect.top) / rect.height) * 100;
      const finalX = Math.round(Math.max(0, Math.min(100, newX)));
      const finalY = Math.round(Math.max(0, Math.min(100, newY)));
      const mode = window.innerWidth < 768 ? "mobile" : "desktop";
      
      window.parent.postMessage({ type: "UPDATE_POSITION", secId: sectionId, slideId, x: finalX, y: finalY, mode }, "*");
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
  };

  return { containerRef, localPos, isDragging, handlePointerDown, isPreviewMode, mounted };
}
