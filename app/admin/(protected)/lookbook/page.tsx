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
    };
    saveSlides([...slides, newSlide]);
  };

  const handleUpdateSlide = (id: string, field: keyof Slide, value: string) => {
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
    <div style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", fontFamily: "var(--font-jost, sans-serif)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontFamily: "var(--font-cormorant, serif)" }}>Lookbook CMS</h1>
        <div>
          <button 
            onClick={handleSaveSlide} 
            disabled={saving}
            style={{ padding: "0.5rem 1.5rem", background: "#1a1a18", color: "#fff", border: "none", cursor: "pointer", marginRight: "1rem" }}
          >
            {saving ? "Saving..." : "Save All Changes"}
          </button>
          <button 
            onClick={handleAddSlide} 
            style={{ padding: "0.5rem 1.5rem", background: "#fff", color: "#1a1a18", border: "1px solid #1a1a18", cursor: "pointer" }}
          >
            + Add Slide
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: "2rem" }}>
        {slides.map((slide, index) => (
          <div key={slide.id} style={{ background: "#f9f9f9", padding: "1.5rem", borderRadius: "8px", display: "flex", gap: "2rem" }}>
            
            {/* Media Section */}
            <div style={{ width: "350px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              
              {/* Desktop Image */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Desktop Image</span>
                <div style={{ width: "100%", aspectRatio: "3/4", background: "#eee", position: "relative", overflow: "hidden" }}>
                  {slide.image ? (
                    <Image src={slide.image} alt="Desktop" fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", fontSize: "0.8rem" }}>No Image</div>
                  )}
                  {uploadingMedia?.id === slide.id && uploadingMedia?.field === "image" && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>Uploading...</div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleMediaUpload(slide.id, "image", e.target.files[0])} style={{ fontSize: "0.7rem" }} />
              </div>

              {/* Desktop Video */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Desktop Video</span>
                <div style={{ width: "100%", aspectRatio: "3/4", background: "#eee", position: "relative", overflow: "hidden" }}>
                  {slide.video ? (
                    <video src={slide.video} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", fontSize: "0.8rem" }}>No Video</div>
                  )}
                  {uploadingMedia?.id === slide.id && uploadingMedia?.field === "video" && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>Uploading...</div>
                  )}
                </div>
                <input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && handleMediaUpload(slide.id, "video", e.target.files[0])} style={{ fontSize: "0.7rem" }} />
              </div>

              {/* Mobile Image */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Mobile Image</span>
                <div style={{ width: "100%", aspectRatio: "9/16", background: "#eee", position: "relative", overflow: "hidden" }}>
                  {slide.mobileImage ? (
                    <Image src={slide.mobileImage} alt="Mobile" fill style={{ objectFit: "cover" }} />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", fontSize: "0.8rem" }}>No Image</div>
                  )}
                  {uploadingMedia?.id === slide.id && uploadingMedia?.field === "mobileImage" && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>Uploading...</div>
                  )}
                </div>
                <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && handleMediaUpload(slide.id, "mobileImage", e.target.files[0])} style={{ fontSize: "0.7rem" }} />
              </div>

              {/* Mobile Video */}
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.75rem", fontWeight: 600 }}>Mobile Video</span>
                <div style={{ width: "100%", aspectRatio: "9/16", background: "#eee", position: "relative", overflow: "hidden" }}>
                  {slide.mobileVideo ? (
                    <video src={slide.mobileVideo} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted />
                  ) : (
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#999", fontSize: "0.8rem" }}>No Video</div>
                  )}
                  {uploadingMedia?.id === slide.id && uploadingMedia?.field === "mobileVideo" && (
                    <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>Uploading...</div>
                  )}
                </div>
                <input type="file" accept="video/*" onChange={(e) => e.target.files?.[0] && handleMediaUpload(slide.id, "mobileVideo", e.target.files[0])} style={{ fontSize: "0.7rem" }} />
              </div>

            </div>

            {/* Form Section */}
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>Slide Order / ID</label>
                <input 
                  value={slide.id} 
                  onChange={(e) => handleUpdateSlide(slide.id, "id", e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}
                />
                <p style={{ fontSize: "0.75rem", color: "#666", marginTop: "0.25rem" }}>Used for the URL: /collections/this-id</p>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>Collection Name</label>
                <input 
                  value={slide.name} 
                  onChange={(e) => handleUpdateSlide(slide.id, "name", e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>Subtitle</label>
                <input 
                  value={slide.subtitle} 
                  onChange={(e) => handleUpdateSlide(slide.id, "subtitle", e.target.value)}
                  style={{ width: "100%", padding: "0.75rem", border: "1px solid #ccc", borderRadius: "4px" }}
                />
              </div>

              <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
                <button 
                  onClick={() => handleDeleteSlide(slide.id)}
                  style={{ padding: "0.5rem 1rem", background: "#fee", color: "#c00", border: "1px solid #fcc", cursor: "pointer", borderRadius: "4px" }}
                >
                  Delete Slide
                </button>
              </div>
            </div>

          </div>
        ))}
        {slides.length === 0 && (
          <div style={{ textAlign: "center", padding: "4rem", color: "#666" }}>
            No slides yet. Click "Add Slide" to begin.
          </div>
        )}
      </div>
    </div>
  );
}
