"use client";

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
}

const TEMPLATES: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, centered, elegant",
    preview: "Simple & elegant",
  },
  {
    id: "developer",
    name: "Developer",
    description: "Dark, monospace, terminal",
    preview: "Dark & technical",
  },
  {
    id: "startup",
    name: "Startup",
    description: "Gradient hero, CTA focused",
    preview: "Bold & vibrant",
  },
  {
    id: "saas",
    name: "SaaS",
    description: "Pricing, features, FAQ",
    preview: "Business-ready",
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Visual, project showcase",
    preview: "Creative & visual",
  },
];

const TEMPLATE_COLORS: Record<string, { bg: string; border: string; icon: string }> = {
  minimal: { bg: "bg-gray-50", border: "border-gray-300", icon: "bg-white" },
  developer: { bg: "bg-gray-900", border: "border-gray-600", icon: "bg-gray-800" },
  startup: { bg: "bg-gradient-to-br from-indigo-500 to-purple-600", border: "border-indigo-400", icon: "bg-indigo-600" },
  saas: { bg: "bg-blue-50", border: "border-blue-300", icon: "bg-blue-100" },
  portfolio: { bg: "bg-amber-50", border: "border-amber-300", icon: "bg-amber-100" },
};

interface TemplateSelectorProps {
  selected: string;
  onSelect: (id: string) => void;
}

export default function TemplateSelector({ selected, onSelect }: TemplateSelectorProps) {
  return (
    <div className="flex flex-col gap-3 p-4">
      <h3 className="text-sm font-semibold text-gray-700">Choose Template</h3>
      <div className="grid grid-cols-1 gap-2">
        {TEMPLATES.map((t) => {
          const colors = TEMPLATE_COLORS[t.id];
          const isSelected = selected === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onSelect(t.id)}
              className={`flex items-center gap-3 rounded-xl border-2 p-3 text-left transition-all ${
                isSelected
                  ? "border-brand-500 bg-brand-50 shadow-sm"
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
                </p>
                <p className="text-xs text-gray-500 truncate">{t.description}</p>
              </div>
              {isSelected && (
                <svg className="ml-auto h-5 w-5 shrink-0 text-brand-500" viewBox="0 0 20 20" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
