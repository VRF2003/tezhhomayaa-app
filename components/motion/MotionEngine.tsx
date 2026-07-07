"use client";

import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";

interface MotionEngineContextType {
  registerElement: (id: string, el: HTMLElement, callback: (isIntersecting: boolean) => void) => void;
  unregisterElement: (id: string) => void;
  prefersReducedMotion: boolean;
  forceReplayKey: number; // Used by VXP to force an instant replay of all animations
  triggerReplay: () => void;
}

const MotionEngineContext = createContext<MotionEngineContextType | undefined>(undefined);

export const MotionEngineProvider = ({ children }: { children: React.ReactNode }) => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [forceReplayKey, setForceReplayKey] = useState(0);
  
  // Store callbacks for each registered element
  const callbacksRef = useRef<Map<string, (isIntersecting: boolean) => void>>(new Map());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Initialize accessibility listener
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);

  // Initialize global IntersectionObserver
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.getAttribute("data-motion-id");
          if (id) {
            const callback = callbacksRef.current.get(id);
            if (callback && entry.isIntersecting) {
              callback(true);
              // Once it triggers, we stop observing it unless it's a "replayable" block.
              // For luxury editorial, we usually only animate once. The VXP handles replay manually.
              observerRef.current?.unobserve(entry.target);
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -10% 0px" } // Trigger slightly before it enters the viewport
    );

    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  const registerElement = useCallback((id: string, el: HTMLElement, callback: (isIntersecting: boolean) => void) => {
    el.setAttribute("data-motion-id", id);
    callbacksRef.current.set(id, callback);
    observerRef.current?.observe(el);
  }, []);

  const unregisterElement = useCallback((id: string) => {
    callbacksRef.current.delete(id);
    // Note: unobserve is tricky without the element ref, but since the element unmounts, it's fine.
  }, []);

  const triggerReplay = useCallback(() => {
    setForceReplayKey(prev => prev + 1);
  }, []);

  return (
    <MotionEngineContext.Provider value={{ registerElement, unregisterElement, prefersReducedMotion, forceReplayKey, triggerReplay }}>
      {children}
    </MotionEngineContext.Provider>
  );
};

export const useMotionEngine = () => {
  const context = useContext(MotionEngineContext);
  if (!context) {
    // If used outside a provider, fail gracefully (useful if someone drops a block into a naked page)
    return {
      registerElement: () => {},
      unregisterElement: () => {},
      prefersReducedMotion: false,
      forceReplayKey: 0,
      triggerReplay: () => {}
    };
  }
  return context;
};

// --- Timeline Engine for Staggering ---

interface TimelineContextType {
  isActive: boolean;
  registerChild: () => number; // Returns the index of the child for staggering
}

const TimelineContext = createContext<TimelineContextType | undefined>(undefined);

export const Timeline = ({ 
  children, 
  stagger = true, 
  interval = 120, // 120ms between children
  id 
}: { 
  children: React.ReactNode; 
  stagger?: boolean; 
  interval?: number;
  id: string;
}) => {
  const { registerElement, unregisterElement, forceReplayKey } = useMotionEngine();
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Simple child index counter
  const childCounter = useRef(0);
  
  // Reset on replay
  useEffect(() => {
    setIsActive(false);
    childCounter.current = 0;
    
    if (containerRef.current) {
      registerElement(id, containerRef.current, (intersecting) => {
        setIsActive(intersecting);
      });
    }
    
    return () => unregisterElement(id);
  }, [id, registerElement, unregisterElement, forceReplayKey]);

  const registerChild = useCallback(() => {
    if (!stagger) return 0;
    const index = childCounter.current;
    childCounter.current += 1;
    return index * interval;
  }, [stagger, interval]);

  return (
    <TimelineContext.Provider value={{ isActive, registerChild }}>
      <div ref={containerRef} className="timeline-container w-full h-full">
        {children}
      </div>
    </TimelineContext.Provider>
  );
};

export const useTimeline = () => useContext(TimelineContext);
