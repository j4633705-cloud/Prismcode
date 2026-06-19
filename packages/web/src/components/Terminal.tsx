const lines = [
  { type: "cmd", text: "prismcode" },
  { type: "dim", text: "PrismCode 1.0.0" },
  { type: "spacer" },
  { type: "prompt", text: "Explain this error and fix it" },
  { type: "spacer" },
  { type: "assistant", model: "claude-opus-4-6", text: "TypeError: Cannot read properties of undefined (reading 'map')" },
  { type: "assistant", model: "claude-opus-4-6", text: "The issue is that data might be undefined when the API" },
  { type: "assistant", model: "claude-opus-4-6", text: "returns before the promise resolves. Add optional chaining." },
  { type: "spacer" },
  { type: "prompt", text: "Check for security issues in this file" },
  { type: "spacer" },
  { type: "assistant", model: "gpt-5.4", text: "Found 2 issues: SQL injection in line 42, missing" },
  { type: "assistant", model: "gpt-5.4", text: "input sanitization in line 78. Use parameterized queries." },
  { type: "spacer" },
  { type: "prompt", text: "git commit -m \"fix: handle undefined data and sanitize inputs\"" },
  { type: "assistant", model: "main 8f3d2a1", text: "fix: handle undefined data and sanitize inputs" },
  { type: "dim", text: "3 files changed, 24 insertions(+), 9 deletions(-)" },
  { type: "cursor" },
];

export function Terminal() {
  return (
    <div className="rounded-lg overflow-hidden bg-[#0d0d0d] border border-white/[0.04] w-full">
      <div className="flex items-center gap-1.5 px-3 py-2 bg-white/[0.02] border-b border-white/[0.03]">
        <span className="w-1.5 h-1.5 rounded-full bg-red-400/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/40" />
        <span className="w-1.5 h-1.5 rounded-full bg-green-400/40" />
        <span className="text-[10px] text-white/[0.12] ml-2 font-mono">prismcode</span>
      </div>
      <div className="p-4 font-mono text-xs leading-[1.9] text-white/55">
        {lines.map((line, i) => {
          if (line.type === "spacer") return <div key={i}>&nbsp;</div>;
          if (line.type === "cursor") return <div key={i}><span className="text-green-400/70">&gt;</span> <span className="inline-block w-1.5 h-3.5 bg-indigo-400/50 align-text-bottom animate-pulse" /></div>;
          if (line.type === "cmd") return <div key={i}><span className="text-green-400/70">$</span> <span className="text-white/90">{line.text}</span></div>;
          if (line.type === "dim") return <div key={i} className="text-white/20">{line.text}</div>;
          if (line.type === "prompt") return <div key={i}><span className="text-green-400/70">&gt;</span> <span className="text-white/90">{line.text}</span></div>;
          if (line.type === "assistant") return <div key={i}><span className="text-indigo-400/60">[{line.model}]</span> {line.text}</div>;
          return null;
        })}
      </div>
    </div>
  );
}
