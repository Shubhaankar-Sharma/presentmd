export function parseSlides(
  markdown: string,
  presentationId: string,
  r2PublicUrl: string
): string[] {
  // Extract YAML frontmatter for title slide
  const fmMatch = markdown.match(/^---\n([\s\S]*?)\n---\n?/);
  let titleSlide: string | null = null;
  let content = markdown;

  if (fmMatch) {
    content = markdown.slice(fmMatch[0].length);
    const fm = fmMatch[1];
    const title = fm.match(/title:\s*["']?(.+?)["']?\s*$/m)?.[1];
    const author = fm.match(/author:\s*["']?(.+?)["']?\s*$/m)?.[1];
    if (title) {
      titleSlide = `# ${title}${author ? `\n\n*${author}*` : ""}`;
    }
  }

  // Rewrite image paths to R2 CDN URLs
  content = content.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    (_match, alt, src) => {
      if (src.startsWith("http://") || src.startsWith("https://")) return `![${alt}](${src})`;
      const filename = src.split("/").pop() || src;
      return `![${alt}](${r2PublicUrl}/presentations/${presentationId}/${filename})`;
    }
  );

  // Split on <!-- end_slide -->
  const slides = content
    .split(/<!--\s*end_slide\s*-->/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Prepend title slide if extracted from frontmatter
  if (titleSlide) {
    slides.unshift(titleSlide);
  }

  return slides;
}
