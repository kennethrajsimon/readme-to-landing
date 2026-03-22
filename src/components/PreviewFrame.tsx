"use client";

import { useRef, useCallback } from "react";

interface PreviewFrameProps {
  html: string;
  isLoading: boolean;
}

export default function PreviewFrame({ html, isLoading }: PreviewFrameProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const downloadHtml = useCallback(() => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "landing-page.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [html]);

  const copyHtml = useCallback(() => {
    if (!html) return;
    navigator.clipboard.writeText(html).then(() => {
      // Brief visual feedback could be added here
    });
  }, [html]);

  const openInNewTab = useCallback(() => {
    if (!html) return;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }, [html]);

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

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <h3 className="text-sm font-semibold text-gray-700">Preview</h3>
        <div className="flex gap-2">
          <button
            onClick={copyHtml}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
            title="Copy HTML to clipboard"
          >
            Copy HTML
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
            title="Download HTML file"
          >
            Download
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-hidden bg-white">
        <iframe
          ref={iframeRef}
          srcDoc={html}
          className="h-full w-full border-0"
          sandbox="allow-scripts"
          title="Landing page preview"
        />
      </div>
    </div>
  );
}
