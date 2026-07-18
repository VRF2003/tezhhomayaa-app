"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { JournalArticle } from "@/lib/types/journal";
import { useDateFormatter } from "@/lib/global-experience/formatters";

export default function JournalDashboard() {
  const [articles, setArticles] = useState<JournalArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const dateFormatter = useDateFormatter();

  useEffect(() => {
    fetch("/api/journal")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setArticles(data.articles);
        } else {
          setError(data.error || "Failed to load");
        }
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/journal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: "New Article" })
      });
      const data = await res.json();
      if (data.success) {
        window.location.href = `/admin/content/journal/${data.article.id}`;
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this article?")) return;
    try {
      const res = await fetch(`/api/journal/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setArticles(articles.filter(a => a.id !== id));
      } else {
        alert(data.error);
      }
    } catch (err: any) {
      alert(err.message);
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newArticles = [...articles];
    [newArticles[index - 1], newArticles[index]] = [newArticles[index], newArticles[index - 1]];
    setArticles(newArticles);
    saveOrder(newArticles);
  };

  const moveDown = async (index: number) => {
    if (index === articles.length - 1) return;
    const newArticles = [...articles];
    [newArticles[index + 1], newArticles[index]] = [newArticles[index], newArticles[index + 1]];
    setArticles(newArticles);
    saveOrder(newArticles);
  };

  const saveOrder = async (newArticles: JournalArticle[]) => {
    try {
      const orderedIds = newArticles.map(a => a.id);
      await fetch("/api/journal/reorder", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds })
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/admin/content" className="text-xs tracking-widest uppercase text-gray-500 hover:text-gray-900 mb-2 block">
            ← Back to Content
          </Link>
          <h1 className="text-3xl font-light text-[#1a1a18]">Journal CMS</h1>
          <p className="text-sm text-gray-500 mt-2">Manage editorial stories and campaigns</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-[#1a1a18] text-[#f7f5f2] px-6 py-3 text-xs tracking-[0.15em] uppercase hover:bg-black transition-colors"
        >
          Create Story
        </button>
      </div>

      {loading ? (
        <div className="text-gray-500">Loading stories...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : articles.length === 0 ? (
        <div className="border border-dashed border-gray-300 p-12 text-center text-gray-500">
          No stories found. Create your first editorial piece.
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-sm overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 p-4 text-xs font-semibold tracking-wider text-gray-600 uppercase">
            <div className="w-16">Order</div>
            <div>Title</div>
            <div>Status</div>
            <div>Category</div>
            <div>Date</div>
            <div className="text-right">Actions</div>
          </div>
          <div className="divide-y divide-gray-200">
            {articles.map((article, idx) => (
              <div key={article.id} className="grid grid-cols-[auto_2fr_1fr_1fr_1fr_auto] gap-4 p-4 items-center text-sm text-gray-800 hover:bg-gray-50 transition-colors">
                <div className="w-16 flex gap-1 text-gray-400">
                  <button onClick={() => moveUp(idx)} disabled={idx === 0} className="hover:text-black disabled:opacity-30">↑</button>
                  <button onClick={() => moveDown(idx)} disabled={idx === articles.length - 1} className="hover:text-black disabled:opacity-30">↓</button>
                </div>
                <div className="font-medium truncate pr-4">{article.title}</div>
                <div>
                  <span className={`px-2 py-1 text-xs rounded-sm ${article.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    {article.status}
                  </span>
                </div>
                <div>{article.category || "—"}</div>
                <div className="text-gray-500">{dateFormatter.formatDate(article.publishDate)}</div>
                <div className="flex justify-end gap-3 text-xs uppercase tracking-wider">
                  <Link href={`/admin/content/journal/${article.id}`} className="text-blue-600 hover:underline">Edit</Link>
                  <button onClick={() => handleDelete(article.id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
