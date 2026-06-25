"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CommerceData, defaultCommerceData } from "@/lib/types/commerce";

const CommerceContext = createContext<CommerceData>(defaultCommerceData);

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<CommerceData>(defaultCommerceData);

  useEffect(() => {
    fetch("/api/commerce")
      .then((r) => r.json())
      .then((json) => { if (json.success && json.data) setData(json.data); })
      .catch(() => {});
  }, []);

  return <CommerceContext.Provider value={data}>{children}</CommerceContext.Provider>;
}

export function useCommerce(): CommerceData {
  return useContext(CommerceContext);
}
