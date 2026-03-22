"use client";

import { Suspense, useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import MarkdownEditor from "@/components/MarkdownEditor";
import TemplateSelector from "@/components/TemplateSelector";
import PreviewFrame from "@/components/PreviewFrame";

function useProStatus() {
  const searchParams = useSearchParams();
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    // Check localStorage first
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("rtl_pro");
      if (stored === "true") {
        setIsPro(true);
      }
    }

    // Check if returning from Stripe success
    if (searchParams.get("upgraded") === "true" && searchParams.get("session_id")) {
      setIsPro(true);
      if (typeof window !== "undefined") {
        localStorage.setItem("rtl_pro", "true");
        // Clean URL
        window.history.replaceState({}, "", "/app");
      }
    }
  }, [searchParams]);

  return isPro;
}

export default function AppPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-gray-100"><div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" /></div>}>
      <AppPageInner />
    </Suspense>
  );
}

function AppPageInner() {
  const [markdown, setMarkdown] = useState("");
  const [templateId, setTemplateId] = useState("minimal");
  const [generatedHtml, setGeneratedHtml] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const isPro = useProStatus();

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

  const handleCheckout = useCallback(async () => {
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Payment not configured yet. Please try again later.");
      }
    } catch {
      alert("Failed to connect. Please try again.");
    }
  }, []);

  const handleProClick = useCallback(() => {
    setShowUpgradeModal(true);
  }, []);

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
          {isPro ? (
            <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-bold text-brand-700">
              PRO
            </span>
          ) : (
            <button
              onClick={handleProClick}
              className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700 hover:bg-amber-200 transition-colors"
            >
              Upgrade to Pro
            </button>
          )}
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
          <TemplateSelector
            selected={templateId}
            onSelect={setTemplateId}
            isPro={isPro}
            onProClick={handleProClick}
          />
        </aside>

        {/* Center: Markdown Editor */}
        <div className="flex w-1/2 flex-col border-r border-gray-200 bg-white lg:w-2/5">
          {/* Mobile template selector */}
          <div className="border-b border-gray-200 px-4 py-2 lg:hidden">
            <label className="text-xs font-medium text-gray-500">Template: </label>
            <select
              value={templateId}
              onChange={(e) => {
                const val = e.target.value;
                if (!isPro && ["startup", "saas", "portfolio"].includes(val)) {
                  handleProClick();
                  return;
                }
                setTemplateId(val);
              }}
              className="ml-1 rounded border border-gray-300 px-2 py-1 text-xs"
            >
              <option value="minimal">Minimal</option>
              <option value="developer">Developer</option>
              <option value="startup">Startup {!isPro ? "(Pro)" : ""}</option>
              <option value="saas">SaaS {!isPro ? "(Pro)" : ""}</option>
              <option value="portfolio">Portfolio {!isPro ? "(Pro)" : ""}</option>
            </select>
          </div>
          <MarkdownEditor value={markdown} onChange={setMarkdown} />
        </div>

        {/* Right: Preview */}
        <div className="flex-1 bg-white">
          <PreviewFrame
            html={generatedHtml}
            isLoading={isLoading}
            isPro={isPro}
            onProClick={handleProClick}
          />
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="mx-4 w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-100">
                <svg className="h-7 w-7 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">Upgrade to Pro</h3>
              <p className="mt-2 text-sm text-gray-500">One-time payment. Unlimited use. Forever.</p>
            </div>

            <div className="mt-6 space-y-3">
              {[
                "All 5 premium templates (Startup, SaaS, Portfolio)",
                "No watermark on downloads",
                "Copy clean HTML to clipboard",
                "Unlimited generations",
                "Future template updates",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <svg className="h-5 w-5 shrink-0 text-brand-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={handleCheckout}
                className="w-full rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white transition-colors hover:bg-brand-500"
              >
                Get Pro — $29 one-time
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full rounded-xl py-2.5 text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors"
              >
                Continue with free plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
