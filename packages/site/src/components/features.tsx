"use client";

import { motion } from "framer-motion";
import {
  Brain,
  GitBranch,
  ShieldCheck,
  Repeat,
  Globe,
  History,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "Multi-Model",
    desc: "25+ AI providers — Anthropic, OpenAI, Google, Groq, OpenRouter. Switch at any time.",
    size: "md",
    accent: "from-cyan-300/30 to-emerald-300/10",
  },
  {
    icon: GitBranch,
    title: "Plan & Build",
    desc: "Read-only analysis or full implementation. One keystroke to toggle between modes.",
    size: "lg",
    accent: "from-emerald-300/30 to-white/5",
  },
  {
    icon: ShieldCheck,
    title: "Tool Confirmation",
    desc: "Destructive operations require your approval before executing. You stay in control.",
    size: "sm",
    accent: "from-amber-200/25 to-white/5",
  },
  {
    icon: Repeat,
    title: "Agentic Loop",
    desc: "Autonomous multi-step execution with up to 50 tool-calling steps per request.",
    size: "sm",
    accent: "from-fuchsia-300/20 to-cyan-300/10",
  },
  {
    icon: Globe,
    title: "Web Search",
    desc: "Built-in search via DuckDuckGo with fallback to multi-provider search.",
    size: "sm",
    accent: "from-sky-300/25 to-white/5",
  },
  {
    icon: History,
    title: "Persistent Sessions",
    desc: "All history saved locally and searchable. Pick up exactly where you left off.",
    size: "md",
    accent: "from-neutral-100/20 to-emerald-300/10",
  },
];

const sizeClasses: Record<string, string> = {
  lg: "lg:col-span-2 lg:row-span-1",
  md: "lg:col-span-1 lg:row-span-1",
  sm: "lg:col-span-1 lg:row-span-1",
};

const delays: Record<string, number> = {
  lg: 0,
  md: 0.06,
  sm: 0.12,
};

export function Features() {
  return (
    <section id="features" className="relative border-t border-white/10 py-24">
      <div className="bg-section-glow pointer-events-none absolute inset-0" />
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-16 flex flex-col justify-between gap-6 md:flex-row md:items-end"
        >
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0] text-cyan-200/70">Agent workspace</p>
            <h2 className="text-3xl font-semibold tracking-[0] text-neutral-50 sm:text-4xl">
              Everything you need<br />to ship faster
            </h2>
          </div>
          <p className="max-w-md text-neutral-500">
            Built for developers who want AI assistance with repo context, approval gates, and terminal-native speed.
          </p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {features.map((f) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: delays[f.size] ?? 0, ease: [0.16, 1, 0.3, 1] as const }}
              className={`group relative overflow-hidden rounded-xl border border-white/10 bg-neutral-950/70 p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover-card ${
                sizeClasses[f.size]
              } ${f.size === "lg" ? "lg:col-span-2" : ""}`}
            >
              <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${f.accent}`} />
              <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${f.accent} opacity-[0.08]`} />
              <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-neutral-300 transition-colors group-hover:text-neutral-50">
                <f.icon size={17} />
              </div>
              <h3 className="mb-2 text-base font-medium text-neutral-50">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-500">
                {f.desc}
              </p>
              {f.size === "lg" && (
                <div className="mt-6 grid gap-2 font-mono text-[11px] text-neutral-500 sm:grid-cols-3">
                  {["read", "plan", "patch"].map((item, index) => (
                    <div key={item} className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300/80" />
                      <span>{index + 1}. {item}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
