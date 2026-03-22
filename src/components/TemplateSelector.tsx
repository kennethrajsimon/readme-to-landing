"use client";

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  pro: boolean;
}

const TEMPLATES: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, centered, elegant",
    preview: "Simple & elegant",
    pro: false,
  },
  {
    id: "developer",
    name: "Developer",
    description: "Dark, monospace, terminal",
    preview: "Dark & technical",
    pro: false,
  },
  {
    id: "startup",
    name: "Startup",
    description: "Gradient hero, CTA focused",
    preview: "Bold & vibrant",
    pro: true,
  },
  {
    id: "saas",
    name: "SaaS",
    description: "Pricing, features, FAQ",
    preview: "Business-ready",
    pro: true,
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Visual, project showcase",
    preview: "Creative & visual",
    pro: true,
  },
];

const TEMPLATE_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  minimal: { bg: "bg-gray-50", border: "border-gray-300", icon: "bg-white" },
  developer: { bg: "bg-gray-900", border: "border-gray-600", icon: "bg-gray-800" },
  startup: { bg: "bg-gradient-to-br from-indigo-500 to-purple-600", border: "border-indigo-400", icon: "bg-indigo-600" },
  saas: { bg: "bg-blue-50", border: "border-blue-300", icon: "bg-blue-100" },
  portfolio: { bg: "bg-amber-50", border: "border-amber-300", icon: "bg-amber-100" },
};

export const FREE_TEMPLATES = ["minimal", "developer"];

interface TemplateSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
  isPro: boolean;
  onProClick: () => void;
}

export default function TemplateSelector({ selected, onSelect, isPro, onProClick }: TemplateSelectorProps) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <h3 className="text-sm font-semibold text-gray-700">Choose Template</h3>
      <div className="grid grid-cols-1 gap-2">
        {TEMPLATES.map((t) => {
          const colors = TEMPLATE_COLORS[t.id];
          const isSelected = selected === t.id;
          const isLocked = t.pro && !isPro;
          return (
            <button
              key={t.id}
              onClick={() => isLocked ? onProClick() : onSelect(t.id)}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                isSelected
                  ? "border-brand-500 bg-brand-50 shadow-sm"
                  : isLocked
                  ? "border-gray-200 bg-gray-50 opacity-75 hover:border-amber-300 hover:opacity-100"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
              }`}
            >
              <div
                className={`h-10 w-10 shrink-0 rounded-lg ${colors.bg} flex items-center justify-center`}
              >
                <div className={`h-3 w-5 rounded-sm ${colors.icon} ${t.id === "developer" ? "border border-green-400" : "border border-gray-300"}`} />
              </div>
              <div className="min-w-0">
                <p className={`text-sm font-semibold ${isSelected ? "text-brand-700" : "text-gray-800"}`}>
                  {t.name}
                  {isLocked && (
                    <span className="ml-1.5 inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700">
                      PRO
                    </span>
                  )}
                </p>
                <p className="text-xs text-gray-500 truncate">{t.description}</p>
              </div>
              {isSelected && !isLocked && (
                <svg className="ml-auto h-5 w-5 shrink-0 text-brand-500" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {isLocked && (
                <svg className="ml-auto h-5 w-5 shrink-0 text-amber-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              )}
            </button>
          );
        })}
      </div>
      {!isPro && (
        <button
          onClick={onProClick}
          className="mt-1 rounded-lg border-2 border-dashed border-amber-300 bg-amber-50 px-3 py-2.5 text-center text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-100"
        >
          Unlock 3 Pro templates — $29 one-time
        </button>
      )}
    </div>
  );
}
