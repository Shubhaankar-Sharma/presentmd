import React, { useState } from "react";
import { useStateBinding } from "@json-render/react";
import { defineCatalog } from "@json-render/core";
import { schema } from "@json-render/react/schema";
import { defineRegistry } from "@json-render/react";
import { z } from "zod";

/**
 * Presentation-focused json-render catalog.
 * Defines the component vocabulary for ```json-render fenced code blocks in slides.
 */
export const catalog = defineCatalog(schema, {
  components: {
    // --- Layout ---
    Card: {
      props: z.object({
        title: z.string().nullable(),
        description: z.string().nullable(),
        variant: z.enum(["default", "outline", "filled"]).nullable(),
      }),
      slots: ["default"],
      description: "Container card for grouping content with optional title",
    },
    Stack: {
      props: z.object({
        direction: z.enum(["horizontal", "vertical"]).nullable(),
        gap: z.enum(["sm", "md", "lg"]).nullable(),
        align: z.enum(["start", "center", "end", "stretch"]).nullable(),
      }),
      slots: ["default"],
      description: "Flex layout container for arranging children",
    },
    Grid: {
      props: z.object({
        columns: z.number().nullable(),
        gap: z.enum(["sm", "md", "lg"]).nullable(),
      }),
      slots: ["default"],
      description: "Grid layout with configurable columns",
    },

    // --- Typography ---
    Text: {
      props: z.object({
        content: z.string(),
        size: z.enum(["xs", "sm", "md", "lg", "xl"]).nullable(),
        color: z.string().nullable(),
        weight: z.enum(["normal", "medium", "semibold", "bold"]).nullable(),
      }),
      description: "Text element with styling options",
    },
    Heading: {
      props: z.object({
        content: z.string(),
        level: z.enum(["1", "2", "3"]).nullable(),
      }),
      description: "Section heading",
    },

    // --- Data Display ---
    Badge: {
      props: z.object({
        label: z.string(),
        color: z.enum(["red", "green", "blue", "yellow", "purple", "gray"]).nullable(),
      }),
      description: "Small colored label / tag",
    },
    Alert: {
      props: z.object({
        title: z.string().nullable(),
        message: z.string(),
        variant: z.enum(["info", "success", "warning", "error"]).nullable(),
      }),
      description: "Callout / alert box",
    },
    Table: {
      props: z.object({
        headers: z.array(z.string()),
        rows: z.array(z.array(z.string())),
        striped: z.boolean().nullable(),
      }),
      description: "Data table with headers and rows",
    },
    Progress: {
      props: z.object({
        value: z.number(),
        max: z.number().nullable(),
        label: z.string().nullable(),
        color: z.enum(["red", "green", "blue", "yellow", "purple"]).nullable(),
      }),
      description: "Progress / percentage bar",
    },
    BarGraph: {
      props: z.object({
        data: z.array(z.object({ label: z.string(), value: z.number() })),
        title: z.string().nullable(),
        color: z.enum(["red", "green", "blue", "yellow", "purple", "cyan"]).nullable(),
      }),
      description: "Horizontal bar chart for comparing values",
    },

    // --- Interactive ---
    Tabs: {
      props: z.object({
        tabs: z.array(z.object({ label: z.string(), content: z.string() })),
      }),
      description: "Tabbed content switcher",
    },
    Accordion: {
      props: z.object({
        items: z.array(z.object({ title: z.string(), content: z.string() })),
      }),
      description: "Expandable/collapsible sections",
    },
    Button: {
      props: z.object({
        label: z.string(),
        color: z.enum(["red", "green", "blue", "yellow", "purple", "gray", "cyan"]).nullable(),
        variant: z.enum(["solid", "outline", "ghost"]).nullable(),
        size: z.enum(["sm", "md", "lg"]).nullable(),
      }),
      description: "Clickable button that emits a 'click' event for actions",
    },
    Toggle: {
      props: z.object({
        label: z.string().nullable(),
        statePath: z.string(),
      }),
      description: "Toggle switch bound to a state path",
    },
    StatValue: {
      props: z.object({
        statePath: z.string(),
        prefix: z.string().nullable(),
        suffix: z.string().nullable(),
        size: z.enum(["xs", "sm", "md", "lg", "xl"]).nullable(),
        color: z.string().nullable(),
        weight: z.enum(["normal", "medium", "semibold", "bold"]).nullable(),
      }),
      description: "Displays a live value from state",
    },
    Pill: {
      props: z.object({
        items: z.array(z.object({ label: z.string(), value: z.string() })),
        statePath: z.string(),
      }),
      description: "Pill selector that sets a state path to the selected value",
    },

    // --- Presentation-specific ---
    Separator: {
      props: z.object({
        label: z.string().nullable(),
      }),
      description: "Horizontal divider with optional label",
    },
    Image: {
      props: z.object({
        src: z.string(),
        alt: z.string().nullable(),
        width: z.number().nullable(),
        height: z.number().nullable(),
      }),
      description: "Image element",
    },
  },
  actions: {},
});

