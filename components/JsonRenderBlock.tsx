"use client";

import { useMemo } from "react";
import { ActionProvider, Renderer, StateProvider, VisibilityProvider } from "@json-render/react";
import { registry } from "@/lib/jsonRenderCatalog";

interface JsonRenderBlockProps {
  /** Raw JSON string from the ```json-render fenced code block */
  specString: string;
}

/**
 * Parses a JSON spec and renders it via json-render.
 * Falls back to a styled error message if the JSON is invalid.
 */
export default function JsonRenderBlock({ specString }: JsonRenderBlockProps) {
  const { spec, error } = useMemo(() => {
    try {
      const parsed = JSON.parse(specString);
      return { spec: parsed, error: null };
    } catch (e) {
      return { spec: null, error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [specString]);

  if (error || !spec) {
    return (
      <div style={{
        background: "rgba(239,68,68,0.1)",
        border: "1px solid rgba(239,68,68,0.3)",
        borderRadius: "0.5rem",
        padding: "0.75rem 1rem",
        fontSize: "0.8125rem",
      }}>
        <div style={{ color: "#ef4444", fontWeight: 600, marginBottom: "0.25rem" }}>
          json-render: Invalid spec
        </div>
        <div style={{ color: "#fca5a5" }}>{error}</div>
        <pre style={{
          marginTop: "0.5rem",
          padding: "0.5rem",
          background: "#0a0a0a",
          borderRadius: "0.25rem",
          fontSize: "0.75rem",
          color: "#666",
          overflow: "auto",
          maxHeight: "120px",
        }}>
          {specString}
        </pre>
      </div>
    );
  }

  return (
    <StateProvider initialState={{}}>
      <ActionProvider>
        <VisibilityProvider>
          <div style={{ margin: "0.75rem 0" }}>
            <Renderer spec={spec} registry={registry} />
          </div>
        </VisibilityProvider>
      </ActionProvider>
    </StateProvider>
  );
}
