import { getPresentation } from "@/lib/storage";
import SlideViewer from "@/components/SlideViewer";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PresentationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ present?: string }>;
}) {
  const { id } = await params;
  const { present } = await searchParams;
  const presentation = await getPresentation(id);
  if (!presentation) notFound();

  // Presenter mode only when the supplied token matches. Never leak the token
  // into the rendered page for non-presenters.
  const isPresenter = !!present && present === presentation.presenterToken;

  return (
    <div>
      <SlideViewer
        slides={presentation.slides}
        presentationId={id}
        isPresenter={isPresenter}
        presenterToken={isPresenter ? presentation.presenterToken : undefined}
      />
    </div>
  );
}