/* ---------- Color helpers ---------- */

const colorMap: Record<string, string> = {
  red: "#ef4444",
  green: "#22c55e",
  blue: "#3b82f6",
  yellow: "#eab308",
  purple: "#a855f7",
  gray: "#888",
  cyan: "#06b6d4",
};

const bgColorMap: Record<string, string> = {
  red: "rgba(239,68,68,0.15)",
  green: "rgba(34,197,94,0.15)",
  blue: "rgba(59,130,246,0.15)",
  yellow: "rgba(234,179,8,0.15)",
  purple: "rgba(168,85,247,0.15)",
  cyan: "rgba(6,182,212,0.15)",
};

const gapMap: Record<string, string> = { sm: "0.5rem", md: "1rem", lg: "1.5rem" };
const sizeMap: Record<string, string> = { xs: "0.75rem", sm: "0.875rem", md: "1rem", lg: "1.125rem", xl: "1.25rem" };
const weightMap: Record<string, number> = { normal: 400, medium: 500, semibold: 600, bold: 700 };

const alertStyles: Record<string, { border: string; bg: string; text: string }> = {
  info: { border: "#3b82f6", bg: "rgba(59,130,246,0.1)", text: "#93c5fd" },
  success: { border: "#22c55e", bg: "rgba(34,197,94,0.1)", text: "#86efac" },
  warning: { border: "#eab308", bg: "rgba(234,179,8,0.1)", text: "#fde047" },
  error: { border: "#ef4444", bg: "rgba(239,68,68,0.1)", text: "#fca5a5" },
};

/* ---------- Registry: maps catalog components to React ---------- */

