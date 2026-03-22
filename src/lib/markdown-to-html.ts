import { marked } from "marked";

export interface ParsedReadme {
  title: string;
  subtitle: string;
  badges: string[];
  sections: Section[];
  features: string[];
  installation: string;
  usage: string;
  codeBlocks: CodeBlock[];
  links: Link[];
  images: string[];
}

export interface Section {
  heading: string;
  level: number;
  content: string;
  rawContent: string;
}

export interface CodeBlock {
  language: string;
  code: string;
}

export interface Link {
  text: string;
  url: string;
}

/**
 * Parse raw markdown into structured sections for template consumption.
 */
export function parseReadme(markdown: string): ParsedReadme {
  const lines = markdown.split("\n");

  let title = "";
  let subtitle = "";
  const badges: string[] = [];
  const sections: Section[] = [];
  const features: string[] = [];
  let installation = "";
  let usage = "";
  const codeBlocks: CodeBlock[] = [];
  const links: Link[] = [];
  const images: string[] = [];

  // Extract title (first H1)
  const h1Match = markdown.match(/^#\s+(.+)$/m);
  if (h1Match) {
    title = h1Match[1].trim();
  }

  // Extract badges (image links at top, common in READMEs)
  const badgeRegex = /\[!\[([^\]]*)\]\(([^)]+)\)\]\(([^)]+)\)/g;
  let badgeMatch;
  while ((badgeMatch = badgeRegex.exec(markdown)) !== null) {
    badges.push(badgeMatch[2]); // badge image URL
  }

  // Extract subtitle (first paragraph after H1)
  const afterH1 = markdown.replace(/^#\s+.+$/m, "").trim();
  const subtitleMatch = afterH1.match(/^(?!#|\[|!\[|-|\*|\d\.)(.+)/m);
  if (subtitleMatch) {
    subtitle = subtitleMatch[1].trim();
    // If subtitle looks like a badge line, skip it
    if (subtitle.startsWith("[![") || subtitle.startsWith("![")) {
      const nextLine = afterH1
        .split("\n")
        .find(
          (l) =>
            l.trim() &&
            !l.trim().startsWith("[![") &&
            !l.trim().startsWith("![") &&
            !l.trim().startsWith("#")
        );
      subtitle = nextLine?.trim() || "";
    }
  }

  // Parse sections by headings
  let currentSection: Section | null = null;
  let inCodeBlock = false;
  let codeBlockLang = "";
  let codeBlockContent = "";

  for (const line of lines) {
    // Track code blocks
    if (line.trim().startsWith("```")) {
      if (inCodeBlock) {
        codeBlocks.push({ language: codeBlockLang, code: codeBlockContent.trim() });
        inCodeBlock = false;
        codeBlockContent = "";
        codeBlockLang = "";
        if (currentSection) {
          currentSection.rawContent += line + "\n";
        }
        continue;
      } else {
        inCodeBlock = true;
        codeBlockLang = line.trim().replace("```", "").trim();
        if (currentSection) {
          currentSection.rawContent += line + "\n";
        }
        continue;
      }
    }

    if (inCodeBlock) {
      codeBlockContent += line + "\n";
      if (currentSection) {
        currentSection.rawContent += line + "\n";
      }
      continue;
    }

    // Check for headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      if (currentSection) {
        currentSection.content = marked.parse(currentSection.rawContent, { async: false }) as string;
        sections.push(currentSection);
      }
      currentSection = {
        heading: headingMatch[2].trim(),
        level: headingMatch[1].length,
        content: "",
        rawContent: "",
      };
      continue;
    }

    if (currentSection) {
      currentSection.rawContent += line + "\n";
    }

    // Extract list items as features
    const listMatch = line.match(/^[\s]*[-*+]\s+(.+)$/);
    if (listMatch) {
      features.push(listMatch[1].trim());
    }

    // Extract links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let linkMatch;
    while ((linkMatch = linkRegex.exec(line)) !== null) {
      if (!linkMatch[1].startsWith("!")) {
        links.push({ text: linkMatch[1], url: linkMatch[2] });
      }
    }

    // Extract images
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let imgMatch;
    while ((imgMatch = imgRegex.exec(line)) !== null) {
      images.push(imgMatch[2]);
    }
  }

  // Don't forget last section
  if (currentSection) {
    currentSection.content = marked.parse(currentSection.rawContent, { async: false }) as string;
    sections.push(currentSection);
  }

  // Extract installation section
  const installSection = sections.find((s) =>
    /install|getting.started|setup|quick.start/i.test(s.heading)
  );
  if (installSection) {
    installation = installSection.content;
  }

  // Extract usage section
  const usageSection = sections.find((s) => /usage|example|demo|how.to/i.test(s.heading));
  if (usageSection) {
    usage = usageSection.content;
  }

  return {
    title,
    subtitle,
    badges,
    sections,
    features: features.slice(0, 20), // Cap at 20 features
    installation,
    usage,
    codeBlocks,
    links,
    images,
  };
}

/**
 * Convert markdown to a complete HTML landing page using a template.
 */
export function convertToLandingPage(
  markdown: string,
  templateFn: (parsed: ParsedReadme) => string
): string {
  const parsed = parseReadme(markdown);
  return templateFn(parsed);
}
