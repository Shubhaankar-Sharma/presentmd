import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { uploadToR2 } from "@/lib/r2";
import { savePresentation } from "@/lib/storage";
import { parseSlides } from "@/lib/parseSlides";

const IMAGE_EXTS = /\.(png|jpg|jpeg|gif|svg|webp)$/i;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    const mdFile = files.find((f) => f.name.endsWith(".md"));
    if (!mdFile) {
      return NextResponse.json({ error: "No .md file found" }, { status: 400 });
    }

    const id = nanoid(10);
    const r2PublicUrl = process.env.R2_PUBLIC_URL || "";

    // Upload images to R2
    const imageFiles = files.filter((f) => IMAGE_EXTS.test(f.name));
    for (const img of imageFiles) {
      const filename = img.name.split("/").pop() || img.name;
      const buffer = Buffer.from(await img.arrayBuffer());
      const contentType = img.type || "application/octet-stream";
      await uploadToR2(`presentations/${id}/${filename}`, buffer, contentType);
    }

    // Parse markdown into slides
    const markdown = await mdFile.text();
    const slides = parseSlides(markdown, id, r2PublicUrl);

    // Extract title from first heading
    const titleMatch = markdown.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : mdFile.name.replace(".md", "");

    // Save presentation
    await savePresentation(id, {
      title,
      slides,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id, url: `/p/${id}`, slideCount: slides.length });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
