"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type Slide = {
  id: string;
  name: string;
  image: string;
  subtitle: string;
  video?: string;
  mobileImage?: string;
  mobileVideo?: string;
  sortOrder?: number;
  collectionLink?: string;
  description?: string;
  buttonLabel?: string;
  buttonLink?: string;
  visibility?: string;
  publishStatus?: string;
};

export default function LookbookAdminPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingMedia, setUploadingMedia] = useState<{ id: string, field: string } | null>(null);

  useEffect(() => {
    fetch("/api/lookbook")
      .then(res => res.json())
      .then(data => {
        setSlides(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const saveSlides = async (newSlides: Slide[]) => {
    setSaving(true);
    try {
      const res = await fetch("/api/lookbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSlides),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSlides(newSlides);
    } catch (error) {
      alert("Error saving slides. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `new-slide-${Date.now()}`,
      name: "New Collection",
      subtitle: "Subtitle here",
      image: "",
      video: "",
      mobileImage: "",
      mobileVideo: "",
      sortOrder: slides.length,
      collectionLink: "",
      description: "",
      buttonLabel: "Explore Collection",
      buttonLink: "",
      visibility: "visible",
      publishStatus: "published",
    };
    saveSlides([...slides, newSlide]);
  };

  const handleUpdateSlide = (id: string, field: keyof Slide, value: any) => {
    const newSlides = slides.map(s => (s.id === id ? { ...s, [field]: value } : s));
    setSlides(newSlides); // Optimistic update
  };

  const handleSaveSlide = () => {
    saveSlides(slides);
  };

  const handleDeleteSlide = (id: string) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      saveSlides(slides.filter(s => s.id !== id));
    }
  };

  const handleMediaUpload = async (id: string, field: keyof Slide, file: File) => {
    setUploadingMedia({ id, field });
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        const newSlides = slides.map(s => (s.id === id ? { ...s, [field]: data.url } : s));
        await saveSlides(newSlides);
      } else {
        alert("Upload failed: " + data.error);
      }
    } catch (err) {
      alert("Upload error.");
    } finally {
      setUploadingMedia(null);
    }
  };

  if (loading) return <div style={{ padding: "2rem" }}>Loading Lookbook Configuration...</div>;

  return (
    <div style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto", fontFamily: "var(--font-jost, sans-serif)" }}>
      <style>{`
        .slide-editor-grid {
          display: grid;
          grid-template-columns: minmax(360px, 420px) 1fr;
          gap: 40px;
          align-items: start;
        }
        @media (max-width: 1024px) {
          .slide-editor-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (max-width: 768px) {
          .slide-editor-grid {
            grid-template-columns: 1fr;
          }
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
        }
        .form-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #333;
        }
        .form-input, .form-select, .form-textarea {
          width: 100%;
          padding: 0.85rem;
          border: 1px solid #e2e2e2;
          border-radius: 4px;
          font-family: inherit;
          font-size: 0.9rem;
          background: #fff;
          transition: border-color 0.2s;
        }
        .form-input:focus, .form-select:focus, .form-textarea:focus {
          outline: none;
          border-color: #1a1a18;
        }
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }
      `}</style>
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-cormorant, serif)" }}>Lookbook CMS</h1>
        <div>
          <button 
            onClick={handleSaveSlide} 
            disabled={saving}
            style={{ padding: "0.75rem 2rem", background: "#1a1a18", color: "#fff", border: "none", cursor: "pointer", marginRight: "1rem", borderRadius: "4px", fontSize: "0.9rem", fontWeight: 500 }}
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
          <button 
            onClick={handleAddSlide} 
            style={{ padding: "0.75rem 2rem", background: "#fff", color: "#1a1a18", border: "1px solid #1a1a18", cursor: "pointer", borderRadius: "4px", fontSize: "0.9rem", fontWeight: 500 }}
          >
            + Add Slide
          </button>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "3rem" }}>
        {slides.map((slide, index) => (
          <div key={slide.id} className="slide-editor-grid" style={{ background: "#fdfdfd", padding: "2.5rem", borderRadius: "12px", border: "1px solid #eaeaea", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
            
            {/* Left Column: Media Uploads */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              
              {/* Desktop Image */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Desktop Image</span>
                <div style={{ width: "100%", aspectRatio: "3/4", background: "#f0f0f0", position: "relative", overflow: "hidden", borderRadius: "6px", border: "1px dashed #ccc" }}>
                  {slide.image ? (
                    <Image src={slide.image} alt="Desktop" fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", fontSize: "0.85rem" }}>No Image</div>
                  )}
                  {uploadingMedia?.id === slide.id && uploadingMedia?.field === "image" && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 500 }}>Uploading...</div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleMediaUpload(slide.id, "image", e.target.files[0])} style={{ fontSize: "0.8rem", width: "100%" }} />
              </div>

              {/* Desktop Video */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Desktop Video</span>
                <div style={{ width: "100%", aspectRatio: "3/4", background: "#f0f0f0", position: "relative", overflow: "hidden", borderRadius: "6px", border: "1px dashed #ccc" }}>
                  {slide.video ? (
                    <video src={slide.video} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", fontSize: "0.85rem" }}>No Video</div>
                  )}
                  {uploadingMedia?.id === slide.id && uploadingMedia?.field === "video" && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 500 }}>Uploading...</div>
                  )}
                </div>
                <input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && handleMediaUpload(slide.id, "video", e.target.files[0])} style={{ fontSize: "0.8rem", width: "100%" }} />
              </div>

              {/* Mobile Image */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Mobile Image</span>
                <div style={{ width: "100%", aspectRatio: "9/16", background: "#f0f0f0", position: "relative", overflow: "hidden", borderRadius: "6px", border: "1px dashed #ccc" }}>
                  {slide.mobileImage ? (
                    <Image src={slide.mobileImage} alt="Mobile" fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", fontSize: "0.85rem" }}>No Image</div>
                  )}
                  {uploadingMedia?.id === slide.id && uploadingMedia?.field === "mobileImage" && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 500 }}>Uploading...</div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleMediaUpload(slide.id, "mobileImage", e.target.files[0])} style={{ fontSize: "0.8rem", width: "100%" }} />
              </div>

              {/* Mobile Video */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Mobile Video</span>
                <div style={{ width: "100%", aspectRatio: "9/16", background: "#f0f0f0", position: "relative", overflow: "hidden", borderRadius: "6px", border: "1px dashed #ccc" }}>
                  {slide.mobileVideo ? (
                    <video src={slide.mobileVideo} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", fontSize: "0.85rem" }}>No Video</div>
                  )}
                  {uploadingMedia?.id === slide.id && uploadingMedia?.field === "mobileVideo" && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.85rem", fontWeight: 500 }}>Uploading...</div>
                  )}
                </div>
                <input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && handleMediaUpload(slide.id, "mobileVideo", e.target.files[0])} style={{ fontSize: "0.8rem", width: "100%" }} />
              </div>

            </div>

            {/* Right Column: Slide Settings */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
              <div style={{ borderBottom: "1px solid #eee", paddingBottom: "1rem", marginBottom: "2rem" }}>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 500 }}>Slide Settings</h3>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Slide ID</label>
                  <input 
                    className="form-input"
                    value={slide.id} 
                    onChange={(e) => handleUpdateSlide(slide.id, "id", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Sort Order</label>
                  <input 
                    type="number"
                    className="form-input"
                    value={slide.sortOrder || 0} 
                    onChange={(e) => handleUpdateSlide(slide.id, "sortOrder", parseInt(e.target.value))}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label className="form-label">Headline</label>
                <input 
                  className="form-input"
                  value={slide.name} 
                  onChange={(e) => handleUpdateSlide(slide.id, "name", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Subheadline</label>
                <input 
                  className="form-input"
                  value={slide.subtitle} 
                  onChange={(e) => handleUpdateSlide(slide.id, "subtitle", e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-textarea"
                  rows={3}
                  value={slide.description || ""} 
                  onChange={(e) => handleUpdateSlide(slide.id, "description", e.target.value)}
                  placeholder="Optional description text..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Button Label</label>
                  <input 
                    className="form-input"
                    value={slide.buttonLabel || "Explore Collection"} 
                    onChange={(e) => handleUpdateSlide(slide.id, "buttonLabel", e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Collection Link</label>
                  <input 
                    className="form-input"
                    value={slide.collectionLink || `/collections/${slide.id}`} 
                    onChange={(e) => handleUpdateSlide(slide.id, "collectionLink", e.target.value)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Visibility</label>
                  <select 
                    className="form-select"
                    value={slide.visibility || "visible"}
                    onChange={(e) => handleUpdateSlide(slide.id, "visibility", e.target.value)}
                  >
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Publish Status</label>
                  <select 
                    className="form-select"
                    value={slide.publishStatus || "published"}
                    onChange={(e) => handleUpdateSlide(slide.id, "publishStatus", e.target.value)}
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end", borderTop: "1px solid #eee", paddingTop: "1.5rem" }}>
                <button 
                  onClick={() => handleDeleteSlide(slide.id)}
                  style={{ padding: "0.75rem 1.5rem", background: "#fff", color: "#d32f2f", border: "1px solid #ffcdd2", cursor: "pointer", borderRadius: "4px", fontSize: "0.9rem", fontWeight: 500, transition: "background 0.2s" }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#ffebee"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#fff"}
                >
                  Delete Slide
                </button>
              </div>
            </div>

          </div>
        ))}
        
        {slides.length === 0 && (
          <div style={{ textAlign: "center", padding: "6rem 2rem", background: "#fdfdfd", borderRadius: "12px", border: "1px dashed #ccc", color: "#666" }}>
            <h3 style={{ fontSize: "1.2rem", margin: "0 0 0.5rem" }}>No Collections Found</h3>
            <p style={{ margin: "0 0 1.5rem" }}>Get started by adding your first lookbook slide.</p>
            <button 
              onClick={handleAddSlide} 
              style={{ padding: "0.75rem 2rem", background: "#1a1a18", color: "#fff", border: "none", cursor: "pointer", borderRadius: "4px", fontSize: "0.9rem", fontWeight: 500 }}
            >
              + Add Slide
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
