"use client";

import { useEffect, useRef, useState } from "react";
import { Terminal, ArrowRight } from "lucide-react";

function CursorGlow({ containerRef }: { containerRef: React.RefObject<HTMLDivElement | null> }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setPos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [containerRef]);

  return (
    <div
      className="pointer-events-none absolute inset-0 transition-[background] duration-700"
      style={{
        background: `radial-gradient(ellipse 600px 400px at ${pos.x}% ${pos.y}%, rgba(250,250,250,0.04) 0%, transparent 100%)`,
      }}
    />
  );
}

export function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  return (
    <section ref={heroRef} className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-16">
      <CursorGlow containerRef={heroRef} />
      <div className="bg-prism-pattern pointer-events-none absolute inset-0 opacity-40" />
      <div className="bg-glow-hero pointer-events-none absolute inset-0" />

      {/* Floating diamonds */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="prism-diamond absolute left-[15%] top-[20%] h-8 w-8 border border-neutral-700/20 animate-float" style={{ animationDelay: "0s" }} />
        <div className="prism-diamond absolute right-[20%] top-[30%] h-5 w-5 border border-neutral-700/15 animate-float" style={{ animationDelay: "1.5s" }} />
        <div className="prism-diamond absolute left-[25%] bottom-[25%] h-6 w-6 border border-neutral-700/10 animate-float" style={{ animationDelay: "3s" }} />
        <div className="prism-diamond absolute right-[15%] bottom-[20%] h-10 w-10 border border-neutral-700/10 animate-float" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl text-center">
        <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-neutral-800 bg-neutral-950/70 px-4 py-1 text-xs text-neutral-400 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-neutral-50 animate-beacon" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-neutral-50" />
          </span>
          Open source · MIT license · v1.0
        </div>

        <h1 className="text-[clamp(2.5rem,8vw,7rem)] font-semibold leading-[0.95] tracking-tighter">
          <span className="text-neutral-50">Ship code</span>
          <br />
          <span className="text-neutral-500 italic font-light">from your terminal</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-base text-neutral-400 sm:text-lg">
          PrismCode understands your entire codebase. Plan, build, and ship with any AI model — without leaving your command line.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <a
            href="/docs"
            className="group inline-flex h-11 items-center gap-2.5 rounded-lg border border-neutral-700 bg-neutral-800 px-5 text-sm font-medium text-neutral-50 transition-all hover:bg-neutral-700 hover-lift active:scale-[0.98]"
          >
            <Terminal size={15} />
            Get started
            <span className="ml-0.5 rounded border border-neutral-600 px-1.5 py-0.5 text-[10px] text-neutral-400">npx</span>
          </a>
          <a
            href="https://github.com/j4633705-cloud/Prismcode"
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex h-11 items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950/50 px-5 text-sm font-medium text-neutral-400 transition-all hover:border-neutral-700 hover:text-neutral-200 hover-lift active:scale-[0.98]"
          >
            View on GitHub
            <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
          </a>
        </div>

        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-neutral-600">
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-neutral-700" />
            No config needed
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-neutral-700" />
            25+ AI models
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0.5 w-4 bg-neutral-700" />
            Works with any editor
          </span>
        </div>
      </div>

      <div className="relative z-10 mt-16 w-full max-w-xl">
        <div className="overflow-hidden rounded-lg border border-neutral-800 bg-[#050505] shadow-2xl">
          <div className="flex items-center gap-1.5 border-b border-neutral-800 px-4 py-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
            <div className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
            <div className="h-2.5 w-2.5 rounded-full bg-neutral-600" />
            <span className="ml-2 text-[11px] text-neutral-500">prismcode</span>
          </div>
          <div className="p-4 font-mono text-sm leading-relaxed">
            <div className="flex items-start gap-2 text-neutral-400">
              <span className="text-neutral-600">$</span>
              <span className="text-neutral-200">cd my-project</span>
            </div>
            <div className="mt-1.5 flex items-start gap-2 text-neutral-400">
              <span className="text-neutral-600">$</span>
              <div>
                <span className="text-neutral-50">prismcode</span>
                <div className="mt-2 space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-neutral-500">◉</span>
                    <span className="text-neutral-300">Plan mode</span>
                    <span className="text-neutral-500">· Analyzing project structure...</span>
                  </div>
                  <div className="border-l border-neutral-700 pl-3 text-xs text-neutral-400 space-y-0.5">
                    <div className="flex items-center gap-2"><span>build/</span></div>
                    <div className="flex items-center gap-2"><span>├── src/components/header.tsx</span><span className="text-neutral-500">— fix</span></div>
                    <div className="flex items-center gap-2"><span>├── src/lib/api.ts</span><span className="text-neutral-500">— add error handler</span></div>
                    <div className="flex items-center gap-2"><span>└── src/styles/</span><span className="text-neutral-500">— refactor</span></div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-neutral-500 pt-1">
                    <span className="text-neutral-400">Tab</span><span>· Plan</span><span>|</span>
                    <span className="text-neutral-400">esc</span><span>· stop</span><span>|</span>
                    <span className="text-neutral-400">mode</span><span>· BUILD</span>
                    <span className="h-3 w-1 animate-blink bg-neutral-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
