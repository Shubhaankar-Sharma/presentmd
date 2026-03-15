import { NextRequest, NextResponse } from "next/server";
import { getPresentation, savePresentation, deletePresentation } from "@/lib/storage";
import { uploadToR2 } from "@/lib/r2";
import { parseSlides } from "@/lib/parseSlides";

export const dynamic = "force-dynamic";

const IMAGE_EXTS = /\.(png|jpg|jpeg|gif|svg|webp)$/i;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const presentation = await getPresentation(id);
  if (!presentation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(presentation);
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = await getPresentation(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const formData = await req.formData();
    const files = formData.getAll("files") as File[];
    const r2PublicUrl = process.env.R2_PUBLIC_URL || "";

    // Upload new/replacement images
    const imageFiles = files.filter((f) => IMAGE_EXTS.test(f.name));
    for (const img of imageFiles) {
      const filename = img.name.split("/").pop() || img.name;
      const buffer = Buffer.from(await img.arrayBuffer());
      const contentType = img.type || "application/octet-stream";
      await uploadToR2(`presentations/${id}/${filename}`, buffer, contentType);
    }

    // Update markdown if provided
    const mdFile = files.find((f) => f.name.endsWith(".md"));
    if (mdFile) {
      const markdown = await mdFile.text();
      const slides = parseSlides(markdown, id, r2PublicUrl);
      const titleMatch = markdown.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1] : existing.title;

      await savePresentation(id, {
        title,
        slides,
        createdAt: existing.createdAt,
      });

      return NextResponse.json({ id, slideCount: slides.length, updated: true });
    }

    return NextResponse.json({ id, imagesUpdated: imageFiles.length, updated: true });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const existing = await getPresentation(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await deletePresentation(id);
  return NextResponse.json({ id, deleted: true });
}
