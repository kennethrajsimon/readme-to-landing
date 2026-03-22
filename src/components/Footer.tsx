import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600 text-xs font-bold text-white">
              R
            </span>
            <span className="font-semibold text-gray-900">README to Landing</span>
          </div>

          <nav className="flex gap-6">
            <Link href="/#features" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Features
            </Link>
            <Link href="/#pricing" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              Pricing
            </Link>
            <Link href="/#faq" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              FAQ
            </Link>
            <Link href="/app" className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
              App
            </Link>
          </nav>

          <p className="text-sm text-gray-400">
            &copy; {new Date().getFullYear()} README to Landing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
