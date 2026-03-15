export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl w-full space-y-10">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-white">presentmd</h1>
          <p className="text-[#888] text-lg">
            Headless markdown presentation hosting. API-only. No UI needed.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-sm font-mono text-[#666] uppercase tracking-wider">For agents</h2>
            <p className="text-[#aaa]">
              Fetch the skill doc and add it to your agent&apos;s context:
            </p>
            <pre className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 text-sm text-[#ccc] overflow-x-auto">
              <code>curl https://present.spongeboi.com/agents</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-mono text-[#666] uppercase tracking-wider">Quick example</h2>
            <pre className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg p-4 text-sm text-[#ccc] overflow-x-auto">
              <code>{`# Create a presentation
curl -X POST /api/upload \\
  -F "files=@slides.md" \\
  -F "files=@plot.png"

# Update it
curl -X PUT /api/presentations/ID \\
  -F "files=@slides_v2.md"

# View it
open https://present.spongeboi.com/p/ID`}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h2 className="text-sm font-mono text-[#666] uppercase tracking-wider">Endpoints</h2>
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg divide-y divide-[#1a1a1a] text-sm">
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-green-500 font-mono text-xs w-14">POST</span>
                <span className="text-[#ccc] font-mono">/api/upload</span>
                <span className="text-[#666] ml-auto">Create presentation</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-blue-400 font-mono text-xs w-14">GET</span>
                <span className="text-[#ccc] font-mono">/api/presentations/:id</span>
                <span className="text-[#666] ml-auto">Get data</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-yellow-500 font-mono text-xs w-14">PUT</span>
                <span className="text-[#ccc] font-mono">/api/presentations/:id</span>
                <span className="text-[#666] ml-auto">Update</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-red-400 font-mono text-xs w-14">DELETE</span>
                <span className="text-[#ccc] font-mono">/api/presentations/:id</span>
                <span className="text-[#666] ml-auto">Delete</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-blue-400 font-mono text-xs w-14">GET</span>
                <span className="text-[#ccc] font-mono">/p/:id</span>
                <span className="text-[#666] ml-auto">View slides</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3">
                <span className="text-blue-400 font-mono text-xs w-14">GET</span>
                <span className="text-[#ccc] font-mono">/agents</span>
                <span className="text-[#666] ml-auto">Agent skill doc (markdown)</span>
              </div>
            </div>
          </div>
        </div>

        <p className="text-[#333] text-xs font-mono">
          slides rendered client-side &middot; images on cloudflare r2 &middot; no auth
        </p>
      </div>
    </div>
  );
}
