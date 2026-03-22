"use client";

import Link from "next/link";
import { useState } from "react";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600 text-sm font-bold text-white">
            R
          </span>
          README to Landing
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link href="/#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Features
          </Link>
          <Link href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            Pricing
          </Link>
          <Link href="/#faq" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
            FAQ
          </Link>
          <Link href="/app" className="btn-primary text-sm">
            Launch App
          </Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-gray-100 bg-white px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <Link href="/#features" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>
              Features
            </Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>
            <Link href="/#faq" className="text-sm font-medium text-gray-600" onClick={() => setMobileOpen(false)}>
              FAQ
            </Link>
            <Link href="/app" className="btn-primary text-center text-sm" onClick={() => setMobileOpen(false)}>
              Launch App
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
