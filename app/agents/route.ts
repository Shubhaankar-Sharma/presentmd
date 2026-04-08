import { NextResponse } from "next/server";

const SKILL = `---
name: presentmd
description: "Create, update, and manage markdown slide presentations hosted on presentmd. Use when the user wants to create a presentation, share slides, or update an existing presentation with new content or images."
---

# presentmd

Headless markdown presentation hosting. Upload markdown + images → get a shareable slide deck URL.

## Quick Start

\`\`\`bash
# Create a presentation
curl -s -X POST https://present.spongeboi.com/api/upload \\
  -F "files=@slides.md" \\
  -F "files=@plot1.png" \\
  -F "files=@plot2.png"
# → {"id": "abc123", "url": "/p/abc123", "slideCount": 12}
# View at: https://present.spongeboi.com/p/abc123
\`\`\`

## API Reference

### POST /api/upload — Create presentation

\`\`\`bash
curl -s -X POST BASE_URL/api/upload -F "files=@slides.md" -F "files=@img.png"
\`\`\`

Returns: \`{"id": "<id>", "url": "/p/<id>", "slideCount": N}\`

### PUT /api/presentations/[id] — Update presentation

Replace markdown and/or add images. Existing images preserved; same filename overwrites.

\`\`\`bash
curl -s -X PUT BASE_URL/api/presentations/ID -F "files=@slides_v2.md" -F "files=@new_plot.png"
\`\`\`

Returns: \`{"id": "<id>", "slideCount": N, "updated": true}\`

### GET /api/presentations/[id] — Get presentation data

\`\`\`bash
curl -s BASE_URL/api/presentations/ID
\`\`\`

Returns: \`{"id": "...", "title": "...", "slides": ["# Slide 1\\n...", ...], "createdAt": "..."}\`

### DELETE /api/presentations/[id] — Delete presentation

\`\`\`bash
curl -s -X DELETE BASE_URL/api/presentations/ID
\`\`\`

## Markdown Format

Slides separated by \`<!-- end_slide -->\`. YAML frontmatter extracted as title slide.

\`\`\`markdown
---
title: "My Talk"
author: "Name"
---

# First Slide

Content with **bold**, *italic*, \\\`code\\\`.

| col1 | col2 |
|------|------|
| a    | b    |

<!-- end_slide -->

# Second Slide

![](plots/chart.png)

More content.
\`\`\`

## Slide Authoring Rules

- **Max ~15 lines of rendered content per slide.** No scrolling — treat like PowerPoint.
- Use \`<!-- end_slide -->\` to separate slides. NOT \`---\`.
- YAML frontmatter (\`title\`, \`author\`) becomes a centered title slide automatically.
- Use proper markdown tables, NOT code-block tables.
- Images: reference by relative path. Paths are flattened on upload (directories stripped).
- Supported image formats: png, jpg, jpeg, gif, svg, webp.

## Styling

Raw HTML is supported via rehype-raw. Use these CSS classes:

**Text colors:**
- \`<span class="red">text</span>\` — red (costs, degradation)
- \`<span class="green">text</span>\` — green (improvements, wins)
- \`<span class="yellow">text</span>\` — yellow (mixed, caution)
- \`<span class="orange">text</span>\` — orange
- \`<span class="blue">text</span>\` — blue
- \`<span class="purple">text</span>\` — purple
- \`<span class="muted">text</span>\` — gray (insignificant)
- \`<span class="bright">text</span>\` — white bold (emphasis)

**Highlights:**
- \`<mark>text</mark>\` — yellow highlight
- \`<span class="bg-red">text</span>\` — red background
- \`<span class="bg-green">text</span>\` — green background

## Interactive Components (json-render)

Use \\\`\\\`\\\`json-render fenced code blocks to embed interactive, richly-styled components directly in slides. **You should use json-render for ANY slide that presents data, metrics, comparisons, status, or structured information.** Plain markdown tables and bullet lists are a last resort — json-render produces PowerPoint-quality layouts with interactivity that PowerPoint can't match.

### Spec Format

\`\`\`json
{
  "root": "main",
  "elements": { ... },
  "state": { ... }
}
\`\`\`

- \`root\`: ID of the root element
- \`elements\`: flat map of element IDs → element definitions
- \`state\`: (optional) initial state object for interactive features

Each element has:
- \`type\`: component name
- \`props\`: component-specific properties
- \`children\`: (optional) array of child element IDs (for layout components)
- \`visible\`: (optional) condition to show/hide based on state
- \`on\`: (optional) event bindings to trigger actions

### Available Components

**Layout (use these to structure every slide):**
- \`Card\` — Container with optional title/description. Props: \`title?\`, \`description?\`, \`variant?\` ("default"|"outline"|"filled"). Has children.
- \`Stack\` — Flex container. Props: \`direction?\` ("horizontal"|"vertical"), \`gap?\` ("sm"|"md"|"lg"), \`align?\` ("start"|"center"|"end"|"stretch"). Has children.
- \`Grid\` — CSS grid. Props: \`columns?\` (number), \`gap?\` ("sm"|"md"|"lg"). Has children.

**Typography:**
- \`Text\` — Props: \`content\`, \`size?\` ("xs"|"sm"|"md"|"lg"|"xl"), \`color?\` (red/green/blue/yellow/purple/gray/cyan or any CSS color), \`weight?\` ("normal"|"medium"|"semibold"|"bold")
- \`Heading\` — Props: \`content\`, \`level?\` ("1"|"2"|"3")

**Data Display (use these instead of markdown tables/lists):**
- \`Badge\` — Colored pill label. Props: \`label\`, \`color?\` ("red"|"green"|"blue"|"yellow"|"purple"|"gray")
- \`Alert\` — Callout box. Props: \`title?\`, \`message\`, \`variant?\` ("info"|"success"|"warning"|"error")
- \`Table\` — Data table. Props: \`headers\` (string[]), \`rows\` (string[][]), \`striped?\` (boolean)
- \`Progress\` — Progress bar. Props: \`value\`, \`max?\` (default 100), \`label?\`, \`color?\` ("red"|"green"|"blue"|"yellow"|"purple")
- \`BarGraph\` — Horizontal bar chart. Props: \`data\` ({label, value}[]), \`title?\`, \`color?\` ("red"|"green"|"blue"|"yellow"|"purple"|"cyan")

**Interactive (these make slides clickable — use liberally):**
- \`Tabs\` — Tab switcher. Props: \`tabs\` ({label, content}[])
- \`Accordion\` — Expandable sections. Props: \`items\` ({title, content}[])
- \`Button\` — Clickable button that emits events. Props: \`label\`, \`color?\`, \`variant?\` ("solid"|"outline"|"ghost"), \`size?\` ("sm"|"md"|"lg"). Use with \`on\` to trigger actions.
- \`Toggle\` — On/off switch bound to state. Props: \`label?\`, \`statePath\` (JSON Pointer like "/myFlag")
- \`Pill\` — Selector that sets state. Props: \`items\` ({label, value}[]), \`statePath\`
- \`StatValue\` — Displays a live value from state. Props: \`statePath\`, \`prefix?\`, \`suffix?\`, \`size?\`, \`color?\`, \`weight?\`

**Presentation:**
- \`Separator\` — Horizontal divider. Props: \`label?\`
- \`Image\` — Props: \`src\`, \`alt?\`, \`width?\`, \`height?\`

### State & Interactivity

The spec supports a \`state\` object and elements can react to it:

**Initial state** — seed values at the spec level:
\`\`\`json
{ "root": "r", "state": { "view": "overview", "showDetails": false, "count": 0 }, "elements": { ... } }
\`\`\`

**Conditional visibility** — show/hide elements based on state:
\`\`\`json
{ "type": "Alert", "props": { ... }, "visible": { "$state": "/showDetails", "$eq": true } }
\`\`\`

**Button actions** — buttons can set state on click via \`on\`:
\`\`\`json
{
  "type": "Button", "props": { "label": "Activate" },
  "on": { "click": { "action": "setState", "params": { "statePath": "/active", "value": true } } }
}
\`\`\`

**Toggle/Pill** — directly bind to state via \`statePath\` prop:
\`\`\`json
{ "type": "Toggle", "props": { "label": "Dark mode", "statePath": "/darkMode" } }
{ "type": "Pill", "props": { "statePath": "/view", "items": [{"label": "Chart", "value": "chart"}, {"label": "Table", "value": "table"}] } }
\`\`\`

### Slide Design Patterns

**Pattern: KPI Dashboard** — Grid of Cards with big numbers + badges, BarGraph below:
\`\`\`
Grid(columns=3-4) → Card(variant=outline) → Text(size=xl, weight=bold, color=green) + Badge
Separator
BarGraph
\`\`\`

**Pattern: Multi-View Dashboard** — Pill nav switches between different views:
\`\`\`
Pill(statePath=/view, items=[Overview, Detail, Cost])
Separator
Stack(visible={$state:/view, $eq:overview}) → [KPIs + Chart]
Stack(visible={$state:/view, $eq:detail}) → [Table + Alerts]
Stack(visible={$state:/view, $eq:cost}) → [Progress bars + BarGraph]
\`\`\`

**Pattern: Status Page** — Stacked alerts with tabs for details:
\`\`\`
Alert(variant=success) + Alert(variant=warning) + Alert(variant=error)
Tabs(tabs=[Latency, Throughput, Errors, Dependencies])
\`\`\`

**Pattern: Interactive Runbook** — Buttons that update status indicators:
\`\`\`
Alert(variant=error, title=incident)
Grid → Card → Button(on={click: setState}) ← triggers state changes
Grid → Card → Badge(visible=condition) ← reacts to state
\`\`\`

**Pattern: Comparison Matrix** — Table with competitive data + side-by-side charts:
\`\`\`
Table(striped=true, headers=[Feature, Us, Comp A, Comp B])
Grid(columns=2) → Card → BarGraph
\`\`\`

**Pattern: Toggle Detail** — Summary/detail toggle:
\`\`\`
Toggle(statePath=/detailed)
Card(visible={$state:/detailed, $eq:false}) → [badges, summary text]
Card(visible={$state:/detailed, $eq:true}) → [tables, progress bars, raw metrics]
\`\`\`

### Example: Interactive Dashboard with View Switching

\\\`\\\`\\\`json-render
{
  "root": "r",
  "state": { "view": "metrics" },
  "elements": {
    "r": { "type": "Stack", "props": { "direction": "vertical", "gap": "md" }, "children": ["nav", "sep", "v_metrics", "v_health"] },
    "nav": { "type": "Pill", "props": { "statePath": "/view", "items": [{ "label": "Metrics", "value": "metrics" }, { "label": "Health", "value": "health" }] } },
    "sep": { "type": "Separator", "props": {} },
    "v_metrics": {
      "type": "Grid", "props": { "columns": 3, "gap": "sm" }, "children": ["m1", "m2", "m3"],
      "visible": { "$state": "/view", "$eq": "metrics" }
    },
    "m1": { "type": "Card", "props": { "title": "Revenue", "variant": "outline" }, "children": ["m1v"] },
    "m1v": { "type": "Text", "props": { "content": "$2.4M", "size": "xl", "weight": "bold", "color": "green" } },
    "m2": { "type": "Card", "props": { "title": "Users", "variant": "outline" }, "children": ["m2v"] },
    "m2v": { "type": "Text", "props": { "content": "14,200", "size": "xl", "weight": "bold", "color": "blue" } },
    "m3": { "type": "Card", "props": { "title": "Churn", "variant": "outline" }, "children": ["m3v"] },
    "m3v": { "type": "Text", "props": { "content": "2.1%", "size": "xl", "weight": "bold", "color": "red" } },
    "v_health": {
      "type": "Stack", "props": { "direction": "vertical", "gap": "sm" }, "children": ["h1", "h2"],
      "visible": { "$state": "/view", "$eq": "health" }
    },
    "h1": { "type": "Alert", "props": { "title": "API", "message": "All systems nominal · p99 34ms", "variant": "success" } },
    "h2": { "type": "Alert", "props": { "title": "Cache", "message": "Hit rate dropped to 71% · investigating", "variant": "warning" } }
  }
}
\\\`\\\`\\\`

### Example: Runbook with State-Driven Buttons

\\\`\\\`\\\`json-render
{
  "root": "r",
  "state": { "step1": false, "step2": false },
  "elements": {
    "r": { "type": "Stack", "props": { "direction": "vertical", "gap": "md" }, "children": ["alert", "actions", "status"] },
    "alert": { "type": "Alert", "props": { "title": "INC-4821", "message": "Payment processing timeout", "variant": "error" } },
    "actions": { "type": "Stack", "props": { "direction": "horizontal", "gap": "sm" }, "children": ["btn1", "btn2"] },
    "btn1": {
      "type": "Button", "props": { "label": "Kill Canary", "color": "red", "variant": "solid" },
      "on": { "click": { "action": "setState", "params": { "statePath": "/step1", "value": true } } }
    },
    "btn2": {
      "type": "Button", "props": { "label": "Rollback", "color": "yellow", "variant": "solid" },
      "on": { "click": { "action": "setState", "params": { "statePath": "/step2", "value": true } } }
    },
    "status": { "type": "Grid", "props": { "columns": 2, "gap": "sm" }, "children": ["s1_off", "s1_on", "s2_off", "s2_on"] },
    "s1_off": { "type": "Badge", "props": { "label": "Canary: LIVE", "color": "red" }, "visible": { "$state": "/step1", "$eq": false } },
    "s1_on": { "type": "Badge", "props": { "label": "Canary: KILLED ✓", "color": "green" }, "visible": { "$state": "/step1", "$eq": true } },
    "s2_off": { "type": "Badge", "props": { "label": "v3.14.2 deployed", "color": "red" }, "visible": { "$state": "/step2", "$eq": false } },
    "s2_on": { "type": "Badge", "props": { "label": "Rolled back ✓", "color": "green" }, "visible": { "$state": "/step2", "$eq": true } }
  }
}
\\\`\\\`\\\`

### When to Use json-render vs Markdown

**Always use json-render for:**
- KPI slides with numbers, metrics, percentages → Grid + Card + Text + Badge
- Comparisons and feature matrices → Table + BarGraph side by side
- Status/health pages → Alert + Progress + Tabs
- Process flows and runbooks → Accordion + Alert + Button
- Any slide with >2 data points → structured layout beats bullet lists
- Dashboards → combine all of the above with Pill view-switching

**Use plain markdown only for:**
- Title slides (just \`# Title\`)
- Slides that are purely narrative text with no data
- Code examples (use fenced code blocks with language tags)

**Design principles:**
- Every data slide should use at least one json-render block
- Use \`Grid\` with 2-4 columns for side-by-side content
- Use \`Card(variant=outline)\` to visually group related metrics
- Add \`Badge\` next to numbers to show trends (↑ 24%, ↓ 3%)
- Use color semantically: green=good, red=bad, yellow=caution, blue=info
- Add interactivity with \`Pill\` view-switching when a slide has multiple facets
- Use \`visible\` conditions to pack multiple views into one slide
- Add \`Accordion\` for details that shouldn't clutter the default view
- Use \`Button\` + \`on\` + \`visible\` for interactive demos and runbooks

## Code Syntax Highlighting

Fenced code blocks with a language tag get automatic syntax highlighting via highlight.js:

\\\`\\\`\\\`python
def hello():
    print("highlighted!")
\\\`\\\`\\\`

Supported languages include: python, javascript, typescript, go, rust, bash, sql, json, yaml, html, css, and many more.

## Agent Workflow

\`\`\`bash
# 1. Write the markdown file locally
# 2. Upload with images
RESULT=$(curl -s -X POST BASE_URL/api/upload \\
  -F "files=@pres.md" -F "files=@fig1.png" -F "files=@fig2.png")
ID=$(echo $RESULT | jq -r '.id')
echo "https://present.spongeboi.com/p/$ID"

# 3. Update later (same ID, link never changes)
curl -s -X PUT "BASE_URL/api/presentations/$ID" \\
  -F "files=@pres_v2.md" -F "files=@fig3.png"
\`\`\`
`;

export async function GET() {
  return new NextResponse(SKILL, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
