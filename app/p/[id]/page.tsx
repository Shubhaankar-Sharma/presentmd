import { getPresentation } from "@/lib/storage";
import SlideViewer from "@/components/SlideViewer";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PresentationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const presentation = getPresentation(id);
  if (!presentation) notFound();

  return (
    <div>
      <SlideViewer slides={presentation.slides} />
    </div>
  );
}
