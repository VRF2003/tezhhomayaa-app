"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

type MediaFile = {
  name: string;
  url: string;
  size: number;
  type: string;
  created: number;
};

export default function MediaLibraryPage() {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/media");
      const data = await res.json();
      if (data.success) {
        setFiles(data.files);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadMedia();
  }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    setUploading(true);
    
    const formData = new FormData();
    // Allow multiple files
    for (let i = 0; i < e.target.files.length; i++) {
      formData.append("file", e.target.files[i]);
    }

    try {
      await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      // reload media
      await loadMedia();
    } catch (err) {
      console.error(err);
      alert("Failed to upload");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) return;
    try {
      const res = await fetch(`/api/media?file=${encodeURIComponent(fileName)}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setFiles(files.filter(f => f.name !== fileName));
      } else {
        alert(data.error);
      }
    } catch (err) {
      alert("Failed to delete");
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert("Copied URL: " + url);
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "clamp(1.8rem, 2vw, 2.2rem)", fontWeight: 300, color: "#1a1a18", margin: "0 0 0.5rem", letterSpacing: "0.02em" }}>
            Global Media Library
          </h1>
          <p style={{ fontSize: "0.9rem", color: "#7a7874", margin: 0 }}>
            Upload and manage assets for banners, collections, and products.
          </p>
        </div>
        <div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            style={{ display: "none" }} 
            multiple
            accept="image/*,video/*"
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            style={{
              padding: "0.85rem 2rem",
              background: "#1a1a18",
              color: "#fff",
              border: "none",
              cursor: uploading ? "not-allowed" : "pointer",
              fontFamily: "var(--font-dm-mono, monospace)",
              fontSize: "0.75rem",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              opacity: uploading ? 0.7 : 1
            }}
          >
            {uploading ? "Uploading..." : "Upload Media"}
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading media...</p>
      ) : files.length === 0 ? (
        <div style={{ padding: "4rem", textAlign: "center", background: "#fff", border: "1px dashed #ccc9c4" }}>
          <p style={{ color: "#9a9690", fontSize: "0.9rem" }}>No media files uploaded yet.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1.5rem"
        }}>
          {files.map(file => (
            <div key={file.name} style={{ background: "#fff", border: "1px solid #e8e4df", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ position: "relative", width: "100%", paddingBottom: "100%", background: "#f0ede9" }}>
                {file.type.startsWith("video/") || file.name.endsWith(".mp4") ? (
                  <video src={file.url} style={{ position: "absolute", width: "100%", height: "100%", objectFit: "cover" }} controls />
                ) : (
                  <Image src={file.url} alt={file.name} fill style={{ objectFit: "cover" }} />
                )}
              </div>
              <div style={{ padding: "1rem" }}>
                <p style={{ fontSize: "0.75rem", color: "#1a1a18", fontWeight: 500, margin: "0 0 0.25rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }} title={file.name}>
                  {file.name}
                </p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <p style={{ fontSize: "0.65rem", color: "#9a9690", margin: 0 }}>
                    {(file.size / 1024).toFixed(1)} KB
                  </p>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button onClick={() => copyToClipboard(file.url)} style={{ background: "none", border: "none", cursor: "pointer", color: "#1a1a18", fontSize: "0.65rem", padding: "0.2rem" }}>Copy</button>
                    <button onClick={() => handleDelete(file.name)} style={{ background: "none", border: "none", cursor: "pointer", color: "#d32f2f", fontSize: "0.65rem", padding: "0.2rem" }}>Del</button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
