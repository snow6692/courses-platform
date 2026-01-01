"use client";

import { useEffect, useState } from "react";
import { type JSONContent } from "@tiptap/react";
import parse from "html-react-parser";

interface Props {
  json: JSONContent | string | null | undefined;
}

export default function RenderDescription({ json }: Props) {
  const [html, setHtml] = useState("<p></p>");

  useEffect(() => {
    if (!json) {
      setHtml("<p>No content</p>");
      return;
    }

    let content: JSONContent;
    try {
      content = typeof json === "string" ? JSON.parse(json) : json;
    } catch {
      setHtml("<p>Invalid content</p>");
      return;
    }

    // Dynamic import — avoids bundling node:perf_hooks
    const render = async () => {
      const { generateHTML } = await import("@tiptap/html");
      const StarterKit = (await import("@tiptap/starter-kit")).default;
      const TextAlign = (await import("@tiptap/extension-text-align")).default;

      try {
        const output = generateHTML(content, [
          StarterKit,
          TextAlign.configure({
            types: ["heading", "paragraph", "bulletList", "orderedList"],
          }),
        ]);
        setHtml(output);
      } catch (err) {
        console.error("Tiptap render failed:", err);
        setHtml("<p>Error rendering content</p>");
      }
    };

    render();
  }, [json]);

  if (!html) return null;

  return (
    <div className="prose dark:prose-invert text-foreground max-w-none dark:text-gray-200">
      {parse(html)}
    </div>
  );
}
