"use client";

import { useState, useEffect, use, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Product } from "@/lib/collections";
import TagEditor from "@/components/admin/TagEditor";
import { UniversalRichEditor } from "@/components/admin/UniversalRichEditor";

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");
  
  // Basic
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [comparePrice, setComparePrice] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [quantity, setQuantity] = useState("0");
  
  // Storytelling
  const [productStory, setProductStory] = useState("");
  const [designStory, setDesignStory] = useState("");
  const [inspirationStory, setInspirationStory] = useState("");
  const [fabricDetails, setFabricDetails] = useState("");
  const [craftsmanshipDetails, setCraftsmanshipDetails] = useState("");
  
  // Accordions
  const [sizeGuide, setSizeGuide] = useState("");
  const [fabricCare, setFabricCare] = useState("");
  const [shippingReturns, setShippingReturns] = useState("");
  
  // Classification & Attributes
  const [gender, setGender] = useState("women");
  const [category, setCategory] = useState("ready-to-wear");
  const [subcategory, setSubcategory] = useState("dresses-jumpsuits");
  const [status, setStatus] = useState("draft");
  
  const [season, setSeason] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [fit, setFit] = useState("");
  const [collectionName, setCollectionName] = useState("");
  
  // Tags
  const [tags, setTags] = useState<string[]>([]);

  // Media
  type MediaItem = { id: string; type: 'url' | 'file'; file?: File; previewUrl: string };
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Merchandising
  const [gridThumbnail, setGridThumbnail] = useState<number>(0);
  const [desktopGalleryOrder, setDesktopGalleryOrder] = useState<number[]>([]);
  const [tabletGalleryOrder, setTabletGalleryOrder] = useState<number[]>([]);
  const [mobileGalleryOrder, setMobileGalleryOrder] = useState<number[]>([]);

  // Extras
  const [enableStickyCheckout, setEnableStickyCheckout] = useState(true);
  const [relatedProductIds, setRelatedProductIds] = useState<string[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Dynamic Categories
  type CatOption = { label: string; value: string };
  const [catData, setCatData] = useState<{ departments: CatOption[], categories: CatOption[], subcategories: Record<string, CatOption[]> }>({ departments: [], categories: [], subcategories: {} });
  
  // Preview
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const [previewWidth, setPreviewWidth] = useState(600);
  const [isResizing, setIsResizing] = useState(false);
  const [deviceView, setDeviceView] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [showPreview, setShowPreview] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("tezhhomayaa_preview_width");
    if (saved) setPreviewWidth(parseInt(saved));
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isResizing) return;
    const newWidth = window.innerWidth - e.clientX;
    const clamped = Math.max(320, Math.min(newWidth, window.innerWidth - 400));
    setPreviewWidth(clamped);
  }, [isResizing]);

  const handleMouseUp = useCallback(() => {
    if (isResizing) {
      setIsResizing(false);
      localStorage.setItem("tezhhomayaa_preview_width", previewWidth.toString());
    }
  }, [isResizing, previewWidth]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, handleMouseMove, handleMouseUp]);

  useEffect(() => {
    if (!previewIframeRef.current?.contentWindow) return;
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalCategoryString = [gender, category, subcategory || "tops"].filter(Boolean).join("/");
    const href = `/${finalCategoryString}/${baseSlug || 'preview'}`;
    const gallery = mediaItems.map(m => m.previewUrl);

    const mockProduct = {
      id: "preview-id",
      name: name || "Product Name",
      editorialDescription: description,
      price: price || "0",
      compareAtPrice: comparePrice,
      productStory,
      designStory,
      inspirationStory,
      fabricDetails,
      craftsmanshipDetails,
      sizeGuide,
      fabricCare,
      shippingReturns,
      gender,
      category: finalCategoryString,
      image: gallery[0] || "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
      gallery: gallery.length ? gallery : [],
      href,
      tags,
      collectionName,
      status: "active",
      merchandising: {
        gridThumbnail,
        desktopGalleryOrder,
        tabletGalleryOrder,
        mobileGalleryOrder
      }
    };

    previewIframeRef.current.contentWindow.postMessage({
      type: "SYNC_PRODUCT_PREVIEW",
      product: mockProduct
    }, "*");
  }, [
    name, description, price, comparePrice, 
    productStory, designStory, inspirationStory, fabricDetails, craftsmanshipDetails,
    sizeGuide, fabricCare, shippingReturns,
    gender, category, subcategory,
    mediaItems, tags, collectionName,
    gridThumbnail, desktopGalleryOrder, tabletGalleryOrder, mobileGalleryOrder
  ]);

  useEffect(() => {
    const handleMsg = (e: MessageEvent) => {
      if (e.data?.type === "PREVIEW_READY") {
        setName(n => n + " ");
        setTimeout(() => setName(n => n.trim()), 0); // trigger sync
      }
    };
    window.addEventListener("message", handleMsg);
    return () => window.removeEventListener("message", handleMsg);
  }, []);
  
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data) setCatData(json.data);
      })
      .catch(console.error);

    fetch(`/api/products?t=${Date.now()}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setAllProducts(data.data);
          const product = data.data.find((p: Product) => p.id === id);
          if (product) {
            console.log("Product ID on edit:", product.id);
            setName(product.name);
            setDescription(product.editorialDescription || "");
            setPrice(product.price);
            setComparePrice(product.compareAtPrice || "");
            setSku(product.sku || "");
            setBarcode(product.barcode || "");
            setQuantity(product.quantity?.toString() || "0");
            
            setProductStory(product.productStory || "");
            setDesignStory(product.designStory || "");
            setInspirationStory(product.inspirationStory || "");
            setFabricDetails(product.fabricDetails || "");
            setCraftsmanshipDetails(product.craftsmanshipDetails || "");
            
            setSizeGuide(product.sizeGuide || "");
            setFabricCare(product.fabricCare || "");
            setShippingReturns(product.shippingReturns || "");
            // Parse category string back into dropdown state perfectly
            const catStr = product.category || "";
            const parts = catStr.split("/");
            
            let g = product.gender || "women";
            let c = "ready-to-wear";
            let s = "";

            if (parts.length > 0 && parts[0]) {
              const root = parts[0].toLowerCase();
              if (["women", "men", "unisex", "fragrances"].includes(root)) {
                g = root;
                c = parts[1] || "";
                s = parts[2] || "";
              } else {
                c = parts[0] || "";
                s = parts[1] || "";
              }
            }

            // Normalize legacy subcategory values to match dropdown options exactly
            const mapSub = (sub: string) => {
              if (!sub) return "";
              if (sub === "dresses") return "dresses-jumpsuits";
              if (sub === "tracksuits") return "tracksuits-sweatshirts";
              if (sub === "tshirts-polos" || sub === "tshirts") return "t-shirts-polos";
              return sub;
            };

            setGender(g);
            setCategory(c);
            setSubcategory(mapSub(s));
            
            setStatus(product.status || "active");
            setSeason(product.season || "");
            setColor(product.color || "");
            setMaterial(product.material || "");
            setFit(product.fit || "");
            setCollectionName(product.collectionName || "");
            setTags(product.tags || []);
            
            setEnableStickyCheckout(product.enableStickyCheckout !== false); // default true
            setRelatedProductIds(product.relatedProductIds || []);
            
            const existingGallery = product.gallery && product.gallery.length > 0 
              ? product.gallery 
              : product.image ? [product.image] : [];
              
            setMediaItems(existingGallery.map((url: string) => ({
              id: Math.random().toString(36).substring(2, 9),
              type: 'url',
              previewUrl: url
            })));
            
            if (product.merchandising) {
              setGridThumbnail(product.merchandising.gridThumbnail ?? 0);
              setDesktopGalleryOrder(product.merchandising.desktopGalleryOrder ?? []);
              setTabletGalleryOrder(product.merchandising.tabletGalleryOrder ?? []);
              setMobileGalleryOrder(product.merchandising.mobileGalleryOrder ?? []);
            }
          } else {
            setError("Product not found");
          }
        }
        setFetching(false);
      })
      .catch(err => {
        setError(err.message);
        setFetching(false);
      });
  }, [id]);

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "Upload failed");
    return data.url;
  };

  const handleAddMedia = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const newItems = Array.from(e.target.files).map(f => ({
      id: Math.random().toString(36).substring(2, 9),
      type: 'file' as const,
      file: f,
      previewUrl: URL.createObjectURL(f)
    }));
    setMediaItems(prev => [...prev, ...newItems]);
    e.target.value = '';
  };

  const handleRemoveMedia = (id: string) => {
    setMediaItems(prev => prev.filter(m => m.id !== id));
  };

  const handleMakeMain = (index: number) => {
    if (index === 0) return;
    setMediaItems(prev => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.unshift(item);
      return copy;
    });
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) return;
    setMediaItems(prev => {
      const copy = [...prev];
      const [item] = copy.splice(draggedIndex, 1);
      copy.splice(dropIndex, 0, item);
      return copy;
    });
    setDraggedIndex(null);
  };

  const departments = catData.departments || [
    { value: "women", label: "Women" },
    { value: "men", label: "Men" },
    { value: "unisex", label: "Unisex" },
    { value: "fragrances", label: "Fragrances" }
  ];

  const categories = catData.categories || [
    { value: "ready-to-wear", label: "Ready To Wear" },
    { value: "bags", label: "Bags" },
    { value: "accessories", label: "Accessories" }
  ];

  const subcategories = catData.subcategories?.[category] || [];

  const handleGenderChange = (val: string) => {
    setGender(val);
    const firstCat = val === "fragrances" ? "women" : "ready-to-wear";
    setCategory(firstCat);
    setSubcategory(val === "women" ? "tops-shirts" : val === "men" ? "shirts" : "");
  };

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setSubcategory(""); // Reset subcategory, user must select or we auto-select the first in render logic if we wanted to
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mediaItems.length === 0) throw new Error("At least one media item is required (the first item will be the Main Media)");

      const finalGallery = await Promise.all(mediaItems.map(async m => {
        if (m.type === 'url') return m.previewUrl;
        return await uploadImage(m.file!);
      }));
      
      const finalMainImage = finalGallery[0];
      
      let finalSub = subcategory;
      if (!finalSub && subcategories.length > 0) finalSub = subcategories[0].value;
      
      const finalCategoryString = [gender, category, finalSub].filter(Boolean).join("/");
      
      const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const uniqueSlug = `${baseSlug}-${id.substring(id.length - 4)}`;
      const href = `/${finalCategoryString}/${uniqueSlug}`;

      // Auto-generate tags from attributes
      const generatedTags = new Set(tags);
      if (gender) generatedTags.add(`gender_${gender.toLowerCase()}`);
      if (category) generatedTags.add(`category_${category.toLowerCase()}`);
      if (collectionName) generatedTags.add(`collection_${collectionName.toLowerCase().replace(/\s+/g, "_")}`);
      if (season) generatedTags.add(`season_${season.toLowerCase().replace(/\s+/g, "_")}`);
      if (color) generatedTags.add(`color_${color.toLowerCase().replace(/\s+/g, "_")}`);
      if (material) generatedTags.add(`material_${material.toLowerCase().replace(/\s+/g, "_")}`);
      if (fit) generatedTags.add(`fit_${fit.toLowerCase().replace(/\s+/g, "_")}`);
      
      const finalTags = Array.from(generatedTags);

      // Register any new tags globally
      for (const t of finalTags) {
        await fetch("/api/tags", { method: "POST", body: JSON.stringify({ name: t }) }).catch(() => {});
      }

      const payload: Partial<Product> = {
        name,
        editorialDescription: description,
        price,
        compareAtPrice: comparePrice,
        sku,
        barcode,
        quantity: parseInt(quantity) || 0,
        designStory,
        inspirationStory,
        fabricDetails,
        craftsmanshipDetails,
        productStory,
        sizeGuide,
        fabricCare,
        shippingReturns,
        gender,
        category: finalCategoryString,
        status,
        season,
        color,
        material,
        fit,
        collectionName,
        tags: finalTags,
        image: finalMainImage,
        gallery: finalGallery,
        slug: uniqueSlug,
        handle: uniqueSlug,
        href,
        enableStickyCheckout,
        relatedProductIds,
        merchandising: {
          gridThumbnail,
          desktopGalleryOrder,
          tabletGalleryOrder,
          mobileGalleryOrder
        }
      };

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      
      console.log("Product ID on save:", data.data.id);
      
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!data.success) throw new Error(data.error);
      router.push("/admin/products");
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  if (fetching) {
    return <div style={{ padding: "4rem", textAlign: "center", color: "#9a9690", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>Loading product...</div>;
  }

  const getProductPreviewUrl = () => {
    const uniqueSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
    const parts = [];
    if (gender !== "unisex") parts.push(gender);
    if (category) parts.push(category);
    if (subcategory) parts.push(subcategory);
    const finalCategoryString = parts.join("/");
    return `/${finalCategoryString}/${uniqueSlug}`;
  };

  return (
    <div className="flex w-full h-[calc(100vh-70px)] -m-8" style={{ margin: "-2rem" }}>
      {/* Left Form */}
      <div className="flex-1 overflow-y-auto p-8 relative flex flex-col items-center">
        <div className="w-full max-w-[800px]">
          <div style={{ marginBottom: "2rem" }}>
            <Link href="/admin/products" style={{ textDecoration: "none", color: "#6b6865", fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              ← Back to Products
            </Link>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
            <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: 0, letterSpacing: "0.02em" }}>
              Edit Product
            </h1>
            <div style={{ display: "flex", gap: "1rem" }}>
              <button type="button" onClick={() => setShowPreview(!showPreview)} style={{ padding: "0.75rem 1.5rem", background: "#1a1a18", color: "#fff", border: "1px solid #1a1a18", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px" }}>
                {showPreview ? "Hide Preview" : "Live Preview"}
              </button>
              <button onClick={handleDelete} type="button" style={{ padding: "0.75rem 1.5rem", background: "#fdf0f0", color: "#6b3a3a", border: "1px solid #e0b8b8", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", borderRadius: "2px" }}>
                Delete Product
              </button>
            </div>
          </div>

          {error && (
            <div style={{ background: "#fdf0f0", border: "1px solid #e0b8b8", padding: "1rem", color: "#6b3a3a", fontSize: "0.85rem", marginBottom: "2rem" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem", paddingBottom: "4rem" }}>
            {/* Basic Section */}
            <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 1.5rem" }}>Basic Details</h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Product Name *</label>
                  <input required value={name} onChange={e => setName(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem" }} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Description</label>
                  <UniversalRichEditor value={description} onChange={setDescription} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Product Story</label>
                  <UniversalRichEditor value={productStory} onChange={setProductStory} placeholder="Optional storytelling separate from technical description..." />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Price *</label>
                    <input required value={price} onChange={e => setPrice(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Compare at Price</label>
                    <input value={comparePrice} onChange={e => setComparePrice(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem" }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>SKU</label>
                    <input value={sku} onChange={e => setSku(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Barcode</label>
                    <input value={barcode} onChange={e => setBarcode(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem" }} />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                    <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Quantity</label>
                    <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Luxury Storytelling */}
            <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 1.5rem" }}>Luxury Storytelling</h2>
              <p style={{ fontSize: "0.7rem", color: "#9a9690", marginBottom: "1.5rem", fontStyle: "italic" }}>
                Support simple HTML tags (e.g. &lt;strong&gt;, &lt;em&gt;, &lt;br&gt;) for rich text formatting. If empty, the section will be hidden on the product page.
              </p>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Design Story</label>
                  <UniversalRichEditor value={designStory} onChange={setDesignStory} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Inspiration Story</label>
                  <UniversalRichEditor value={inspirationStory} onChange={setInspirationStory} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Fabric Details</label>
                  <UniversalRichEditor value={fabricDetails} onChange={setFabricDetails} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Craftsmanship Details</label>
                  <UniversalRichEditor value={craftsmanshipDetails} onChange={setCraftsmanshipDetails} />
                </div>
              </div>
            </div>

            {/* Accordions */}
            <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 1.5rem" }}>Product Accordions</h2>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Size Guide</label>
                  <UniversalRichEditor value={sizeGuide} onChange={setSizeGuide} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Fabric & Care</label>
                  <UniversalRichEditor value={fabricCare} onChange={setFabricCare} />
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Shipping & Returns</label>
                  <UniversalRichEditor value={shippingReturns} onChange={setShippingReturns} />
                </div>
              </div>
            </div>

            {/* Product Tag Management */}
            <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 1.5rem" }}>Product Tags</h2>
              <TagEditor 
                tags={tags} 
                onChange={setTags} 
              />
            </div>

            {/* Classification & Structure */}
            <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px" }}>
              <h2 style={{ fontSize: "1rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 1.5rem" }}>Classification & Structure</h2>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Department *</label>
                  <select value={gender} onChange={e => handleGenderChange(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem", background: "#fff", cursor: "pointer", borderRadius: "0", appearance: "none" }}>
                    {departments.map(d => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Category *</label>
                  <select value={category} onChange={e => handleCategoryChange(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem", background: "#fff", cursor: "pointer", borderRadius: "0", appearance: "none" }}>
                    {categories.map(c => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {subcategories.length > 0 && (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Subcategory *</label>
                  <select value={subcategory} onChange={e => setSubcategory(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem", background: "#fff", cursor: "pointer", borderRadius: "0", appearance: "none" }}>
                    <option value="" disabled>Select subcategory...</option>
                    {subcategories.map(s => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              )}

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Season</label>
                  <input value={season} onChange={e => setSeason(e.target.value)} placeholder="e.g. SS26" style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Color</label>
                  <input value={color} onChange={e => setColor(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Material</label>
                  <input value={material} onChange={e => setMaterial(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Fit</label>
                  <input value={fit} onChange={e => setFit(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Collection Name</label>
                  <input value={collectionName} onChange={e => setCollectionName(e.target.value)} placeholder="e.g. The Artisan Collection" style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", gridColumn: "1 / -1" }}>
                  <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem", background: "#fff", cursor: "pointer", borderRadius: "0", appearance: "none" }}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid #e8e4df", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>Product Tags</label>
                <p style={{ fontSize: "0.75rem", color: "#9a9690", marginBottom: "0.5rem" }}>Tags are automatically generated from attributes above. You can add custom ones here too.</p>
                <TagEditor tags={tags} onChange={setTags} />
              </div>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "1.5rem" }}>
                <input 
                  type="checkbox" 
                  checked={enableStickyCheckout} 
                  onChange={e => setEnableStickyCheckout(e.target.checked)} 
                  id="sticky-checkout"
                />
                <label htmlFor="sticky-checkout" style={{ fontSize: "0.85rem", color: "#1a1a18" }}>Enable Sticky Checkout Bar</label>
              </div>
            </div>

            {/* Related Products Override */}
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 0.5rem" }}>Related Products Override</h2>
          <p style={{ fontSize: "0.8rem", color: "#6b6865", marginBottom: "1.5rem", fontStyle: "italic" }}>
            By default, related products are selected automatically based on the category. Select products here to override the algorithm.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <select 
              multiple 
              value={relatedProductIds} 
              onChange={e => setRelatedProductIds(Array.from(e.target.selectedOptions, option => option.value))}
              style={{ padding: "0.85rem", border: "1px solid #ccc9c4", outline: "none", fontSize: "0.9rem", background: "transparent", minHeight: "150px" }}
            >
              {allProducts.filter(p => p.id !== id).map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.sku || p.category})</option>
              ))}
            </select>
            <p style={{ fontSize: "0.7rem", color: "#9a9690" }}>Hold Command (Mac) or Ctrl (Windows) to select multiple products. Maximum 4 recommended.</p>
          </div>
        </div>

        {/* Media */}
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 400, color: "#1a1a18", margin: 0 }}>Media</h2>
            <div>
              <input type="file" id="media-upload" accept="image/*,video/mp4,video/quicktime,video/webm" multiple onChange={handleAddMedia} style={{ display: 'none' }} />
              <label htmlFor="media-upload" style={{ padding: "0.5rem 1rem", border: "1px solid #ccc9c4", color: "#1a1a18", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", display: "inline-block", transition: "background 0.2s" }} onMouseEnter={e => e.currentTarget.style.background = "#fafaf8"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                Add Media
              </label>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.5rem" }}>
            <p style={{ fontSize: "0.75rem", color: "#9a9690", letterSpacing: "0.02em", margin: 0 }}>
              The first item acts as the Main Media and fills the cinematic landing screen.
            </p>
            <p style={{ fontSize: "0.75rem", color: "#1a1a18", letterSpacing: "0.02em", margin: 0, fontWeight: 500 }}>
              Recommended Sizes: <span style={{ color: "#6b6865", fontWeight: 400 }}>16:9 Cinematic (e.g. 1920x1080) for the Main Image. 3:4 Portrait (e.g. 1200x1600) for all Carousel images.</span>
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "1rem" }}>
            {mediaItems.map((item, index) => (
              <div 
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                style={{ 
                  position: "relative", 
                  aspectRatio: "3/4", 
                  border: index === 0 ? "1px solid #1a1a18" : "1px solid #e8e4df",
                  opacity: draggedIndex === index ? 0.4 : 1,
                  cursor: "grab",
                  overflow: "hidden",
                  borderRadius: "2px",
                  background: "#fafaf8"
                }}
              >
                {(item.type === 'file' ? item.file?.type.startsWith('video/') : item.previewUrl.match(/\.(mp4|webm|mov)$/i)) ? (
                  <video src={item.previewUrl} autoPlay loop muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                ) : (
                  <img src={item.previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover", pointerEvents: "none" }} />
                )}
                
                {index === 0 && (
                  <div style={{ position: "absolute", top: "0.5rem", left: "0.5rem", background: "#1a1a18", color: "#ffffff", fontSize: "0.5rem", padding: "0.3rem 0.5rem", letterSpacing: "0.15em", textTransform: "uppercase" }}>
                    Main Media
                  </div>
                )}

                <div style={{ position: "absolute", bottom: "0.5rem", right: "0.5rem", display: "flex", gap: "0.3rem" }}>
                  {index !== 0 && (
                    <button 
                      type="button" 
                      onClick={() => handleMakeMain(index)}
                      title="Make Main Media"
                      style={{ background: "#ffffff", border: "1px solid #ccc9c4", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1a1a18", fontSize: "0.8rem", paddingBottom: "2px" }}
                    >
                      ★
                    </button>
                  )}
                  <button 
                    type="button" 
                    onClick={() => handleRemoveMedia(item.id)}
                    title="Remove Media"
                    style={{ background: "#ffffff", border: "1px solid #ccc9c4", width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#1a1a18", fontSize: "1rem", paddingBottom: "2px" }}
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            {mediaItems.length === 0 && (
              <div style={{ gridColumn: "1 / -1", padding: "4rem 2rem", textAlign: "center", border: "1px dashed #ccc9c4", color: "#9a9690", fontSize: "0.85rem", background: "#fafaf8" }}>
                No media added yet. Click "Add Images" to upload.
              </div>
            )}
          </div>
        </div>

        {/* Image Merchandising */}
        <div style={{ background: "#ffffff", border: "1px solid #e8e4df", padding: "2rem", borderRadius: "2px" }}>
          <h2 style={{ fontSize: "1rem", fontWeight: 400, color: "#1a1a18", margin: "0 0 1.5rem" }}>Image Merchandising</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            {[
              { label: "Grid Thumbnail", key: "gridThumbnail", val: gridThumbnail, setVal: setGridThumbnail as any },
              { label: "Desktop Gallery Order", key: "desktopGalleryOrder", val: desktopGalleryOrder, setVal: setDesktopGalleryOrder as any },
              { label: "Tablet Gallery Order", key: "tabletGalleryOrder", val: tabletGalleryOrder, setVal: setTabletGalleryOrder as any },
              { label: "Mobile Gallery Order", key: "mobileGalleryOrder", val: mobileGalleryOrder, setVal: setMobileGalleryOrder as any }
            ].map(({ label, key, val, setVal }) => (
              <div key={key} style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <label style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "#6b6865" }}>{label}</label>
                
                {mediaItems.filter(m => m.type !== 'file' ? !m.previewUrl.match(/\.(mp4|webm|mov)$/i) : !m.file?.type.startsWith('video/')).length > 0 ? (
                  <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem" }}>
                    {mediaItems.filter(m => m.type !== 'file' ? !m.previewUrl.match(/\.(mp4|webm|mov)$/i) : !m.file?.type.startsWith('video/')).map((item, originalIndex) => {
                      // Find the actual index in the mediaItems array to save
                      const actualIndex = mediaItems.findIndex(m => m.id === item.id);
                      const isArray = Array.isArray(val);
                      const isSelected = isArray ? (val as number[]).includes(actualIndex) : val === actualIndex;
                      const badgeText = isArray ? ((val as number[]).indexOf(actualIndex) + 1).toString() : "✓";
                      
                      return (
                        <div 
                          key={item.id}
                          onClick={() => {
                            if (isArray) {
                              const arr = val as number[];
                              if (arr.includes(actualIndex)) {
                                setVal(arr.filter(i => i !== actualIndex));
                              } else {
                                setVal([...arr, actualIndex]);
                              }
                            } else {
                              setVal(actualIndex);
                            }
                          }}
                          style={{
                            position: "relative",
                            width: "80px",
                            height: "106px",
                            border: isSelected ? "2px solid #1a1a18" : "1px solid #e8e4df",
                            padding: isSelected ? "2px" : "0",
                            cursor: "pointer",
                            flexShrink: 0,
                            borderRadius: "2px",
                            background: "#fafaf8"
                          }}
                        >
                          <img src={item.previewUrl} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" />
                          {isSelected && (
                            <div style={{
                              position: "absolute",
                              top: "-8px",
                              right: "-8px",
                              background: "#1a1a18",
                              color: "#fff",
                              borderRadius: "50%",
                              width: "20px",
                              height: "20px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "12px"
                            }}>
                              {badgeText}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div style={{ fontSize: "0.75rem", color: "#9a9690", padding: "1rem 0" }}>No images available for merchandising.</div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: "1rem", marginTop: "1rem" }}>
          <Link href="/admin/products" style={{ textDecoration: "none" }}>
            <button type="button" style={{ padding: "1rem 2rem", background: "transparent", color: "#1a1a18", border: "1px solid #1a1a18", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer" }}>
              Cancel
            </button>
          </Link>
          <button type="submit" disabled={loading} style={{ padding: "1rem 2rem", background: "#1a1a18", color: "#f7f5f2", border: "none", fontSize: "0.65rem", letterSpacing: "0.15em", textTransform: "uppercase", cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Saving..." : "Save Product"}
          </button>
        </div>
      </form>
        </div>
      </div>

      {/* Resizer */}
      {showPreview && (
        <div 
          onMouseDown={() => setIsResizing(true)}
          className={`w-1 cursor-col-resize hover:bg-black active:bg-black transition-colors ${isResizing ? "bg-black" : "bg-gray-200"}`}
        />
      )}

      {/* Right Preview */}
      {showPreview && (
        <div 
          style={{ width: previewWidth }} 
          className="flex flex-col bg-gray-50 border-l border-gray-200 shrink-0 relative overflow-hidden"
        >
          {/* Toolbar */}
          <div className="flex items-center justify-center gap-6 p-4 border-b border-gray-200 bg-white shrink-0">
            <button type="button" onClick={() => setDeviceView("desktop")} className={`text-[10px] uppercase font-mono tracking-widest transition-colors ${deviceView === "desktop" ? "text-black border-b border-black pb-1" : "text-gray-400 hover:text-gray-600 pb-1"}`}>Desktop</button>
            <button type="button" onClick={() => setDeviceView("tablet")} className={`text-[10px] uppercase font-mono tracking-widest transition-colors ${deviceView === "tablet" ? "text-black border-b border-black pb-1" : "text-gray-400 hover:text-gray-600 pb-1"}`}>Tablet</button>
            <button type="button" onClick={() => setDeviceView("mobile")} className={`text-[10px] uppercase font-mono tracking-widest transition-colors ${deviceView === "mobile" ? "text-black border-b border-black pb-1" : "text-gray-400 hover:text-gray-600 pb-1"}`}>Mobile</button>
          </div>
          
          {/* Iframe container */}
          <div className="flex-1 overflow-y-auto relative bg-[#f4f2f0] flex items-start justify-center pt-8 pb-16">
            <div 
              style={{ 
                width: deviceView === "desktop" ? "100%" : deviceView === "tablet" ? "768px" : "375px",
                height: deviceView === "desktop" ? "100%" : "800px",
                maxWidth: "100%",
                minHeight: "100%",
                transition: "width 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
              }}
              className="bg-white shadow-2xl relative"
            >
              {isResizing && <div className="absolute inset-0 z-50 bg-transparent" />}
              <iframe
                 ref={previewIframeRef}
                 src="/admin/preview/product"
                 className="w-full h-full border-0 pointer-events-auto"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
