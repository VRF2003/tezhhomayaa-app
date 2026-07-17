"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { ArrivalState, ArrivalStep } from "../types/arrival";

export interface ArrivalContextType extends ArrivalState {
  setStep: (step: ArrivalStep) => void;
  setRegion: (regionId: string) => void;
  setCountry: (countryCode: string) => void;
  setLanguage: (langCode: string) => void;
  setTheme: (theme: "DARK" | "LIGHT") => void;
  completeArrival: () => void;
  resetArrival: () => void;
  isArrivalComplete: boolean;
}

export const ArrivalContext = createContext<ArrivalContextType | null>(null);

export function ArrivalProvider({ children }: { children: ReactNode }) {
  const [currentStep, setCurrentStep] = useState<ArrivalStep>("REGION");
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [arrivalTheme, setArrivalTheme] = useState<"DARK" | "LIGHT">("DARK");
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const [isArrivalComplete, setIsArrivalComplete] = useState<boolean>(false);

  // Future persistence can be handled here if we want the user to resume arrival
  // But for now, we just maintain in-memory state.

  const setStep = (step: ArrivalStep) => {
    setIsTransitioning(true);
    // Mimic a smooth state transition time
    setTimeout(() => {
      setCurrentStep(step);
      setIsTransitioning(false);
    }, 400);
  };

  const setRegion = (regionId: string) => {
    setSelectedRegion(regionId);
    setStep("COUNTRY");
  };

  const setCountry = (countryCode: string) => {
    setSelectedCountry(countryCode);
    setStep("LANGUAGE");
  };

  const setLanguage = (langCode: string) => {
    setSelectedLanguage(langCode);
    setStep("SEQUENCE");
  };

  const completeArrival = () => {
    setIsArrivalComplete(true);
  };

  const resetArrival = () => {
    setCurrentStep("REGION");
    setSelectedRegion(null);
    setSelectedCountry(null);
    setSelectedLanguage(null);
    setIsArrivalComplete(false);
  };

  return (
    <ArrivalContext.Provider
      value={{
        currentStep,
        selectedRegion,
        selectedCountry,
        selectedLanguage,
        arrivalTheme,
        isTransitioning,
        setStep,
        setRegion,
        setCountry,
        setLanguage,
        setTheme: setArrivalTheme,
        completeArrival,
        resetArrival,
        isArrivalComplete
      }}
    >
      {children}
    </ArrivalContext.Provider>
  );
}

export function useArrival() {
  const context = useContext(ArrivalContext);
  if (!context) {
    throw new Error("useArrival must be used within an ArrivalProvider");
  }
  return context;
}
