import { useState } from "react";
import { Check, Code, Copy, Heading, Link, List, Quote, Table as TableIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
} from "@/components/ui/sidebar";

const examples = [
  {
    title: "Headers",
    icon: Heading,
    snippet: `# Heading 1
## Heading 2
### Heading 3`,
  },
  {
    title: "Lists",
    icon: List,
    snippet: `- Unordered item
- Another item
  - Nested item

1. Ordered item
2. Another item`,
  },
  {
    title: "Code blocks",
    icon: Code,
    snippet: "```ts\nconst greet = (name: string) => {\n  return `Hello, ${name}!`;\n};\n```",
  },
  {
    title: "Links",
    icon: Link,
    snippet: `[Link text](https://example.com)`,
  },
  {
    title: "Tables",
    icon: TableIcon,
    snippet: `| Name  | Age |
| ----- | --- |
| Alice | 30  |
| Bob   | 25  |`,
  },
  {
    title: "Blockquotes",
    icon: Quote,
    snippet: `> This is a blockquote.
>
> It can span multiple lines.`,
  },
];

export function AppSidebar() {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (title: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(title);
      setTimeout(() => setCopied((current) => (current === title ? null : current)), 1200);
    } catch {
      // ignore
    }
  };

  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader className="px-4 py-3">
        <h2 className="text-sm font-semibold tracking-tight text-sidebar-foreground">
          Markdown cheat sheet
        </h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Syntax examples</SidebarGroupLabel>
          <SidebarGroupContent className="space-y-3">
            {examples.map((example) => (
              <div key={example.title} className="rounded-md border border-sidebar-border bg-sidebar-accent/50 p-2">
                <div className="mb-1.5 flex items-center gap-2">
                  <example.icon className="h-3.5 w-3.5 text-sidebar-primary" />
                  <span className="text-xs font-medium text-sidebar-foreground">{example.title}</span>
                </div>
                <pre className="relative overflow-x-auto rounded bg-sidebar p-2 font-mono text-[10px] leading-snug text-sidebar-foreground">
                  {example.snippet}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => copy(example.title, example.snippet)}
                    className="absolute right-1 top-1 h-5 w-5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    aria-label={`Copy ${example.title} example`}
                  >
                    {copied === example.title ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </Button>
                </pre>
              </div>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
