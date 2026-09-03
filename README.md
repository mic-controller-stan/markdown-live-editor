# Markdown Live Editor

Build Angular 18 standalone app: Markdown Live Preview tool.

Features:
- Split-pane layout: left = textarea editor, right = live rendered HTML preview
- Use signals for editor content state, computed() for parsed markdown
- Real-time render on keystroke (no button), debounce 150ms
- Support: headers, bold/italic, lists, code blocks, links, tables, blockquotes
- Use 'marked' npm lib for parsing, sanitize output (DOMPurify)
- New @if/@for control flow syntax where applicable
- Toolbar: bold/italic/link insert buttons (wrap selected text)
- Copy HTML button, download .md button
- Responsive: stack panes vertically on mobile
- Dark theme, monospace editor font, clean minimal UI (Tailwind)
- No backend, client-side only, localStorage autosave

Tech: Angular 18 standalone components, signals, Tailwind CSS.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/e68862f2-f78d-4f7d-96a1-8def0b5588d2).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
