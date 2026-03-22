import { NextRequest, NextResponse } from "next/server";
import { convertToLandingPage } from "@/lib/markdown-to-html";
import { getTemplate } from "@/lib/templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { markdown, templateId } = body;

    if (!markdown || typeof markdown !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid markdown content" },
        { status: 400 }
      );
    }

    if (!templateId || typeof templateId !== "string") {
      return NextResponse.json(
        { error: "Missing or invalid template ID" },
        { status: 400 }
      );
    }

    const template = getTemplate(templateId);
    if (!template) {
      return NextResponse.json(
        { error: `Unknown template: ${templateId}. Valid options: minimal, developer, startup, saas, portfolio` },
        { status: 400 }
      );
    }

    // Limit markdown size to 100KB
    if (markdown.length > 100_000) {
      return NextResponse.json(
        { error: "Markdown content exceeds 100KB limit" },
        { status: 413 }
      );
    }

    const html = convertToLandingPage(markdown, template.render);

    return NextResponse.json({
      html,
      template: templateId,
      title: html.match(/<title>(.*?)<\/title>/)?.[1] || "Landing Page",
    });
  } catch (error) {
    console.error("Generate error:", error);
    return NextResponse.json(
      { error: "Failed to generate landing page" },
      { status: 500 }
    );
  }
}
