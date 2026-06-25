"use client";

import React, { useState, useEffect } from "react";
import HomepageClientWrapper from "@/components/sections/HomepageClientWrapper";
import { LivePreviewBuilder } from "@/components/admin/LivePreviewBuilder";

export default function ProductPagesContentBuilder() {
  return (
    <div style={{ margin: "-2rem", height: "calc(100vh - 4rem)" }}>
      <LivePreviewBuilder 
        apiEndpoint="/api/product-pages"
        pageTitle="Product Pages Builder" 
        backUrl="/admin/dashboard"
        previewUrl="/women/ready-to-wear"
      />
    </div>
  );
}
