import type { ParsedReadme } from "./markdown-to-html";

export interface Template {
  id: string;
  name: string;
  description: string;
  preview: string; // emoji or icon hint
  render: (parsed: ParsedReadme) => string;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderFeaturesList(features: string[], max = 12): string {
  return features
    .slice(0, max)
    .map((f) => `<li>${escapeHtml(f)}</li>`)
    .join("\n            ");
}

function renderSections(parsed: ParsedReadme, skipHeadings: RegExp): string {
  return parsed.sections
    .filter((s) => s.level >= 2 && !skipHeadings.test(s.heading))
    .map(
      (s) => `
      <section class="content-section">
        <h2>${escapeHtml(s.heading)}</h2>
        ${s.content}
      </section>`
    )
    .join("\n");
}

function renderCodeBlock(parsed: ParsedReadme): string {
  if (parsed.codeBlocks.length === 0) return "";
  const block = parsed.codeBlocks[0];
  return `<pre><code class="language-${block.language}">${escapeHtml(block.code)}</code></pre>`;
}

// =============================================================================
// TEMPLATE 1: MINIMAL
// =============================================================================
function minimalTemplate(parsed: ParsedReadme): string {
  const featuresHtml =
    parsed.features.length > 0
      ? `
    <section class="features">
      <h2>Features</h2>
      <ul>
        ${renderFeaturesList(parsed.features)}
      </ul>
    </section>`
      : "";

  const installHtml = parsed.installation
    ? `
    <section class="install">
      <h2>Getting Started</h2>
      ${parsed.installation}
    </section>`
    : "";

  const additionalSections = renderSections(
    parsed,
    /feature|install|getting.started|setup|quick.start/i
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(parsed.title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      color: #1a1a2e;
      background: #ffffff;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }
    .container { max-width: 720px; margin: 0 auto; padding: 0 24px; }
    header {
      padding: 120px 0 80px;
      text-align: center;
    }
    header h1 {
      font-size: 3.2rem;
      font-weight: 700;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 20px;
    }
    header p {
      font-size: 1.25rem;
      color: #6b7280;
      max-width: 540px;
      margin: 0 auto;
    }
    section { padding: 48px 0; }
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
    }
    ul { list-style: none; padding: 0; }
    ul li {
      padding: 12px 0;
      border-bottom: 1px solid #f3f4f6;
      font-size: 1.05rem;
    }
    ul li:last-child { border-bottom: none; }
    ul li::before {
      content: "\\2713";
      color: #6366f1;
      font-weight: 700;
      margin-right: 12px;
    }
    pre {
      background: #f8f9fa;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      padding: 24px;
      overflow-x: auto;
      font-size: 0.9rem;
      line-height: 1.6;
    }
    code { font-family: 'SF Mono', 'Fira Code', monospace; }
    .content-section { padding: 40px 0; }
    .content-section p { margin-bottom: 16px; color: #4b5563; }
    a { color: #6366f1; text-decoration: none; }
    a:hover { text-decoration: underline; }
    footer {
      text-align: center;
      padding: 60px 0;
      color: #9ca3af;
      font-size: 0.875rem;
      border-top: 1px solid #f3f4f6;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>${escapeHtml(parsed.title)}</h1>
      <p>${escapeHtml(parsed.subtitle)}</p>
    </header>
    ${featuresHtml}
    ${installHtml}
    ${additionalSections}
    <footer>
      <p>Built with README to Landing Page</p>
    </footer>
  </div>
</body>
</html>`;
}

// =============================================================================
// TEMPLATE 2: DEVELOPER
// =============================================================================
function developerTemplate(parsed: ParsedReadme): string {
  const codeHtml = renderCodeBlock(parsed);

  const featuresGrid =
    parsed.features.length > 0
      ? `
    <section class="features-grid">
      <h2>> features</h2>
      <div class="grid">
        ${parsed.features
          .slice(0, 9)
          .map(
            (f) => `
        <div class="feature-card">
          <span class="bullet">$</span>
          <span>${escapeHtml(f)}</span>
        </div>`
          )
          .join("\n")}
      </div>
    </section>`
      : "";

  const installHtml = parsed.installation
    ? `
    <section class="install-section">
      <h2>> installation</h2>
      <div class="terminal-content">
        ${parsed.installation}
      </div>
    </section>`
    : "";

  const additionalSections = parsed.sections
    .filter(
      (s) =>
        s.level >= 2 &&
        !/feature|install|getting.started|setup|quick.start/i.test(s.heading)
    )
    .map(
      (s) => `
      <section class="content-section">
        <h2>> ${escapeHtml(s.heading.toLowerCase())}</h2>
        <div class="section-content">${s.content}</div>
      </section>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(parsed.title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', sans-serif;
      background: #0a0a0f;
      color: #e0e0e8;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }
    .container { max-width: 960px; margin: 0 auto; padding: 0 24px; }
    .hero {
      padding: 100px 0 60px;
      border-bottom: 1px solid #1a1a2e;
    }
    .terminal-header {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.8rem;
      color: #6366f1;
      margin-bottom: 16px;
    }
    .terminal-header span { color: #4ade80; }
    .hero h1 {
      font-family: 'JetBrains Mono', monospace;
      font-size: 2.8rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 16px;
      letter-spacing: -0.02em;
    }
    .hero p {
      font-size: 1.15rem;
      color: #94a3b8;
      max-width: 600px;
    }
    .hero-code {
      margin-top: 32px;
      background: #111118;
      border: 1px solid #1e1e3a;
      border-radius: 8px;
      padding: 20px 24px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.9rem;
      overflow-x: auto;
    }
    .hero-code .prompt { color: #4ade80; }
    .hero-code .cmd { color: #e0e0e8; }
    h2 {
      font-family: 'JetBrains Mono', monospace;
      font-size: 1.3rem;
      color: #6366f1;
      margin-bottom: 24px;
      padding-top: 48px;
    }
    .features-grid { padding: 20px 0; }
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
      gap: 12px;
    }
    .feature-card {
      background: #111118;
      border: 1px solid #1e1e3a;
      border-radius: 8px;
      padding: 16px 20px;
      font-size: 0.95rem;
      transition: border-color 0.2s;
    }
    .feature-card:hover { border-color: #6366f1; }
    .feature-card .bullet {
      color: #4ade80;
      font-family: 'JetBrains Mono', monospace;
      margin-right: 10px;
    }
    .install-section pre, pre {
      background: #111118;
      border: 1px solid #1e1e3a;
      border-radius: 8px;
      padding: 20px 24px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.85rem;
      overflow-x: auto;
      color: #e0e0e8;
    }
    code {
      font-family: 'JetBrains Mono', monospace;
      background: #111118;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.9em;
    }
    pre code { background: none; padding: 0; }
    .content-section { padding-bottom: 24px; }
    .section-content { color: #94a3b8; }
    .section-content p { margin-bottom: 12px; }
    .section-content a { color: #818cf8; }
    .terminal-content { color: #94a3b8; }
    .terminal-content p { margin-bottom: 12px; }
    a { color: #818cf8; text-decoration: none; }
    a:hover { text-decoration: underline; }
    ul { list-style: none; padding: 0; }
    ul li { padding: 6px 0; color: #94a3b8; }
    ul li::before {
      content: "- ";
      color: #4ade80;
      font-family: 'JetBrains Mono', monospace;
    }
    footer {
      text-align: center;
      padding: 60px 0;
      color: #4b5563;
      font-size: 0.8rem;
      font-family: 'JetBrains Mono', monospace;
      border-top: 1px solid #1a1a2e;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="hero">
      <div class="terminal-header">~/projects/<span>${escapeHtml(parsed.title.toLowerCase().replace(/\s+/g, "-"))}</span></div>
      <h1>${escapeHtml(parsed.title)}</h1>
      <p>${escapeHtml(parsed.subtitle)}</p>
      ${codeHtml ? `<div class="hero-code">${codeHtml}</div>` : ""}
    </div>
    ${featuresGrid}
    ${installHtml}
    ${additionalSections}
    <footer>
      <p>// generated with readme-to-landing</p>
    </footer>
  </div>
</body>
</html>`;
}

// =============================================================================
// TEMPLATE 3: STARTUP
// =============================================================================
function startupTemplate(parsed: ParsedReadme): string {
  const featuresGrid =
    parsed.features.length > 0
      ? `
    <section class="features" id="features">
      <div class="container">
        <h2 class="section-title">Everything you need</h2>
        <p class="section-subtitle">Powerful features to help you succeed</p>
        <div class="features-grid">
          ${parsed.features
            .slice(0, 6)
            .map(
              (f, i) => `
          <div class="feature-card" style="animation-delay: ${i * 0.1}s">
            <div class="feature-icon">${["&#x1F680;", "&#x26A1;", "&#x1F6E1;", "&#x2699;", "&#x1F4CA;", "&#x2728;"][i] || "&#x2B50;"}</div>
            <h3>${escapeHtml(f.length > 50 ? f.substring(0, 50) + "..." : f)}</h3>
            <p>${escapeHtml(f)}</p>
          </div>`
            )
            .join("\n")}
        </div>
      </div>
    </section>`
      : "";

  const ctaSection = `
    <section class="cta">
      <div class="container">
        <h2>Ready to get started?</h2>
        <p>Join thousands of teams already using ${escapeHtml(parsed.title)}</p>
        <div class="cta-buttons">
          <a href="#" class="btn btn-white">Get Started Free</a>
          <a href="#" class="btn btn-outline">Learn More</a>
        </div>
      </div>
    </section>`;

  const additionalSections = parsed.sections
    .filter(
      (s) =>
        s.level >= 2 &&
        !/feature|install|getting.started|setup|quick.start/i.test(s.heading)
    )
    .slice(0, 4)
    .map(
      (s) => `
      <section class="content-block">
        <div class="container">
          <h2>${escapeHtml(s.heading)}</h2>
          <div class="block-content">${s.content}</div>
        </div>
      </section>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(parsed.title)} - ${escapeHtml(parsed.subtitle || "Build something amazing")}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      color: #1a1a2e;
      background: #ffffff;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }
    .container { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
    nav {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid #f3f4f6;
      padding: 16px 0;
    }
    nav .container {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    nav .logo {
      font-weight: 800;
      font-size: 1.25rem;
      color: #1a1a2e;
      text-decoration: none;
    }
    nav .nav-links a {
      color: #6b7280;
      text-decoration: none;
      margin-left: 32px;
      font-size: 0.95rem;
      font-weight: 500;
    }
    nav .nav-links a:hover { color: #1a1a2e; }
    .hero {
      padding: 160px 0 100px;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      position: relative;
      overflow: hidden;
    }
    .hero::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
    .hero h1 {
      font-size: 3.5rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 24px;
      position: relative;
    }
    .hero p {
      font-size: 1.25rem;
      opacity: 0.9;
      max-width: 600px;
      margin: 0 auto 40px;
      position: relative;
    }
    .hero-buttons {
      display: flex;
      gap: 16px;
      justify-content: center;
      position: relative;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      padding: 14px 32px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      transition: all 0.2s;
    }
    .btn-white {
      background: white;
      color: #6366f1;
    }
    .btn-white:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(0,0,0,0.15); }
    .btn-outline {
      border: 2px solid rgba(255,255,255,0.5);
      color: white;
    }
    .btn-outline:hover { border-color: white; background: rgba(255,255,255,0.1); }
    .section-title {
      font-size: 2.2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 12px;
      letter-spacing: -0.02em;
    }
    .section-subtitle {
      text-align: center;
      color: #6b7280;
      font-size: 1.15rem;
      margin-bottom: 48px;
    }
    .features {
      padding: 80px 0;
      background: #f9fafb;
    }
    .features-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
    .feature-card {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .feature-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.1);
    }
    .feature-icon { font-size: 2rem; margin-bottom: 16px; }
    .feature-card h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 8px;
    }
    .feature-card p { color: #6b7280; font-size: 0.95rem; }
    .cta {
      padding: 80px 0;
      text-align: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
    }
    .cta h2 { font-size: 2.2rem; font-weight: 700; margin-bottom: 12px; }
    .cta p { opacity: 0.9; font-size: 1.15rem; margin-bottom: 32px; }
    .cta-buttons { display: flex; gap: 16px; justify-content: center; }
    .content-block { padding: 60px 0; border-bottom: 1px solid #f3f4f6; }
    .content-block h2 {
      font-size: 1.8rem;
      font-weight: 700;
      margin-bottom: 20px;
      letter-spacing: -0.02em;
    }
    .block-content { color: #4b5563; }
    .block-content p { margin-bottom: 16px; }
    .block-content pre {
      background: #1a1a2e;
      color: #e0e0e8;
      border-radius: 12px;
      padding: 24px;
      overflow-x: auto;
      font-size: 0.9rem;
    }
    .block-content code {
      font-family: 'SF Mono', 'Fira Code', monospace;
    }
    .block-content a { color: #6366f1; }
    .block-content ul { padding-left: 24px; }
    .block-content li { margin-bottom: 8px; }
    footer {
      text-align: center;
      padding: 40px 0;
      color: #9ca3af;
      font-size: 0.875rem;
    }
  </style>
</head>
<body>
  <nav>
    <div class="container">
      <a href="#" class="logo">${escapeHtml(parsed.title)}</a>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#" class="btn btn-white" style="padding:8px 20px;font-size:0.9rem;margin-left:16px;">Get Started</a>
      </div>
    </div>
  </nav>
  <div class="hero">
    <div class="container">
      <h1>${escapeHtml(parsed.title)}</h1>
      <p>${escapeHtml(parsed.subtitle)}</p>
      <div class="hero-buttons">
        <a href="#" class="btn btn-white">Get Started Free</a>
        <a href="#features" class="btn btn-outline">See Features</a>
      </div>
    </div>
  </div>
  ${featuresGrid}
  ${additionalSections}
  ${ctaSection}
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${escapeHtml(parsed.title)}. Generated with README to Landing Page.</p>
    </div>
  </footer>
</body>
</html>`;
}

// =============================================================================
// TEMPLATE 4: SAAS
// =============================================================================
function saasTemplate(parsed: ParsedReadme): string {
  const featuresComparison =
    parsed.features.length > 0
      ? `
    <section class="comparison" id="features">
      <div class="container">
        <h2 class="section-title">Feature Overview</h2>
        <div class="comparison-table">
          <table>
            <thead>
              <tr>
                <th>Feature</th>
                <th>Free</th>
                <th>Pro</th>
              </tr>
            </thead>
            <tbody>
              ${parsed.features
                .slice(0, 8)
                .map(
                  (f, i) => `
              <tr>
                <td>${escapeHtml(f)}</td>
                <td>${i < 3 ? "&#x2705;" : "&#x274C;"}</td>
                <td>&#x2705;</td>
              </tr>`
                )
                .join("\n")}
            </tbody>
          </table>
        </div>
      </div>
    </section>`
      : "";

  const faqItems = parsed.sections
    .filter((s) => s.level >= 2)
    .slice(0, 5)
    .map(
      (s, i) => `
        <div class="faq-item">
          <button class="faq-question" onclick="this.parentElement.classList.toggle('open')">
            <span>${escapeHtml(s.heading)}</span>
            <svg class="faq-arrow" width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"/></svg>
          </button>
          <div class="faq-answer">${s.content}</div>
        </div>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(parsed.title)} - Pricing & Features</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      color: #1a1a2e;
      background: #ffffff;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }
    .container { max-width: 1080px; margin: 0 auto; padding: 0 24px; }
    nav {
      padding: 16px 0;
      border-bottom: 1px solid #f3f4f6;
      position: sticky;
      top: 0;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      z-index: 100;
    }
    nav .container { display: flex; justify-content: space-between; align-items: center; }
    nav .logo { font-weight: 800; font-size: 1.2rem; color: #1a1a2e; text-decoration: none; }
    nav a { color: #6b7280; text-decoration: none; font-weight: 500; margin-left: 24px; }
    .hero {
      padding: 100px 0 80px;
      text-align: center;
    }
    .hero .badge {
      display: inline-block;
      background: #eef2ff;
      color: #6366f1;
      font-size: 0.85rem;
      font-weight: 600;
      padding: 6px 16px;
      border-radius: 20px;
      margin-bottom: 24px;
    }
    .hero h1 {
      font-size: 3.2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      line-height: 1.1;
      margin-bottom: 20px;
    }
    .hero p { font-size: 1.2rem; color: #6b7280; max-width: 560px; margin: 0 auto; }
    .pricing { padding: 60px 0; }
    .section-title {
      font-size: 2rem;
      font-weight: 700;
      text-align: center;
      margin-bottom: 48px;
      letter-spacing: -0.02em;
    }
    .pricing-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      max-width: 700px;
      margin: 0 auto;
    }
    .pricing-card {
      border: 2px solid #e5e7eb;
      border-radius: 20px;
      padding: 40px 32px;
      text-align: center;
      transition: all 0.2s;
    }
    .pricing-card.popular {
      border-color: #6366f1;
      position: relative;
      box-shadow: 0 8px 30px rgba(99,102,241,0.15);
    }
    .pricing-card.popular::before {
      content: 'Most Popular';
      position: absolute;
      top: -14px;
      left: 50%;
      transform: translateX(-50%);
      background: #6366f1;
      color: white;
      font-size: 0.8rem;
      font-weight: 600;
      padding: 4px 16px;
      border-radius: 12px;
    }
    .pricing-card h3 { font-size: 1.3rem; margin-bottom: 8px; }
    .pricing-card .price {
      font-size: 3rem;
      font-weight: 800;
      margin: 16px 0;
    }
    .pricing-card .price span { font-size: 1rem; font-weight: 400; color: #6b7280; }
    .pricing-card .plan-desc { color: #6b7280; margin-bottom: 24px; }
    .pricing-card ul { list-style: none; text-align: left; margin-bottom: 32px; }
    .pricing-card li {
      padding: 8px 0;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .pricing-card li::before { content: "\\2713"; color: #10b981; font-weight: 700; }
    .pricing-btn {
      display: block;
      width: 100%;
      padding: 14px;
      border-radius: 10px;
      font-weight: 600;
      font-size: 1rem;
      text-decoration: none;
      text-align: center;
      transition: all 0.2s;
    }
    .pricing-btn-primary { background: #6366f1; color: white; }
    .pricing-btn-primary:hover { background: #4f46e5; }
    .pricing-btn-secondary { background: #f3f4f6; color: #374151; }
    .pricing-btn-secondary:hover { background: #e5e7eb; }
    .comparison { padding: 60px 0; background: #f9fafb; }
    .comparison-table { overflow-x: auto; }
    table {
      width: 100%;
      border-collapse: collapse;
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    }
    th, td { padding: 16px 24px; text-align: left; border-bottom: 1px solid #f3f4f6; }
    th { background: #f9fafb; font-weight: 600; font-size: 0.9rem; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em; }
    td { font-size: 0.95rem; }
    td:not(:first-child), th:not(:first-child) { text-align: center; }
    .faq { padding: 80px 0; }
    .faq-item {
      border-bottom: 1px solid #e5e7eb;
      max-width: 720px;
      margin: 0 auto;
    }
    .faq-question {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 20px 0;
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.05rem;
      font-weight: 600;
      color: #1a1a2e;
      text-align: left;
      font-family: inherit;
    }
    .faq-arrow { transition: transform 0.2s; color: #6b7280; }
    .faq-item.open .faq-arrow { transform: rotate(180deg); }
    .faq-answer {
      max-height: 0;
      overflow: hidden;
      transition: max-height 0.3s ease;
      color: #6b7280;
      line-height: 1.7;
    }
    .faq-item.open .faq-answer { max-height: 500px; padding-bottom: 20px; }
    .faq-answer p { margin-bottom: 12px; }
    .faq-answer pre {
      background: #f3f4f6;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.85rem;
    }
    .faq-answer code { font-family: 'SF Mono', monospace; font-size: 0.9em; }
    .faq-answer a { color: #6366f1; }
    .faq-answer ul { padding-left: 24px; }
    .faq-answer li { margin-bottom: 4px; }
    footer {
      text-align: center;
      padding: 40px 0;
      color: #9ca3af;
      font-size: 0.85rem;
      border-top: 1px solid #f3f4f6;
    }
  </style>
</head>
<body>
  <nav>
    <div class="container">
      <a href="#" class="logo">${escapeHtml(parsed.title)}</a>
      <div>
        <a href="#features">Features</a>
        <a href="#pricing">Pricing</a>
        <a href="#faq">FAQ</a>
      </div>
    </div>
  </nav>
  <div class="hero">
    <div class="container">
      <div class="badge">New Release</div>
      <h1>${escapeHtml(parsed.title)}</h1>
      <p>${escapeHtml(parsed.subtitle)}</p>
    </div>
  </div>
  <section class="pricing" id="pricing">
    <div class="container">
      <h2 class="section-title">Simple, transparent pricing</h2>
      <div class="pricing-grid">
        <div class="pricing-card">
          <h3>Free</h3>
          <div class="price">$0<span>/mo</span></div>
          <p class="plan-desc">Perfect for getting started</p>
          <ul>
            <li>Basic features</li>
            <li>Community support</li>
            <li>1 project</li>
          </ul>
          <a href="#" class="pricing-btn pricing-btn-secondary">Get Started</a>
        </div>
        <div class="pricing-card popular">
          <h3>Pro</h3>
          <div class="price">$29<span> one-time</span></div>
          <p class="plan-desc">For professionals & teams</p>
          <ul>
            <li>All features</li>
            <li>Priority support</li>
            <li>Unlimited projects</li>
            <li>No watermark</li>
          </ul>
          <a href="#" class="pricing-btn pricing-btn-primary">Upgrade to Pro</a>
        </div>
      </div>
    </div>
  </section>
  ${featuresComparison}
  ${
    faqItems
      ? `
  <section class="faq" id="faq">
    <div class="container">
      <h2 class="section-title">Documentation</h2>
      ${faqItems}
    </div>
  </section>`
      : ""
  }
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${escapeHtml(parsed.title)}. Generated with README to Landing Page.</p>
    </div>
  </footer>
</body>
</html>`;
}

// =============================================================================
// TEMPLATE 5: PORTFOLIO
// =============================================================================
function portfolioTemplate(parsed: ParsedReadme): string {
  const projectCards =
    parsed.features.length > 0
      ? `
    <section class="projects" id="projects">
      <div class="container">
        <h2>Highlights</h2>
        <div class="project-grid">
          ${parsed.features
            .slice(0, 6)
            .map(
              (f, i) => `
          <div class="project-card">
            <div class="project-img" style="background:${["linear-gradient(135deg,#667eea,#764ba2)", "linear-gradient(135deg,#f093fb,#f5576c)", "linear-gradient(135deg,#4facfe,#00f2fe)", "linear-gradient(135deg,#43e97b,#38f9d7)", "linear-gradient(135deg,#fa709a,#fee140)", "linear-gradient(135deg,#a18cd1,#fbc2eb)"][i]}"></div>
            <h3>${escapeHtml(f.length > 60 ? f.substring(0, 60) + "..." : f)}</h3>
          </div>`
            )
            .join("\n")}
        </div>
      </div>
    </section>`
      : "";

  const aboutSections = parsed.sections
    .filter((s) => s.level >= 2)
    .slice(0, 6)
    .map(
      (s) => `
      <div class="about-block">
        <h3>${escapeHtml(s.heading)}</h3>
        <div class="about-content">${s.content}</div>
      </div>`
    )
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(parsed.title)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet">
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Inter', system-ui, sans-serif;
      color: #1a1a2e;
      background: #fafaf9;
      line-height: 1.7;
      -webkit-font-smoothing: antialiased;
    }
    .container { max-width: 1100px; margin: 0 auto; padding: 0 24px; }
    nav {
      padding: 20px 0;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 100;
      background: rgba(250,250,249,0.9);
      backdrop-filter: blur(10px);
    }
    nav .container { display: flex; justify-content: space-between; align-items: center; }
    nav .logo {
      font-family: 'Playfair Display', serif;
      font-size: 1.5rem;
      font-weight: 700;
      color: #1a1a2e;
      text-decoration: none;
    }
    nav .nav-links a {
      color: #6b7280;
      text-decoration: none;
      margin-left: 32px;
      font-size: 0.95rem;
      font-weight: 500;
    }
    nav .nav-links a:hover { color: #1a1a2e; }
    .hero {
      padding: 160px 0 80px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
    }
    .hero-text h1 {
      font-family: 'Playfair Display', serif;
      font-size: 3.5rem;
      font-weight: 700;
      line-height: 1.1;
      margin-bottom: 24px;
      letter-spacing: -0.02em;
    }
    .hero-text p {
      font-size: 1.15rem;
      color: #6b7280;
      margin-bottom: 32px;
      max-width: 460px;
    }
    .hero-visual {
      aspect-ratio: 4/3;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 4rem;
      font-family: 'Playfair Display', serif;
    }
    .hero-btn {
      display: inline-flex;
      align-items: center;
      padding: 14px 32px;
      background: #1a1a2e;
      color: white;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      transition: all 0.2s;
    }
    .hero-btn:hover { background: #2d2d4e; transform: translateY(-2px); }
    .projects { padding: 80px 0; }
    .projects h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2.2rem;
      margin-bottom: 40px;
    }
    .project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 24px;
    }
    .project-card {
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .project-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 12px 40px rgba(0,0,0,0.08);
    }
    .project-img {
      height: 200px;
      background-size: cover;
    }
    .project-card h3 {
      padding: 20px 24px;
      font-size: 1rem;
      font-weight: 600;
    }
    .about {
      padding: 80px 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
    }
    .about-block {
      background: white;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
    }
    .about-block h3 {
      font-family: 'Playfair Display', serif;
      font-size: 1.3rem;
      margin-bottom: 16px;
    }
    .about-content { color: #6b7280; font-size: 0.95rem; }
    .about-content p { margin-bottom: 12px; }
    .about-content pre {
      background: #f3f4f6;
      padding: 16px;
      border-radius: 8px;
      overflow-x: auto;
      font-size: 0.85rem;
    }
    .about-content code { font-family: 'SF Mono', monospace; font-size: 0.9em; }
    .about-content a { color: #6366f1; }
    .about-content ul { padding-left: 20px; }
    .about-content li { margin-bottom: 4px; }
    footer {
      text-align: center;
      padding: 60px 0;
      color: #9ca3af;
      font-size: 0.875rem;
      border-top: 1px solid #e5e7eb;
    }
    @media (max-width: 768px) {
      .hero { grid-template-columns: 1fr; padding-top: 120px; }
      .hero-text h1 { font-size: 2.5rem; }
      .about { grid-template-columns: 1fr; }
      .project-grid { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <nav>
    <div class="container">
      <a href="#" class="logo">${escapeHtml(parsed.title)}</a>
      <div class="nav-links">
        <a href="#projects">Projects</a>
        <a href="#about">About</a>
      </div>
    </div>
  </nav>
  <div class="container">
    <div class="hero">
      <div class="hero-text">
        <h1>${escapeHtml(parsed.title)}</h1>
        <p>${escapeHtml(parsed.subtitle)}</p>
        <a href="#projects" class="hero-btn">View Projects</a>
      </div>
      <div class="hero-visual">
        ${escapeHtml(parsed.title.charAt(0))}
      </div>
    </div>
  </div>
  ${projectCards}
  ${
    aboutSections
      ? `
  <section id="about">
    <div class="container">
      <div class="about">
        ${aboutSections}
      </div>
    </div>
  </section>`
      : ""
  }
  <footer>
    <div class="container">
      <p>&copy; ${new Date().getFullYear()} ${escapeHtml(parsed.title)}. Generated with README to Landing Page.</p>
    </div>
  </footer>
</body>
</html>`;
}

// =============================================================================
// TEMPLATE REGISTRY
// =============================================================================
export const templates: Template[] = [
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean, white background, centered content, large headings",
    preview: "Simple & elegant",
    render: minimalTemplate,
  },
  {
    id: "developer",
    name: "Developer",
    description: "Dark theme, monospace accents, terminal-style hero",
    preview: "Dark & technical",
    render: developerTemplate,
  },
  {
    id: "startup",
    name: "Startup",
    description: "Gradient hero, feature grid, testimonial section, CTA buttons",
    preview: "Bold & vibrant",
    render: startupTemplate,
  },
  {
    id: "saas",
    name: "SaaS",
    description: "Pricing table layout, feature comparison, FAQ accordion",
    preview: "Business-ready",
    render: saasTemplate,
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Side-by-side layout, image placeholders, project showcase",
    preview: "Creative & visual",
    render: portfolioTemplate,
  },
];

export function getTemplate(id: string): Template | undefined {
  return templates.find((t) => t.id === id);
}
