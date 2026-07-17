import React from "react";
import { MaisonArrival as MaisonArrivalCore } from "./MaisonArrival";
import { ArrivalProvider } from "../context/ArrivalContext";

export function MaisonArrival() {
  return (
    <ArrivalProvider>
      <MaisonArrivalCore />
    </ArrivalProvider>
  );
}