export const { registry } = defineRegistry(catalog, {
  components: {
    Card: ({ props, children }) => {
      const variant = props.variant ?? "default";
      const styles: Record<string, React.CSSProperties> = {
        default: { background: "#0a0a0a", border: "1px solid #1a1a1a", borderRadius: "0.5rem", padding: "1rem" },
        outline: { background: "transparent", border: "1px solid #333", borderRadius: "0.5rem", padding: "1rem" },
        filled: { background: "#111", border: "1px solid #222", borderRadius: "0.5rem", padding: "1rem" },
      };
      return (
        <div style={styles[variant]}>
          {props.title && <h3 style={{ color: "#e0e0e0", fontWeight: 600, marginBottom: "0.5rem", fontSize: "1rem" }}>{props.title}</h3>}
          {props.description && <p style={{ color: "#999", fontSize: "0.875rem", marginBottom: "0.75rem" }}>{props.description}</p>}
          {children}
        </div>
      );
    },

    Stack: ({ props, children }) => {
      const dir = props.direction ?? "vertical";
      const gap = gapMap[props.gap ?? "md"];
      const alignItems: Record<string, string> = { start: "flex-start", center: "center", end: "flex-end", stretch: "stretch" };
      return (
        <div style={{
          display: "flex",
          flexDirection: dir === "horizontal" ? "row" : "column",
          gap,
          alignItems: alignItems[props.align ?? "stretch"],
        }}>
          {children}
        </div>
      );
    },

    Grid: ({ props, children }) => (
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${props.columns ?? 2}, 1fr)`,
        gap: gapMap[props.gap ?? "md"],
      }}>
        {children}
      </div>
    ),

    Text: ({ props }) => (
      <p style={{
        color: props.color ? (colorMap[props.color] ?? props.color) : "#aaa",
        fontSize: sizeMap[props.size ?? "md"],
        fontWeight: weightMap[props.weight ?? "normal"],
        margin: 0,
        lineHeight: 1.6,
      }}>
        {props.content}
      </p>
    ),

    Heading: ({ props }) => {
      const level = props.level ?? "2";
      const sizes: Record<string, string> = { "1": "1.5rem", "2": "1.25rem", "3": "1.1rem" };
      const style: React.CSSProperties = { color: "#fff", fontWeight: 600, fontSize: sizes[level], margin: "0 0 0.5rem 0" };
      if (level === "1") return <h1 style={style}>{props.content}</h1>;
      if (level === "3") return <h3 style={style}>{props.content}</h3>;
      return <h2 style={style}>{props.content}</h2>;
    },

    Badge: ({ props }) => {
      const c = props.color ?? "gray";
      return (
        <span style={{
          display: "inline-block",
          padding: "2px 8px",
          borderRadius: "9999px",
          fontSize: "0.75rem",
          fontWeight: 500,
          color: colorMap[c] ?? "#888",
          background: bgColorMap[c] ?? "rgba(136,136,136,0.15)",
        }}>
          {props.label}
        </span>
      );
    },

    Alert: ({ props }) => {
      const v = props.variant ?? "info";
      const s = alertStyles[v];
      return (
        <div style={{ borderLeft: `3px solid ${s.border}`, background: s.bg, padding: "0.75rem 1rem", borderRadius: "0.375rem" }}>
          {props.title && <div style={{ color: s.text, fontWeight: 600, marginBottom: "0.25rem", fontSize: "0.875rem" }}>{props.title}</div>}
          <div style={{ color: s.text, fontSize: "0.875rem", opacity: 0.9 }}>{props.message}</div>
        </div>
      );
    },

    Table: ({ props }) => (
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.8125rem" }}>
        <thead>
          <tr>
            {props.headers.map((h: string, i: number) => (
              <th key={i} style={{ textAlign: "left", padding: "0.625rem 0.75rem", background: "#0a0a0a", color: "#ccc", fontWeight: 500, borderBottom: "1px solid #222" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.rows.map((row: string[], ri: number) => (
            <tr key={ri} style={{ background: props.striped && ri % 2 === 1 ? "#0d0d0d" : "transparent" }}>
              {row.map((cell: string, ci: number) => (
                <td key={ci} style={{ padding: "0.5rem 0.75rem", borderBottom: "1px solid #111", color: "#999" }}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    ),

    Progress: ({ props }) => {
      const max = props.max ?? 100;
      const pct = Math.min(100, Math.max(0, (props.value / max) * 100));
      const c = props.color ?? "blue";
      return (
        <div>
          {props.label && <div style={{ color: "#ccc", fontSize: "0.8125rem", marginBottom: "0.375rem" }}>{props.label}: {props.value}/{max}</div>}
          <div style={{ width: "100%", height: "8px", background: "#1a1a1a", borderRadius: "4px", overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: colorMap[c] ?? "#3b82f6", borderRadius: "4px", transition: "width 0.3s" }} />
          </div>
        </div>
      );
    },

    BarGraph: ({ props }) => {
      const maxVal = Math.max(...props.data.map((d: { label: string; value: number }) => d.value), 1);
      const c = props.color ?? "blue";
      return (
        <div>
          {props.title && <div style={{ color: "#e0e0e0", fontWeight: 600, marginBottom: "0.75rem", fontSize: "0.875rem" }}>{props.title}</div>}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {props.data.map((d: { label: string; value: number }, i: number) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ color: "#999", fontSize: "0.8125rem", width: "80px", flexShrink: 0, textAlign: "right" }}>{d.label}</span>
                <div style={{ flex: 1, height: "20px", background: "#1a1a1a", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${(d.value / maxVal) * 100}%`, height: "100%", background: colorMap[c] ?? "#3b82f6", borderRadius: "4px", transition: "width 0.3s" }} />
                </div>
                <span style={{ color: "#666", fontSize: "0.75rem", width: "40px", flexShrink: 0 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      );
    },

    Tabs: ({ props }) => {
      return <TabsClient tabs={props.tabs} />;
    },

    Accordion: ({ props }) => {
      return <AccordionClient items={props.items} />;
    },

    Button: ({ props, emit }) => {
      const c = props.color ?? "blue";
      const variant = props.variant ?? "solid";
      const sz = props.size ?? "md";
      const padMap: Record<string, string> = { sm: "4px 10px", md: "6px 14px", lg: "8px 20px" };
      const fsMap: Record<string, string> = { sm: "0.75rem", md: "0.8125rem", lg: "0.9375rem" };
      const base: React.CSSProperties = {
        padding: padMap[sz],
        fontSize: fsMap[sz],
        fontWeight: 500,
        borderRadius: "0.375rem",
        cursor: "pointer",
        transition: "all 0.15s",
        border: "1px solid",
      };
      const styles: Record<string, React.CSSProperties> = {
        solid: { ...base, background: colorMap[c] ?? c, borderColor: "transparent", color: "#fff" },
        outline: { ...base, background: "transparent", borderColor: colorMap[c] ?? c, color: colorMap[c] ?? c },
        ghost: { ...base, background: "transparent", borderColor: "transparent", color: colorMap[c] ?? c },
      };
      return (
        <button style={styles[variant]} onClick={() => emit("click")}>
          {props.label}
        </button>
      );
    },

    Toggle: ({ props }) => {
      return <ToggleClient label={props.label} statePath={props.statePath} />;
    },

    StatValue: ({ props }) => {
      return <StatValueClient {...props} />;
    },

    Pill: ({ props }) => {
      return <PillClient items={props.items} statePath={props.statePath} />;
    },

    Separator: ({ props }) => (
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", margin: "0.5rem 0" }}>
        <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
        {props.label && <span style={{ color: "#444", fontSize: "0.75rem", whiteSpace: "nowrap" }}>{props.label}</span>}
        <div style={{ flex: 1, height: "1px", background: "#1a1a1a" }} />
      </div>
    ),

    Image: ({ props }) => (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={props.src}
        alt={props.alt ?? ""}
        style={{
          maxWidth: props.width ? `${props.width}px` : "100%",
          maxHeight: props.height ? `${props.height}px` : "60vh",
          borderRadius: "0.5rem",
          border: "1px solid #1a1a1a",
        }}
      />
    ),
  },
  actions: {},
});

