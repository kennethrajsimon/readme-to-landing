"use client";

import { useState } from "react";

export default function PricingSection() {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);
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
        alert(data.error || "Failed to start checkout. Please try again.");
      }
    } catch {
      alert("Failed to connect. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pricing" className="bg-gray-50 py-24">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Simple, fair pricing
          </h2>
          <p className="mt-4 text-lg text-gray-600">
            Start free. Upgrade when you need more.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {/* Free Plan */}
          <div className="rounded-2xl border-2 border-gray-200 bg-white p-8">
            <h3 className="text-lg font-semibold text-gray-900">Free</h3>
            <p className="mt-2 text-sm text-gray-500">Perfect for trying it out</p>
            <div className="mt-6">
              <span className="text-5xl font-bold tracking-tight text-gray-900">$0</span>
            </div>
            <ul className="mt-8 space-y-4">
              {[
                "1 landing page generation",
                "All 5 templates",
                "HTML download",
                "Small watermark",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <a
              href="/app"
              className="mt-8 block w-full rounded-lg border-2 border-gray-300 bg-white py-3 text-center text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Get Started Free
            </a>
          </div>

          {/* Pro Plan */}
          <div className="relative rounded-2xl border-2 border-brand-500 bg-white p-8 shadow-lg shadow-brand-100">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
              <span className="rounded-full bg-brand-600 px-4 py-1 text-xs font-semibold text-white">
                Most Popular
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Pro</h3>
            <p className="mt-2 text-sm text-gray-500">For professionals and teams</p>
            <div className="mt-6">
              <span className="text-5xl font-bold tracking-tight text-gray-900">$29</span>
              <span className="ml-2 text-sm text-gray-500">one-time payment</span>
            </div>
            <ul className="mt-8 space-y-4">
              {[
                "Unlimited landing pages",
                "All 5 templates",
                "HTML download",
                "No watermark",
                "Priority support",
                "Future template updates",
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg className="mt-0.5 h-5 w-5 shrink-0 text-brand-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="mt-8 block w-full rounded-lg bg-brand-600 py-3 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-500 disabled:opacity-50"
            >
              {loading ? "Redirecting..." : "Upgrade to Pro"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
