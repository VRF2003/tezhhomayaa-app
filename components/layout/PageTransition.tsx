"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    // Ideal visible duration: 400ms
    const t = setTimeout(() => setShowOverlay(false), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {/* Page content fades in after overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showOverlay ? 0 : 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>

      {/* Logo overlay */}
      <AnimatePresence>
        {showOverlay && (
          <motion.div
            key="page-transition"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "#F7F5F2", // Luxury Ivory background
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.99 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/branding/tezhhomayaa-logo-v2.png"
                alt="Tezhhomayaa"
                width={320}
                height={119}
                priority
                style={{
                  width: "clamp(160px, 22vw, 260px)",
                  height: "auto",
                  objectFit: "contain",
                }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
