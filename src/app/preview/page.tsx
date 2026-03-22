"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

function PreviewContent() {
  const searchParams = useSearchParams();
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    // Try to get HTML from sessionStorage (set by the app page)
    const storedHtml = sessionStorage.getItem("preview-html");
    if (storedHtml) {
      setHtml(storedHtml);
    }
  }, []);

  if (!html) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-xl font-bold text-gray-800">No Preview Available</h1>
          <p className="mt-2 text-gray-500">
            Generate a landing page from the{" "}
            <a href="/app" className="text-brand-600 hover:underline">
              app
            </a>{" "}
            first.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen">
      <iframe
        srcDoc={html}
        className="h-full w-full border-0"
        sandbox="allow-scripts"
        title="Landing page preview"
      />
    </div>
  );
}

export default function PreviewPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        </div>
      }
    >
      <PreviewContent />
    </Suspense>
  );
}
