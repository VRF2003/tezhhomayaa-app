import React from "react";
import { motion } from "framer-motion";

export function ArrivalBackground() {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-[#111111]">
      {/* 
        Extremely soft editorial gradients. Deep charcoal and warm ivory.
        No photography. Timeless.
      */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 2, ease: "easeOut" }}
        style={{
          background: "radial-gradient(circle at 50% 0%, rgba(30,28,26,1) 0%, rgba(17,17,17,1) 70%)"
        }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-3/4 h-3/4 opacity-30 mix-blend-screen"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={{ opacity: 0.3, scale: 1 }}
        transition={{ duration: 3, ease: "easeOut" }}
        style={{
          background: "radial-gradient(circle at 100% 100%, rgba(60,55,50,0.8) 0%, transparent 60%)"
        }}
      />
      
      {/* Noise texture overlay for a physical paper/editorial feel */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay" 
        style={{ backgroundImage: 'url("/noise.png")', backgroundRepeat: "repeat" }}
      />
    </div>
  );
}
