"use client";

import React, { useEffect, useState, useRef } from "react";
import { useMotionEngine, useTimeline } from "./MotionEngine";
import { getPreset } from "./MotionPresets";

interface MotionWrapperProps {
  children: React.ReactNode;
  preset?: string;
  delay?: number;
  duration?: number;
  className?: string;
}

export const MotionWrapper = ({ 
  children, 
  preset = "luxury-fade", 
  delay = 0, 
  duration, 
  className = "" 
}: MotionWrapperProps) => {
  const { prefersReducedMotion, registerElement, unregisterElement, forceReplayKey } = useMotionEngine();
  const timeline = useTimeline();
  
  const [isRevealed, setIsRevealed] = useState(false);
  const elRef = useRef<HTMLDivElement>(null);
  
  // Calculate automatic stagger delay if we are inside a Timeline
  const [staggerDelay] = useState(() => timeline ? timeline.registerChild() : 0);
  
  const id = useRef(`motion-${Math.random().toString(36).substr(2, 9)}`).current;
  const activePreset = getPreset(preset);
  
  // If there's no timeline, we handle intersection ourselves
  useEffect(() => {
    setIsRevealed(false);
    if (!timeline && elRef.current) {
      registerElement(id, elRef.current, (intersecting) => {
        setIsRevealed(intersecting);
      });
    }
    return () => unregisterElement(id);
  }, [id, timeline, registerElement, unregisterElement, forceReplayKey]);

  // If there IS a timeline, we reveal when the timeline activates
  useEffect(() => {
    if (timeline && timeline.isActive) {
      setIsRevealed(true);
    } else if (timeline && !timeline.isActive) {
      setIsRevealed(false); // reset for replay
    }
  }, [timeline?.isActive]);

  // Handle Reduced Motion Fallback
  const finalPreset = prefersReducedMotion ? getPreset("luxury-fade") : activePreset;
  const finalDuration = duration || finalPreset.defaultDuration;
  // If user requests reduced motion, we slash duration to 200ms and remove delay
  const computedDuration = prefersReducedMotion ? Math.min(200, finalDuration) : finalDuration;
  const computedDelay = prefersReducedMotion ? 0 : (delay + staggerDelay);

  const style: React.CSSProperties = {
    ...(isRevealed ? finalPreset.active : finalPreset.initial),
    transitionProperty: "opacity, transform, clip-path",
    transitionDuration: `${computedDuration}ms`,
    transitionTimingFunction: finalPreset.defaultEasing,
    transitionDelay: `${computedDelay}ms`,
    willChange: "opacity, transform", // Optimize for GPU
  };

  return (
    <div ref={elRef} style={style} className={className}>
      {children}
    </div>
  );
};
