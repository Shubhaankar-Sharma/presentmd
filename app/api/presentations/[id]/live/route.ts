import { NextRequest, NextResponse } from "next/server";
import { getPresentation, getLiveState, setLiveState } from "@/lib/storage";

export const dynamic = "force-dynamic";

const NO_STORE = { "Cache-Control": "no-store" };

// A live session is considered active only if it was updated recently. After
// this window, the deck behaves like a normal standalone deck (no following).
const STALE_MS = 30_000;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const state = await getLiveState(id);
  if (!state) {
    return NextResponse.json(
      { slide: 0, updatedAt: null, live: false },
      { headers: NO_STORE }
    );
  }
  const live = Date.now() - Date.parse(state.updatedAt) < STALE_MS;
  return NextResponse.json(
    { slide: state.slide, updatedAt: state.updatedAt, live },
    { headers: NO_STORE }
  );
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let body: { slide?: unknown; token?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400, headers: NO_STORE });
  }

  const slide = body.slide;
  const token = body.token;
  if (typeof slide !== "number" || typeof token !== "string") {
    return NextResponse.json({ error: "Bad request" }, { status: 400, headers: NO_STORE });
  }

  const meta = await getPresentation(id);
  if (!meta) {
    return NextResponse.json({ error: "Not found" }, { status: 404, headers: NO_STORE });
  }
  if (!meta.presenterToken || token !== meta.presenterToken) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403, headers: NO_STORE });
  }

  const state = await setLiveState(id, slide);
  return NextResponse.json(
    { slide: state.slide, updatedAt: state.updatedAt, live: true },
    { headers: NO_STORE }
  );
}
