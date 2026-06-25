"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "p" | "span";

interface AnimatedTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
  mode?: "words" | "chars";
  stagger?: number;
  duration?: number;
  tag?: HeadingTag;
}

export default function AnimatedText({
  text,
  className = "",
  style,
  delay = 0,
  mode = "words",
  stagger = 0.05,
  duration = 1.0,
  tag: Tag = "p",
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5% 0px" });

  const tokens = mode === "chars" ? text.split("") : text.split(" ");

  const container = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: stagger,
        delayChildren: delay,
      },
    },
  };

  const item = {
    hidden: { y: "110%", opacity: 0 },
    visible: {
      y: "0%",
      opacity: 1,
      transition: {
        duration,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <div ref={ref} aria-label={text} style={style}>
      <Tag className={className} aria-hidden="true" style={{ display: "block" }}>
        <motion.span
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={{
            display: "inline-flex",
            flexWrap: "wrap",
            gap: mode === "chars" ? "0" : "0.25em",
          }}
        >
          {tokens.map((token, i) => (
            <span
              key={i}
              style={{ display: "inline-block", overflow: "hidden" }}
            >
              <motion.span variants={item} style={{ display: "inline-block" }}>
                {token === " " ? "\u00A0" : token}
              </motion.span>
            </span>
          ))}
        </motion.span>
      </Tag>
    </div>
  );
}
