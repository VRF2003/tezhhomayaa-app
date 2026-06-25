"use client";

import React, { useState } from "react";
import { normalizeSectionData } from "@/lib/types/homepage";

export default function ContactForm({ cmsData, sectionId }: { cmsData: any; sectionId: string }) {
  const data = normalizeSectionData(cmsData);
  const { content, layout, style, contactForm } = data;
  
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  if (!contactForm?.enabled) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Mocking an API call
    setTimeout(() => setStatus("success"), 1000);
  };

  return (
    <section 
      id={sectionId} 
      className="w-full relative flex flex-col items-center justify-center bg-white"
      style={{ 
        padding: layout.desktop.padding || "6rem 2rem",
      }}
    >
      <div 
        className="w-full relative z-10 flex flex-col"
        style={{
          width: `${layout.desktop.textWidth || 60}%`,
          maxWidth: "800px"
        }}
      >
        {content.heading && (
          <h2 
            className="tracking-widest uppercase font-serif text-center mb-12"
            style={{ 
              fontSize: `${style.heading.fontSize}rem`,
              fontWeight: style.heading.fontWeight,
              color: style.heading.textColor,
            }}
          >
            {content.heading}
          </h2>
        )}

        {status === "success" ? (
          <div className="text-center p-12 border border-gray-200 bg-gray-50">
            <h3 className="font-serif text-2xl mb-4">Message Sent</h3>
            <p className="font-light">{contactForm.successMessage}</p>
            <button 
              onClick={() => setStatus("idle")}
              className="mt-8 border-b border-black pb-1 uppercase tracking-widest text-xs"
            >
              Send Another
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest mb-2 opacity-70">Name</label>
                <input required type="text" className="border-b border-gray-300 p-2 outline-none focus:border-black transition-colors bg-transparent" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest mb-2 opacity-70">Email</label>
                <input required type="email" className="border-b border-gray-300 p-2 outline-none focus:border-black transition-colors bg-transparent" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest mb-2 opacity-70">Country</label>
                <input required type="text" className="border-b border-gray-300 p-2 outline-none focus:border-black transition-colors bg-transparent" />
              </div>
              <div className="flex flex-col">
                <label className="text-xs uppercase tracking-widest mb-2 opacity-70">Subject</label>
                <select required defaultValue="" className="border-b border-gray-300 p-2 outline-none focus:border-black transition-colors bg-transparent appearance-none">
                  <option value="" disabled>Select an option</option>
                  {(contactForm.subjects || []).map((sub: string) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col mt-4">
              <label className="text-xs uppercase tracking-widest mb-2 opacity-70">Message</label>
              <textarea required rows={4} className="border-b border-gray-300 p-2 outline-none focus:border-black transition-colors bg-transparent resize-none"></textarea>
            </div>

            <div className="flex justify-center mt-8">
              {content.primaryButton?.label && (
                <button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className="uppercase tracking-widest hover:opacity-70 transition-opacity disabled:opacity-50"
                  style={{
                    fontSize: `${style.button.fontSize}rem`,
                    fontWeight: style.button.fontWeight,
                    padding: style.button.padding,
                    backgroundColor: style.button.backgroundColor,
                    color: style.button.textColor,
                  }}
                >
                  {status === "submitting" ? "Sending..." : content.primaryButton.label}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
