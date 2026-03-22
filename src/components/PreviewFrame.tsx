"use client";

import { useRef, useCallback, useState } from "react";

interface PreviewFrameProps {
  html: string;
  isLoading: boolean;
  isPro: boolean;
  onProClick: () => void;
}

const WATERMARK_HTML = `
<div style="position:fixed;bottom:0;left:0;right:0;z-index:99999;background:linear-gradient(135deg,#0a0e27,#111535);padding:10px 20px;text-align:center;font-family:system-ui,sans-serif;border-top:2px solid #00f0ff;">
  <a href="https://readme-to-landing.netlify.app" target="_blank" rel="noopener" style="color:#00f0ff;text-decoration:none;font-size:13px;font-weight:600;letter-spacing:0.5px;">
    Built with README to Landing — Turn your README into a landing page in seconds
  </a>
</div>`;

function injectWatermark(html: string): string {
  if (html.includes("</body>")) {
    return html.replace("</body>", WATERMARK_HTML + "</body>");
  }
  return html + WATERMARK_HTML;
}

export default function PreviewFrame({ html, isLoading, isPro, onProClick }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const getExportHtml = useCallback(() => {
    if (isPro) return html;
    return injectWatermark(html);
  }, [html, isPro]);

  const downloadHtml = useCallback(() => {
    if (!html) return;
    const exportHtml = getExportHtml();
    const blob = new Blob([exportHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "landing-page.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  }, [html, getExportHtml]);

  const copyHtml = useCallback(() => {
    if (!html) return;
    if (!isPro) {
      onProClick();
      return;
    }
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [html, isPro, onProClick]);

  const openInNewTab = useCallback(() => {
    if (!html) return;
    const exportHtml = getExportHtml();
    const blob = new Blob([exportHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }, [html, getExportHtml]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
          <p className="text-sm text-gray-500">Generating your landing page...</p>
        </div>
      </div>
    );
  }

  if (!html) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <svg className="mx-auto mb-4 h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p className="text-sm font-medium text-gray-500">Preview will appear here</p>
          <p className="mt-1 text-xs text-gray-400">Paste markdown and click Generate</p>
        </div>
      </div>
    );
  }

  // Show watermarked version in preview for free users
  const previewHtml = isPro ? html : injectWatermark(html);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-700">Preview</h3>
          {!isPro && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700">
              FREE — watermarked
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyHtml}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
              isPro
                ? "bg-gray-100 text-gray-600 hover:bg-gray-200"
                : "bg-gray-100 text-gray-400 hover:bg-amber-50 hover:text-amber-700"
            }`}
            title={isPro ? "Copy HTML to clipboard" : "Upgrade to Pro to copy clean HTML"}
          >
            {copied ? "Copied!" : isPro ? "Copy HTML" : "Copy HTML (Pro)"}
          </button>
          <button
            onClick={openInNewTab}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            title="Open in new tab"
          >
            New Tab
          </button>
          <button
            onClick={downloadHtml}
            className="rounded-md bg-brand-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-500 transition-colors"
            title={isPro ? "Download clean HTML" : "Download HTML (with watermark)"}
          >
            {downloaded ? "Downloaded!" : "Download"}
          </button>
          {!isPro && (
            <button
              onClick={onProClick}
              className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-amber-400 transition-colors"
            >
              Remove Watermark — $29
            </button>
          )}
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          srcDoc={previewHtml}
          className="h-full w-full border-0"
          sandbox="allow-scripts"
          title="Landing page preview"
        />
      </div>
    </div>
  );
}
