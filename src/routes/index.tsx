import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";

import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Markdown Live Preview — Write & Render Instantly" },
      {
        name: "description",
        content:
          "A fast, dark-themed markdown editor with live HTML preview, formatting toolbar, copy HTML and download .md — all in your browser.",
      },
      { property: "og:title", content: "Markdown Live Preview" },
      {
        property: "og:description",
        content:
          "Write markdown on the left, see rendered HTML on the right. Autosaves locally, no account needed.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: MarkdownPreview,
});

const STORAGE_KEY = "mdlp:document";

const SAMPLE = `# Markdown Live Preview

Type on the left, see it **rendered** on the right in *real time*.

## Features
- Headers, lists and tables
- \`inline code\` and fenced blocks
- [Links](https://example.com) and blockquotes

> Everything runs client-side and autosaves locally.

\`\`\`ts
const greet = (name: string) => \`Hello, \${name}!\`;
\`\`\`

| Feature | Status |
| ------- | ------ |
| Preview | Live   |
| Autosave| On     |
`;

marked.setOptions({ gfm: true, breaks: true });

function useDebounced<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function MarkdownPreview() {
  const [source, setSource] = useState(SAMPLE);
  const [hydrated, setHydrated] = useState(false);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) setSource(saved);
    setHydrated(true);
  }, []);

  const debouncedSource = useDebounced(source, 150);

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, debouncedSource);
  }, [debouncedSource, hydrated]);

  const html = useMemo(() => {
    if (!hydrated) return "";
    const raw = marked.parse(debouncedSource, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [debouncedSource, hydrated]);

  const wrapSelection = useCallback(
    (before: string, after: string, placeholder: string) => {
      const el = textareaRef.current;
      if (!el) return;
      const { selectionStart: s, selectionEnd: e } = el;
      const selected = source.slice(s, e) || placeholder;
      const next = source.slice(0, s) + before + selected + after + source.slice(e);
      setSource(next);
      requestAnimationFrame(() => {
        el.focus();
        el.setSelectionRange(s + before.length, s + before.length + selected.length);
      });
    },
    [source],
  );

  const copyHtml = async () => {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const downloadMd = () => {
    const blob = new Blob([source], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "document.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  const words = source.trim() ? source.trim().split(/\s+/).length : 0;

  const tools = [
    { label: "Bold", action: () => wrapSelection("**", "**", "bold text"), cls: "font-bold" },
    { label: "Italic", action: () => wrapSelection("*", "*", "italic text"), cls: "italic" },
    { label: "Link", action: () => wrapSelection("[", "](https://)", "label"), cls: "underline" },
    { label: "Code", action: () => wrapSelection("`", "`", "code"), cls: "font-mono" },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <SidebarInset>
        <header className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-3 sm:px-6">
          <SidebarTrigger />
          <h1 className="mr-auto text-sm font-semibold tracking-tight">
            Markdown Live Preview
          </h1>
          <div className="flex flex-wrap items-center gap-1.5">
            {tools.map((t) => (
              <button
                key={t.label}
                type="button"
                onClick={t.action}
                className={`rounded-md border border-border bg-secondary px-2.5 py-1.5 text-xs text-secondary-foreground transition-colors hover:bg-accent ${t.cls}`}
              >
                {t.label}
              </button>
            ))}
            <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
            <button
              type="button"
              onClick={copyHtml}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              {copied ? "Copied!" : "Copy HTML"}
            </button>
            <button
              type="button"
              onClick={downloadMd}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-accent"
            >
              Download .md
            </button>
          </div>
        </header>

        <div className="grid flex-1 grid-cols-1 md:grid-cols-2">
          <section className="flex min-h-[45vh] flex-col border-b border-border md:border-b-0 md:border-r">
            <div className="flex items-center justify-between px-4 py-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              <span>Editor</span>
              <span>{words} words</span>
            </div>
            <textarea
              ref={textareaRef}
              value={source}
              onChange={(e) => setSource(e.target.value)}
              spellCheck={false}
              aria-label="Markdown editor"
              className="flex-1 resize-none bg-transparent px-4 pb-6 font-mono text-sm leading-relaxed text-foreground outline-none placeholder:text-muted-foreground"
              placeholder="# Start writing…"
            />
          </section>

          <section className="flex min-h-[45vh] flex-col">
            <div className="px-4 py-2 text-[11px] uppercase tracking-widest text-muted-foreground">
              Preview
            </div>
            {html ? (
              <div
                className="markdown-body flex-1 overflow-auto px-4 pb-8 text-sm"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            ) : (
              <p className="px-4 text-sm text-muted-foreground">Nothing to preview yet.</p>
            )}
          </section>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
