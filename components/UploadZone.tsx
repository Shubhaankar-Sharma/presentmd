"use client";

import { useState, useCallback, DragEvent } from "react";

export default function UploadZone() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [presenterUrl, setPresenterUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = useCallback((incoming: FileList) => {
    setFiles(Array.from(incoming));
    setShareUrl(null);
    setPresenterUrl(null);
    setError(null);
  }, []);

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length) handleFiles(e.dataTransfer.files);
  };

  const handleSubmit = async () => {
    const mdFile = files.find((f) => f.name.endsWith(".md"));
    if (!mdFile) { setError("No .md file found"); return; }

    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      for (const f of files) form.append("files", f);

      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setShareUrl(`${window.location.origin}/p/${data.id}`);
      if (data.presenterUrl) setPresenterUrl(`${window.location.origin}${data.presenterUrl}`);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const mdCount = files.filter((f) => f.name.endsWith(".md")).length;
  const imgCount = files.filter((f) => /\.(png|jpg|jpeg|gif|svg|webp)$/i.test(f.name)).length;

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors cursor-pointer
          ${dragOver ? "border-blue-400 bg-blue-400/10" : "border-gray-700 hover:border-gray-500"}`}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.multiple = true;
          input.onchange = (e) => {
            const target = e.target as HTMLInputElement;
            if (target.files) handleFiles(target.files);
          };
          input.click();
        }}
      >
        <p className="text-gray-400 text-lg">
          Drop files here or click to browse
        </p>
        <p className="text-gray-600 text-sm mt-2">
          One .md file + image files (png, jpg, svg, etc.)
        </p>
      </div>

      {files.length > 0 && (
        <div className="bg-gray-900 rounded-lg p-4 space-y-3">
          <p className="text-sm text-gray-400">
            {mdCount} markdown, {imgCount} images, {files.length} total files
          </p>
          <div className="max-h-32 overflow-y-auto text-xs text-gray-500 space-y-1">
            {files.map((f, i) => (
              <div key={i}>{f.name} ({(f.size / 1024).toFixed(0)} KB)</div>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={uploading || mdCount === 0}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 font-medium transition-colors"
          >
            {uploading ? "Uploading..." : "Upload & Create Presentation"}
          </button>
        </div>
      )}

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {shareUrl && (
        <div className="bg-green-900/30 border border-green-700 rounded-lg p-4 space-y-3">
          <p className="text-green-400 font-medium">Presentation created!</p>
          <div className="space-y-1">
            <p className="text-xs text-gray-500 uppercase tracking-wide">Share link (viewers)</p>
            <a href={shareUrl} className="text-blue-400 underline break-all">{shareUrl}</a>
          </div>
          {presenterUrl && (
            <div className="space-y-1">
              <p className="text-xs text-gray-500 uppercase tracking-wide">Presenter link (keep private — drives live sync)</p>
              <a href={presenterUrl} className="text-blue-400 underline break-all">{presenterUrl}</a>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
