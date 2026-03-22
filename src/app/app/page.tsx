"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import MarkdownEditor from "@/components/MarkdownEditor";
import TemplateSelector from "@/components/TemplateSelector";
import PreviewFrame from "@/components/PreviewFrame";

export default function AppPage() {
  const [markdown, setMarkdown] = useState("");
  const [templateId, setTemplateId] = useState("minimal");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!markdown.trim()) {
      setError("Please paste some markdown content first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ markdown, templateId }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to generate. Please try again.");
        return;
      }

      setGeneratedHtml(data.html);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }, [markdown, templateId]);

  return (
    <div className="flex h-screen flex-col bg-gray-100">
      {/* App Header */}
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-4 py-3">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
              R
            </span>
            README to Landing
          </Link>
          <span className="hidden rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500 sm:inline">
            App
          </span>
        </div>

        <div className="flex items-center gap-3">
          {error && (
            <span className="hidden text-xs text-red-500 sm:inline">{error}</span>
          )}
          <button
            onClick={handleGenerate}
            disabled={isLoading || !markdown.trim()}
            className="rounded-lg bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition-all hover:bg-brand-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Generating...
              </span>
            ) : (
              "Generate Landing Page"
            )}
          </button>
        </div>
      </header>

      {/* Mobile error */}
      {error && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600 sm:hidden">
          {error}
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar: Template Selector */}
        <aside className="hidden w-56 shrink-0 overflow-y-auto border-r border-gray-200 bg-white lg:block">
          <TemplateSelector selected={templateId} onSelect={setTemplateId} />
        </aside>

        {/* Center: Markdown Editor */}
        <div className="flex w-1/2 flex-col border-r border-gray-200 bg-white lg:w-2/5">
          {/* Mobile template selector */}
          <div className="border-b border-gray-200 px-4 py-2 lg:hidden">
            <label className="text-xs font-medium text-gray-500">Template: </label>
            <select
              value={templateId}
              onChange={(e) => setTemplateId(e.target.value)}
              className="ml-1 rounded border border-gray-300 px-2 py-1 text-xs"
            >
              <option value="minimal">Minimal</option>
              <option value="developer">Developer</option>
              <option value="startup">Startup</option>
              <option value="saas">SaaS</option>
              <option value="portfolio">Portfolio</option>
            </select>
          </div>
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
        </div>

        {/* Right: Preview */}
        <div className="flex-1 bg-white">
          <PreviewFrame html={generatedHtml} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
