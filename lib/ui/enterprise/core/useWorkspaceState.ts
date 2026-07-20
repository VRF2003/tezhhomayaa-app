"use client";

import { useState, useEffect } from "react";
import { NavigationSection } from "../registry/WorkspaceRegistry";

type WorkspaceState = {
  expandedSections: Record<NavigationSection, boolean>;
};

const DEFAULT_STATE: WorkspaceState = {
  expandedSections: {
    BUSINESS: true,
    ADMINISTRATION: true,
    PLATFORM: false,
  }
};

export function useWorkspaceState() {
  const [state, setState] = useState<WorkspaceState>(DEFAULT_STATE);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("tz_workspace_state");
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (e) {
      console.warn("Could not load workspace state", e);
    }
    setIsLoaded(true);
  }, []);

  const toggleSection = (section: NavigationSection) => {
    setState(prev => {
      const newState = {
        ...prev,
        expandedSections: {
          ...prev.expandedSections,
          [section]: !prev.expandedSections[section]
        }
      };
      try {
        localStorage.setItem("tz_workspace_state", JSON.stringify(newState));
      } catch (e) {
        console.warn("Could not save workspace state", e);
      }
      return newState;
    });
  };

  return {
    state,
    isLoaded,
    toggleSection
  };
}