/* ---------- Interactive sub-components (need useState) ---------- */

function TabsClient({ tabs }: { tabs: { label: string; content: string }[] }) {
  const [active, setActive] = useState(0);
  return (
    <div>
      <div style={{ display: "flex", gap: "2px", borderBottom: "1px solid #1a1a1a", marginBottom: "0.75rem" }}>
        {tabs.map((t, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.8125rem",
              background: i === active ? "#111" : "transparent",
              color: i === active ? "#fff" : "#666",
              border: "none",
              borderBottom: i === active ? "2px solid #fff" : "2px solid transparent",
              cursor: "pointer",
              transition: "color 0.15s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div style={{ color: "#aaa", fontSize: "0.875rem", lineHeight: 1.6 }}>
        {tabs[active]?.content}
      </div>
    </div>
  );
}

function AccordionClient({ items }: { items: { title: string; content: string }[] }) {
  const [open, setOpen] = useState<Set<number>>(new Set());
  const toggle = (i: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i); else next.add(i);
      return next;
    });
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
      {items.map((item, i) => (
        <div key={i}>
          <button
            onClick={() => toggle(i)}
            style={{
              width: "100%",
              textAlign: "left",
              padding: "0.625rem 0.75rem",
              background: "#0a0a0a",
              border: "1px solid #1a1a1a",
              borderRadius: open.has(i) ? "0.375rem 0.375rem 0 0" : "0.375rem",
              color: "#e0e0e0",
              fontSize: "0.875rem",
              fontWeight: 500,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {item.title}
            <span style={{ color: "#666", fontSize: "0.75rem" }}>{open.has(i) ? "\u25B2" : "\u25BC"}</span>
          </button>
          {open.has(i) && (
            <div style={{
              padding: "0.75rem",
              background: "#0a0a0a",
              border: "1px solid #1a1a1a",
              borderTop: "none",
              borderRadius: "0 0 0.375rem 0.375rem",
              color: "#aaa",
              fontSize: "0.875rem",
              lineHeight: 1.6,
            }}>
              {item.content}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function ToggleClient({ label, statePath }: { label: string | null; statePath: string }) {
  const [value, setValue] = useStateBinding<boolean>(statePath);
  const isOn = !!value;
  return (
    <button
      onClick={() => setValue(!isOn)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.5rem",
        background: "transparent",
        border: "none",
        cursor: "pointer",
        padding: "4px 0",
      }}
    >
      <div style={{
        width: "36px",
        height: "20px",
        borderRadius: "10px",
        background: isOn ? "#22c55e" : "#333",
        position: "relative",
        transition: "background 0.2s",
      }}>
        <div style={{
          width: "16px",
          height: "16px",
          borderRadius: "50%",
          background: "#fff",
          position: "absolute",
          top: "2px",
          left: isOn ? "18px" : "2px",
          transition: "left 0.2s",
        }} />
      </div>
      {label && <span style={{ color: "#ccc", fontSize: "0.8125rem" }}>{label}</span>}
    </button>
  );
}

function StatValueClient({
  statePath, prefix, suffix, size, color, weight,
}: {
  statePath: string;
  prefix: string | null;
  suffix: string | null;
  size: string | null;
  color: string | null;
  weight: string | null;
}) {
  const [value] = useStateBinding<unknown>(statePath);
  return (
    <span style={{
      color: color ? (colorMap[color] ?? color) : "#e0e0e0",
      fontSize: sizeMap[size ?? "lg"],
      fontWeight: weightMap[weight ?? "bold"],
    }}>
      {prefix ?? ""}{String(value ?? 0)}{suffix ?? ""}
    </span>
  );
}

function PillClient({ items, statePath }: { items: { label: string; value: string }[]; statePath: string }) {
  const [value, setValue] = useStateBinding<string>(statePath);
  return (
    <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
      {items.map((item, i) => {
        const active = value === item.value;
        return (
          <button
            key={i}
            onClick={() => setValue(item.value)}
            style={{
              padding: "4px 12px",
              borderRadius: "9999px",
              fontSize: "0.8125rem",
              fontWeight: 500,
              border: "1px solid",
              borderColor: active ? "#3b82f6" : "#333",
              background: active ? "rgba(59,130,246,0.15)" : "transparent",
              color: active ? "#93c5fd" : "#888",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
