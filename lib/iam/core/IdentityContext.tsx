"use client";

import { createContext, useContext, ReactNode } from "react";
import { Identity, Session, Permission } from "./types";

export interface IdentityContextState {
  identity: Identity | null;
  session: Session | null;
  permissions: Permission[];
  isAuthenticated: boolean;
  organization?: string; // Reserved for future
  tenant?: string; // Reserved for future
}

export const IdentityContext = createContext<IdentityContextState>({
  identity: null,
  session: null,
  permissions: [],
  isAuthenticated: false,
});

export function useIdentity() {
  const context = useContext(IdentityContext);
  if (!context) {
    throw new Error("useIdentity must be used within an IdentityProvider");
  }
  return context;
}

interface IdentityProviderProps {
  children: ReactNode;
  initialState: IdentityContextState;
}

export function IdentityProvider({ children, initialState }: IdentityProviderProps) {
  return (
    <IdentityContext.Provider value={initialState}>
      {children}
    </IdentityContext.Provider>
  );
}
