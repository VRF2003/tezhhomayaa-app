"use client";

import { useState, useEffect, useRef, KeyboardEvent } from "react";

interface TagEditorProps {
  tags: string[];
  onChange: (newTags: string[]) => void;
}

export default function TagEditor({ tags, onChange }: TagEditorProps) {
  const [inputValue, setInputValue] = useState("");
  const [globalTags, setGlobalTags] = useState<{ id: string; name: string }[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/tags")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setGlobalTags(data.data);
        }
      })
      .catch(console.error);
      
    // Click outside handler
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    
    if (val.trim()) {
      const filtered = globalTags
        .filter(t => t.name.includes(val.trim().toLowerCase()) && !tags.includes(t.name))
        .map(t => t.name);
      setSuggestions(filtered);
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!normalized || tags.includes(normalized)) return;
    
    onChange([...tags, normalized]);
    setInputValue("");
    setShowDropdown(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter(t => t !== tagToRemove));
  };

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <div style={{
        display: "flex", flexWrap: "wrap", gap: "0.5rem",
        padding: "0.5rem", border: "1px solid #ccc9c4", borderRadius: "2px",
        minHeight: "48px", background: "#fff", alignItems: "center"
      }}>
        {tags.map(tag => (
          <span key={tag} style={{
            display: "inline-flex", alignItems: "center", gap: "0.25rem",
            background: "#f0ede8", padding: "0.25rem 0.5rem",
            borderRadius: "2px", fontSize: "0.8rem", color: "#1a1a18"
          }}>
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                padding: 0, color: "#6b6865", fontSize: "1rem", lineHeight: 1
              }}
            >
              &times;
            </button>
          </span>
        ))}
        
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (inputValue.trim()) setShowDropdown(true); }}
          placeholder={tags.length === 0 ? "Add tags (press Enter, Tab, or Comma)" : ""}
          style={{
            flex: 1, border: "none", outline: "none", fontSize: "0.9rem",
            minWidth: "150px", padding: "0.25rem"
          }}
        />
      </div>

      {showDropdown && (suggestions.length > 0 || inputValue.trim()) && (
        <div style={{
          position: "absolute", top: "100%", left: 0, right: 0,
          background: "#fff", border: "1px solid #ccc9c4", borderTop: "none",
          maxHeight: "200px", overflowY: "auto", zIndex: 10,
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        }}>
          {suggestions.map(s => (
            <div
              key={s}
              onClick={() => addTag(s)}
              style={{
                padding: "0.75rem", cursor: "pointer", fontSize: "0.85rem",
                borderBottom: "1px solid #f0ede8"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fcfbf9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              {s}
            </div>
          ))}
          {!suggestions.includes(inputValue.trim().toLowerCase()) && inputValue.trim() && (
            <div
              onClick={() => addTag(inputValue)}
              style={{
                padding: "0.75rem", cursor: "pointer", fontSize: "0.85rem",
                color: "#7c2a00", fontStyle: "italic"
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#fcfbf9")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
            >
              Add new tag: "{inputValue.trim().toLowerCase()}"
            </div>
          )}
        </div>
      )}
    </div>
  );
}
