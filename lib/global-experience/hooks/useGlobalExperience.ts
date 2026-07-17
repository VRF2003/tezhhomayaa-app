"use client";

import { useContext } from "react";
import { GlobalExperienceContext } from "../context/GlobalExperienceContext";

export function useGlobalExperience() {
  const context = useContext(GlobalExperienceContext);
  
  if (context === undefined) {
    throw new Error("useGlobalExperience must be used within a GlobalExperienceProvider");
  }
  
  return context;
}
