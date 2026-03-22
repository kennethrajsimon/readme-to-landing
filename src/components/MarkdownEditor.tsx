"use client";

import { useState, useCallback } from "react";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const SAMPLE_README = `# MyAwesomeProject

A blazing fast, developer-friendly toolkit for building modern web applications with ease.

[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](https://choosealicense.com/licenses/mit/)

## Features

- Lightning-fast hot module replacement
- Built-in TypeScript support with zero configuration
- Automatic code splitting and lazy loading
- Integrated testing framework with coverage reports
- Plugin ecosystem with 200+ community extensions
- First-class SSR and static site generation
- Smart caching and incremental builds
- Beautiful error overlay with stack traces

## Installation

\`\`\`bash
npm install myawesomeproject
\`\`\`

Or with yarn:

\`\`\`bash
yarn add myawesomeproject
\`\`\`

## Quick Start

\`\`\`javascript
import { createApp } from 'myawesomeproject';

const app = createApp({
  plugins: ['typescript', 'tailwind'],
  ssr: true,
});

app.listen(3000, () => {
  console.log('Running on http://localhost:3000');
});
\`\`\`

## Usage

After installation, create a new project:

\`\`\`bash
npx myawesomeproject init my-project
cd my-project
npm run dev
\`\`\`

## API Reference

### \`createApp(options)\`

Creates a new application instance.

| Parameter | Type | Description |
|-----------|------|-------------|
| plugins | string[] | List of plugins to enable |
| ssr | boolean | Enable server-side rendering |
| port | number | Dev server port (default: 3000) |

## Contributing

Pull requests are welcome. For major changes, please open an issue first.

## License

[MIT](https://choosealicense.com/licenses/mit/)`;

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const [charCount, setCharCount] = useState(value.length);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;
      onChange(newValue);
      setCharCount(newValue.length);
    },
    [onChange]
  );

  const loadSample = useCallback(() => {
    onChange(SAMPLE_README);
    setCharCount(SAMPLE_README.length);
  }, [onChange]);

  const clearEditor = useCallback(() => {
    onChange("");
    setCharCount(0);
  }, [onChange]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-gray-200 px-4 py-2">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-700">Markdown Input</h3>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {charCount.toLocaleString()} chars
          </span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={loadSample}
            className="rounded-md bg-brand-50 px-3 py-1.5 text-xs font-medium text-brand-600 hover:bg-brand-100 transition-colors"
          >
            Load Sample
          </button>
          <button
            onClick={clearEditor}
            className="rounded-md bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={handleChange}
        placeholder="Paste your GitHub README markdown here...

# My Project

A short description of what your project does.

## Features

- Feature one
- Feature two
- Feature three

## Installation

```bash
npm install my-project
```"
        className="flex-1 resize-none bg-gray-50 p-4 font-mono text-sm leading-relaxed text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-brand-500 focus:ring-inset"
        spellCheck={false}
      />
    </div>
  );
}
