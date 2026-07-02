## HTML Doc Standard

When producing any specification, plan, design document, or structured reference doc, **always output it as a styled HTML file** — never plain markdown.

### Rules

- Every doc is a standalone `.html` file that opens directly in the browser
- Use the template at `/Users/accordmacbook/.config/opencode/skills/doc-template/doc-template.html` as the base
- Replace all `{{PLACEHOLDER}}` values: `{{TITLE}}`, `{{DOC_TYPE}}`, `{{VERSION}}`, `{{DATE}}`
- Two themes are built in: dark (orange) and light (indigo) — both follow `prefers-color-scheme` automatically, with a manual switcher in the top-right corner to override
- Add nav links in the sidebar for every section (`<a class="nav-link" href="#sN">`)
- Docs go in `docs/superpowers/specs/` named `YYYY-MM-DD-<slug>.html`

### Theme palette

Follows `prefers-color-scheme` — no manual switcher needed.

| Scheme | BG                 | Accent               |
| ------ | ------------------ | -------------------- |
| Dark   | `#09090b` zinc-950 | `#ea580c` orange-600 |
| Light  | `#f8fafc` slate-50 | `#4f46e5` indigo-600 |

### Available component classes

`card`, `card-grid-2`, `card-grid-3`, `note`, `file-tree`, `flow` + `flow-state` (idle/running/paused), `swatches`, `spec-list`, `meta-badge`, `new-badge`, `section-num`, `kw fn str cm num tp` (code syntax), `td-green td-red`, `kbd`
