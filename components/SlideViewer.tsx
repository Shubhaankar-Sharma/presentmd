"use client";

import { useState, useEffect, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

export default function SlideViewer({ slides }: { slides: string[] }) {
  const [current, setCurrent] = useState(0);
  const total = slides.length;

  const next = useCallback(() => setCurrent((c) => Math.min(c + 1, total - 1)), [total]);
  const prev = useCallback(() => setCurrent((c) => Math.max(c - 1, 0)), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault(); next();
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault(); prev();
      } else if (e.key === "Home") { setCurrent(0); }
      else if (e.key === "End") { setCurrent(total - 1); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [next, prev, total]);

  const slideContent = slides[current];
  const isTitleSlide = /^#\s+.+\n*(\*[^*]+\*)?$/.test(slideContent.trim());

  return (
    <div className="h-screen flex flex-col bg-black select-none">
      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center overflow-hidden"
           onClick={(e) => {
             const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
             if (e.clientX > rect.left + rect.width / 2) next(); else prev();
           }}>
        <div className={`w-full max-w-[1200px] mx-auto h-[calc(100vh-48px)]
          flex flex-col border-x border-[#1a1a1a]
          ${isTitleSlide ? "items-center justify-center text-center" : ""}`}>

          {/* Scrollable content */}
          <div className={`slide-content flex-1 px-12 md:px-16 py-10
            ${isTitleSlide ? "flex flex-col items-center justify-center" : ""}`}>
            <article className="prose prose-invert max-w-none w-full
              prose-headings:font-semibold prose-headings:tracking-tight prose-headings:text-white
              prose-h1:text-[2.5rem] prose-h1:leading-tight prose-h1:mb-8 prose-h1:font-bold
              prose-h2:text-2xl prose-h2:mb-5 prose-h2:text-[#e0e0e0]
              prose-h3:text-lg prose-h3:text-[#ccc]
              prose-p:text-[#aaa] prose-p:leading-[1.75] prose-p:text-[15px]
              prose-strong:text-white prose-strong:font-semibold
              prose-em:text-[#999]
              prose-code:bg-[#111] prose-code:text-[#e0e0e0] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-[3px] prose-code:text-[13px] prose-code:font-normal prose-code:before:content-none prose-code:after:content-none prose-code:border prose-code:border-[#222]
              prose-pre:bg-[#0a0a0a] prose-pre:border prose-pre:border-[#1a1a1a] prose-pre:rounded-lg prose-pre:text-[13px] prose-pre:leading-relaxed
              prose-table:text-[13px] prose-table:border-collapse
              prose-thead:border-[#222]
              prose-th:text-left prose-th:px-3 prose-th:py-2.5 prose-th:bg-[#0a0a0a] prose-th:text-[#ccc] prose-th:font-medium prose-th:border-b prose-th:border-[#222]
              prose-td:px-3 prose-td:py-2 prose-td:border-b prose-td:border-[#111] prose-td:text-[#999]
              prose-img:rounded-lg prose-img:mx-auto prose-img:max-h-[60vh] prose-img:border prose-img:border-[#1a1a1a]
              prose-a:text-white prose-a:underline prose-a:decoration-[#444] prose-a:underline-offset-2 hover:prose-a:decoration-white
              prose-li:text-[#aaa] prose-li:text-[15px]
              prose-blockquote:border-[#333] prose-blockquote:text-[#888]
              prose-hr:border-[#1a1a1a]">
              <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                {slideContent}
              </ReactMarkdown>
            </article>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="h-12 flex items-center justify-between px-6 border-t border-[#1a1a1a] bg-black/80 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <button onClick={prev} disabled={current === 0}
            className="text-[#666] hover:text-white disabled:opacity-20 text-xs font-mono transition-colors">
            ← prev
          </button>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[#444] font-mono text-xs tracking-wider">
            {String(current + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <div className="w-24 h-[2px] bg-[#1a1a1a] rounded-full overflow-hidden">
            <div className="h-full bg-white/40 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${((current + 1) / total) * 100}%` }} />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={next} disabled={current === total - 1}
            className="text-[#666] hover:text-white disabled:opacity-20 text-xs font-mono transition-colors">
            next →
          </button>
        </div>
      </div>
    </div>
  );
}
