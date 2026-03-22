import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PricingSection from "@/components/PricingSection";

export default function HomePage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-purple-50" />
          <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-brand-100/40 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-purple-100/40 blur-3xl" />
        </div>

        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-sm font-medium text-brand-700">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-pulse" />
            New: 5 professional templates
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl lg:text-7xl">
            Turn your README into a{" "}
            <span className="bg-gradient-to-r from-brand-600 to-purple-600 bg-clip-text text-transparent">
              stunning landing page
            </span>{" "}
            in seconds
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 sm:text-xl">
            Paste your GitHub README, pick a template, and get a beautiful, deployable
            landing page instantly. No design skills needed.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/app" className="btn-primary px-8 py-4 text-base">
              Launch App &mdash; It&apos;s Free
            </Link>
            <a href="#features" className="btn-secondary px-8 py-4 text-base">
              See How It Works
            </a>
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-16">
        <div className="mx-auto max-w-5xl px-6">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl shadow-gray-200/50">
            <div className="flex items-center gap-2 border-b border-gray-100 bg-gray-50 px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-400" />
              <div className="h-3 w-3 rounded-full bg-yellow-400" />
              <div className="h-3 w-3 rounded-full bg-green-400" />
              <span className="ml-2 text-xs text-gray-400">readme-to-landing.app</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="border-r border-gray-100 bg-gray-50 p-6">
                <div className="space-y-2 font-mono text-sm text-gray-600">
                  <p className="text-gray-400"># Paste your README</p>
                  <p className="font-bold text-gray-800"># MyProject</p>
                  <p>A fast toolkit for modern apps.</p>
                  <p className="mt-4 font-bold text-gray-800">## Features</p>
                  <p>- Lightning fast builds</p>
                  <p>- TypeScript support</p>
                  <p>- Plugin ecosystem</p>
                </div>
              </div>
              <div className="bg-gradient-to-br from-brand-600 to-purple-600 p-6">
                <div className="space-y-3 text-white">
                  <div className="h-4 w-32 rounded bg-white/20" />
                  <div className="h-8 w-48 rounded bg-white/30" />
                  <div className="h-3 w-40 rounded bg-white/15" />
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="h-16 rounded-lg bg-white/10" />
                    <div className="h-16 rounded-lg bg-white/10" />
                  </div>
                  <div className="mt-2 h-8 w-24 rounded-lg bg-white/25" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / Benefits */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              How it works
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Three simple steps to a professional landing page
            </p>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-3">
            {/* Step 1 */}
            <div className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-100">
                <svg className="h-6 w-6 text-brand-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
              </div>
              <span className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                1
              </span>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Paste Your README</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Copy your GitHub README markdown and paste it directly into the editor. We support all standard markdown syntax.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.994 15.994 0 011.622-3.395m3.42 3.42a15.995 15.995 0 004.764-4.648l3.876-5.814a1.151 1.151 0 00-1.597-1.597L14.146 6.32a15.996 15.996 0 00-4.649 4.763m3.42 3.42a6.776 6.776 0 00-3.42-3.42" />
                </svg>
              </div>
              <span className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                2
              </span>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Pick a Template</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Choose from 5 professionally designed templates: Minimal, Developer, Startup, SaaS, or Portfolio. Each one is fully responsive.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </div>
              <span className="absolute top-4 right-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-500">
                3
              </span>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Download & Deploy</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get a clean, self-contained HTML file. Deploy it to Vercel, Netlify, GitHub Pages, or any static host in seconds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="border-y border-gray-100 bg-gray-50 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="grid grid-cols-3 gap-8">
            <div>
              <p className="text-3xl font-bold text-gray-900">5</p>
              <p className="mt-1 text-sm text-gray-500">Pro Templates</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">&lt;10s</p>
              <p className="mt-1 text-sm text-gray-500">Generation Time</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">0</p>
              <p className="mt-1 text-sm text-gray-500">Dependencies</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* FAQ */}
      <section id="faq" className="py-24">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Frequently asked questions
          </h2>

          <div className="mt-12 space-y-0 divide-y divide-gray-200">
            {[
              {
                q: "What markdown syntax is supported?",
                a: "We support all standard GitHub Flavored Markdown (GFM) including headings, lists, code blocks, tables, links, images, and badges. The parser intelligently maps your README structure to template sections.",
              },
              {
                q: "Can I customize the generated HTML?",
                a: "Absolutely. The generated HTML is clean, well-structured, and uses inline CSS with no external dependencies. Download it and modify anything you need with any code editor.",
              },
              {
                q: "What's the difference between Free and Pro?",
                a: "The Free plan lets you generate one landing page with a small watermark. Pro gives you unlimited generations, removes the watermark, and includes all future template updates.",
              },
              {
                q: "Where can I deploy the landing page?",
                a: "Anywhere that serves static HTML! Popular options include Vercel, Netlify, GitHub Pages, Cloudflare Pages, or even an S3 bucket. Just upload the single HTML file.",
              },
              {
                q: "Do I need to create an account?",
                a: "No. The free tier works without any account. You only need to provide an email when purchasing the Pro upgrade via Stripe Checkout.",
              },
            ].map((item) => (
              <details key={item.q} className="group py-6">
                <summary className="flex cursor-pointer items-center justify-between text-lg font-semibold text-gray-900 [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <svg
                    className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-open:rotate-180"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </summary>
                <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="bg-gradient-to-br from-brand-600 to-purple-700 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center text-white">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to convert your README?
          </h2>
          <p className="mt-4 text-lg text-white/80">
            Join developers who use README to Landing Page to ship beautiful project pages in seconds.
          </p>
          <Link
            href="/app"
            className="mt-8 inline-flex items-center rounded-lg bg-white px-8 py-4 text-base font-semibold text-brand-600 shadow-lg transition-all hover:shadow-xl hover:-translate-y-0.5"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
