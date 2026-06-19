"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, GitBranch, Sparkles, Terminal, Zap } from "lucide-react";

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
    <section ref={heroRef} className="relative overflow-hidden px-6 pb-20 pt-28 sm:pt-32">
      <CursorGlow containerRef={heroRef} />
      <div className="bg-prism-pattern pointer-events-none absolute inset-0 opacity-35" />
      <div className="hero-radial pointer-events-none absolute inset-0" />

      <div className="relative z-10 mx-auto grid min-h-[78svh] max-w-6xl items-center gap-12 lg:grid-cols-[0.92fr_1.08fr]">
        <div>
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-white/[0.035] px-4 py-1.5 text-xs text-neutral-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-300 animate-beacon" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
            </span>
            Open source agent for serious terminal workflows
          </div>

          <h1 className="max-w-3xl text-[clamp(3rem,7vw,6.8rem)] font-semibold leading-[0.92] tracking-[0] text-neutral-50">
            Ship code from a command center.
          </h1>

          <p className="mt-6 max-w-xl text-base leading-8 text-neutral-400 sm:text-lg">
            PrismCode maps your repo, plans changes, runs tools, and keeps the whole loop inside the terminal. Built for fast edits, careful approvals, and multi-model work.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/docs"
              className="group inline-flex h-12 items-center justify-center gap-2.5 rounded-lg border border-white/15 bg-neutral-50 px-5 text-sm font-semibold text-black shadow-[0_20px_80px_rgba(255,255,255,0.16)] transition-all hover:bg-white active:scale-[0.98]"
            >
              <Terminal size={16} />
              Start building
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="https://github.com/j4633705-cloud/Prismcode"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/[0.035] px-5 text-sm font-medium text-neutral-300 backdrop-blur-xl transition-all hover:border-white/20 hover:text-neutral-50 active:scale-[0.98]"
            >
              View repository
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </a>
          </div>

          <div className="mt-8 grid max-w-xl grid-cols-1 gap-3 text-xs text-neutral-500 sm:grid-cols-3">
            {[
              ["No config", "Run in any repo"],
              ["25+ models", "Switch anytime"],
              ["Local history", "Resume sessions"],
            ].map(([label, detail]) => (
              <div key={label} className="rounded-lg border border-white/10 bg-white/[0.025] p-3">
                <div className="text-neutral-200">{label}</div>
                <div className="mt-1">{detail}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-stage relative mx-auto w-full max-w-[660px]">
          <div className="command-deck relative">
            <div className="deck-panel deck-panel-back" />
            <div className="deck-panel deck-panel-mid" />
            <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#050607]/95 shadow-[0_40px_120px_rgba(0,0,0,0.75)]">
              <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-rose-400/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-amber-300/70" />
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald-300/70" />
                </div>
                <div className="font-mono text-[11px] text-neutral-500">prismcode:~/nightcode</div>
                <div className="rounded-md border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[10px] font-medium text-emerald-200">BUILD</div>
              </div>

              <div className="grid gap-0 lg:grid-cols-[1fr_190px]">
                <div className="p-5 font-mono text-sm leading-relaxed">
                  <div className="flex items-center gap-2 text-neutral-500">
                    <span>$</span>
                    <span className="text-neutral-200">prismcode</span>
                  </div>
                  <div className="mt-5 rounded-lg border border-white/10 bg-white/[0.03] p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs text-neutral-300">
                      <Sparkles size={14} className="text-cyan-200" />
                      Planning safe implementation
                    </div>
                    <div className="space-y-2 text-xs">
                      {[
                        ["scan", "src/app, packages/server"],
                        ["edit", "components/hero.tsx"],
                        ["verify", "typecheck, next build"],
                      ].map(([label, value]) => (
                        <div key={label} className="flex items-center justify-between gap-4 rounded-md bg-black/35 px-3 py-2">
                          <span className="text-neutral-500">{label}</span>
                          <span className="truncate text-neutral-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 text-xs text-neutral-400">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={14} className="text-emerald-300" />
                      Repo indexed across workspaces
                    </div>
                    <div className="flex items-center gap-2">
                      <GitBranch size={14} className="text-cyan-200" />
                      Patch ready with approval gates
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap size={14} className="text-amber-200" />
                      Tool loop active <span className="h-3 w-1 animate-blink bg-neutral-300" />
                    </div>
                  </div>
                </div>

                <div className="border-t border-white/10 bg-white/[0.025] p-5 lg:border-l lg:border-t-0">
                  <div className="text-xs uppercase tracking-[0] text-neutral-500">Model rail</div>
                  <div className="mt-4 space-y-3">
                    {["OpenAI", "Anthropic", "Gemini", "Groq"].map((model, i) => (
                      <div key={model} className="flex items-center gap-3">
                        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                          <div className="h-full rounded-full bg-neutral-200" style={{ width: `${88 - i * 13}%` }} />
                        </div>
                        <span className="w-16 text-right text-xs text-neutral-400">{model}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 rounded-lg border border-white/10 bg-black/30 p-3">
                    <div className="text-2xl font-semibold text-neutral-50">50</div>
                    <div className="mt-1 text-xs text-neutral-500">tool-call steps per request</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="prism-core" aria-hidden="true">
              <div className="prism-core-face prism-core-face-a" />
              <div className="prism-core-face prism-core-face-b" />
              <div className="prism-core-face prism-core-face-c" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
