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
