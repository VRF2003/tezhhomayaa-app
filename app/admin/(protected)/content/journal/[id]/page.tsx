"use client";

import { LivePreviewBuilder } from "@/components/admin/LivePreviewBuilder";
import { useParams } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { Observability } from "@/lib/infrastructure/observability";

const STATUS_OPTIONS = ["Draft", "Published", "Scheduled", "Archived", "Private", "Members Only"] as const;
const CATEGORY_OPTIONS = ["Editorial", "Campaign", "Lookbook", "Interview", "Travel Diary", "Fashion Week", "Philosophy", "Collection Launch", "Behind The Scenes", "Product Story", "Visual Essay"];

export default function JournalEditorPage() {
  const params = useParams();
  const id = params.id as string;

  const [article, setArticle] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [showSettings, setShowSettings] = useState(false);

  // For image upload previews
  const heroInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/journal/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success && data.article) {
          setArticle(data.article);
        }
      })
      .catch(() => {});
  }, [id]);

  const handleMetaSave = async () => {
    if (!article) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/journal/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: article.title,
          subtitle: article.subtitle,
          slug: article.slug,
          category: article.category,
          author: article.author,
          status: article.status,
          featured: article.featured,
          heroImage: article.heroImage,
          thumbnailImage: article.thumbnailImage,
          seo: article.seo,
        })
      });
      const data = await res.json();
      if (data.success) {
        setSaveMsg("Saved!");
        setTimeout(() => setSaveMsg(""), 2000);
      }
    } catch (e) {}
    setSaving(false);
  };

  const handleImageUpload = async (file: File, field: "heroImage" | "thumbnailImage") => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setArticle((prev: any) => ({
          ...prev,
          [field]: { url: data.url, alt: prev.title || "" }
        }));
      } else {
        Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Upload failed:", data.error);
      }
    } catch (e) {
      Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Upload exception", e);
    }
  };

  if (!article) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-sm text-gray-400 uppercase tracking-widest">Loading Article…</div>
    </div>
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-gray-200 bg-white z-50 flex-shrink-0">
        <div className="flex items-center gap-4">
          <a href="/admin/content/journal" className="text-xs uppercase tracking-widest text-gray-400 hover:text-gray-900 transition-colors">← Journal</a>
          <span className="text-gray-200">|</span>
          <h1 className="text-sm font-medium text-[#1a1a18] truncate max-w-xs">{article.title}</h1>
          <span className={`px-2 py-0.5 text-[10px] uppercase tracking-widest rounded-sm font-medium ${article.status === "Published" ? "bg-green-100 text-green-800" : article.status === "Archived" ? "bg-gray-100 text-gray-600" : "bg-amber-100 text-amber-800"}`}>
            {article.status}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowSettings(v => !v)}
            className={`px-4 py-2 text-xs uppercase tracking-widest border transition-colors ${showSettings ? "bg-[#1a1a18] text-white border-[#1a1a18]" : "border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900"}`}
          >
            ⚙ Settings
          </button>
          <a
            href={`/journal/${article.slug}?preview=true`}
            target="_blank"
            className="px-4 py-2 text-xs uppercase tracking-widest border border-gray-300 text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
          >
            ↗ Preview
          </a>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Settings sidebar */}
        {showSettings && (
          <aside className="w-80 flex-shrink-0 bg-white border-r border-gray-200 overflow-y-auto">
            <div className="p-6 space-y-6">
              <h2 className="text-xs uppercase tracking-[0.2em] font-semibold text-gray-500">Article Settings</h2>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Publication Status</label>
                <select
                  value={article.status}
                  onChange={e => setArticle((p: any) => ({ ...p, status: e.target.value }))}
                  className="w-full border border-gray-200 px-3 py-2 text-sm text-[#1a1a18] focus:outline-none focus:border-gray-900 rounded-sm bg-white"
                >
                  {STATUS_OPTIONS.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <p className="text-[10px] text-gray-400">Only "Published" articles appear on the storefront.</p>
              </div>

              {/* Featured */}
              <div className="flex items-center justify-between py-2 border-t border-gray-100">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Featured</div>
                  <div className="text-[10px] text-gray-400 mt-0.5">Pin to top of journal</div>
                </div>
                <button
                  onClick={() => setArticle((p: any) => ({ ...p, featured: !p.featured }))}
                  className={`w-10 h-5 rounded-full transition-colors relative ${article.featured ? "bg-[#1a1a18]" : "bg-gray-200"}`}
                >
                  <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${article.featured ? "translate-x-5" : "translate-x-0.5"}`} />
                </button>
              </div>

              {/* Title */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Title</label>
                <input
                  type="text"
                  value={article.title || ""}
                  onChange={e => setArticle((p: any) => ({ ...p, title: e.target.value }))}
                  className="w-full border border-gray-200 px-3 py-2 text-sm text-[#1a1a18] focus:outline-none focus:border-gray-900 rounded-sm"
                />
              </div>

              {/* Subtitle */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Subtitle</label>
                <input
                  type="text"
                  value={article.subtitle || ""}
                  onChange={e => setArticle((p: any) => ({ ...p, subtitle: e.target.value }))}
                  className="w-full border border-gray-200 px-3 py-2 text-sm text-[#1a1a18] focus:outline-none focus:border-gray-900 rounded-sm"
                />
              </div>

              {/* Slug */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">URL Slug</label>
                <input
                  type="text"
                  value={article.slug || ""}
                  onChange={e => setArticle((p: any) => ({ ...p, slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }))}
                  className="w-full border border-gray-200 px-3 py-2 text-sm text-[#1a1a18] font-mono focus:outline-none focus:border-gray-900 rounded-sm"
                />
                <p className="text-[10px] text-gray-400">/journal/{article.slug}</p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Category</label>
                <select
                  value={article.category || "Editorial"}
                  onChange={e => setArticle((p: any) => ({ ...p, category: e.target.value }))}
                  className="w-full border border-gray-200 px-3 py-2 text-sm text-[#1a1a18] focus:outline-none focus:border-gray-900 rounded-sm bg-white"
                >
                  {CATEGORY_OPTIONS.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Author */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Author</label>
                <input
                  type="text"
                  value={article.author || ""}
                  onChange={e => setArticle((p: any) => ({ ...p, author: e.target.value }))}
                  className="w-full border border-gray-200 px-3 py-2 text-sm text-[#1a1a18] focus:outline-none focus:border-gray-900 rounded-sm"
                />
              </div>

              {/* Thumbnail Image */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Thumbnail Image</label>
                <p className="text-[10px] text-gray-400">Used on journal listing pages and homepage cards.</p>
                {article.thumbnailImage?.url && (
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden rounded-sm">
                    <img src={article.thumbnailImage.url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setArticle((p: any) => ({ ...p, thumbnailImage: { url: "", alt: "" } }))}
                      className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-sm hover:bg-black"
                    >Remove</button>
                  </div>
                )}
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Paste image URL…"
                    value={article.thumbnailImage?.url || ""}
                    onChange={e => setArticle((p: any) => ({ ...p, thumbnailImage: { url: e.target.value, alt: p.title || "" } }))}
                    className="w-full border border-gray-200 px-3 py-2 text-xs text-[#1a1a18] focus:outline-none focus:border-gray-900 rounded-sm font-mono"
                  />
                  <button
                    onClick={() => thumbInputRef.current?.click()}
                    className="w-full py-2 border border-dashed border-gray-300 text-[10px] uppercase tracking-widest text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors rounded-sm"
                  >
                    ↑ Upload Thumbnail
                  </button>
                  <input ref={thumbInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0], "thumbnailImage"); }} />
                </div>
              </div>

              {/* Hero / Banner Image */}
              <div className="space-y-2 pt-4 border-t border-gray-100">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">Hero / Banner Image</label>
                <p className="text-[10px] text-gray-400">Displayed at the top of the article page as the main banner.</p>
                {article.heroImage?.url && (
                  <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden rounded-sm">
                    <img src={article.heroImage.url} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => setArticle((p: any) => ({ ...p, heroImage: { url: "", alt: "" } }))}
                      className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-sm hover:bg-black"
                    >Remove</button>
                  </div>
                )}
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Paste image URL…"
                    value={article.heroImage?.url || ""}
                    onChange={e => setArticle((p: any) => ({ ...p, heroImage: { url: e.target.value, alt: p.title || "" } }))}
                    className="w-full border border-gray-200 px-3 py-2 text-xs text-[#1a1a18] focus:outline-none focus:border-gray-900 rounded-sm font-mono"
                  />
                  <button
                    onClick={() => heroInputRef.current?.click()}
                    className="w-full py-2 border border-dashed border-gray-300 text-[10px] uppercase tracking-widest text-gray-500 hover:border-gray-900 hover:text-gray-900 transition-colors rounded-sm"
                  >
                    ↑ Upload Hero Image
                  </button>
                  <input ref={heroInputRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0], "heroImage"); }} />
                </div>
              </div>

              {/* SEO */}
              <div className="space-y-3 pt-4 border-t border-gray-100">
                <label className="text-[10px] uppercase tracking-widest text-gray-500 font-medium">SEO</label>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400">Meta Title</p>
                  <input
                    type="text"
                    value={article.seo?.title || ""}
                    onChange={e => setArticle((p: any) => ({ ...p, seo: { ...p.seo, title: e.target.value } }))}
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-gray-900 rounded-sm"
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] text-gray-400">Meta Description</p>
                  <textarea
                    rows={3}
                    value={article.seo?.description || ""}
                    onChange={e => setArticle((p: any) => ({ ...p, seo: { ...p.seo, description: e.target.value } }))}
                    className="w-full border border-gray-200 px-3 py-2 text-xs focus:outline-none focus:border-gray-900 rounded-sm resize-none"
                  />
                </div>
              </div>

              {/* Save button */}
              <div className="pt-4 pb-8">
                <button
                  onClick={handleMetaSave}
                  disabled={saving}
                  className="w-full py-3 bg-[#1a1a18] text-white text-xs uppercase tracking-widest hover:bg-black transition-colors disabled:opacity-50"
                >
                  {saving ? "Saving…" : saveMsg ? `✓ ${saveMsg}` : "Save Settings"}
                </button>
              </div>
            </div>
          </aside>
        )}

        {/* Main canvas — takes remaining space */}
        <div className="flex-1 overflow-hidden">
          <LivePreviewBuilder
            apiEndpoint={`/api/journal/${id}`}
            pageTitle={`Journal: ${article.title}`}
            backUrl="/admin/content/journal"
            previewUrl={`/journal/${article.slug}?preview=true`}
          />
        </div>
      </div>
    </div>
  );
}
