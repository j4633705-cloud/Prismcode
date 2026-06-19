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
  },
  {
    icon: GitBranch,
    title: "Plan & Build",
    desc: "Read-only analysis or full implementation. One keystroke to toggle between modes.",
    size: "lg",
  },
  {
    icon: ShieldCheck,
    title: "Tool Confirmation",
    desc: "Destructive operations require your approval before executing. You stay in control.",
    size: "sm",
  },
  {
    icon: Repeat,
    title: "Agentic Loop",
    desc: "Autonomous multi-step execution with up to 50 tool-calling steps per request.",
    size: "sm",
  },
  {
    icon: Globe,
    title: "Web Search",
    desc: "Built-in search via DuckDuckGo with fallback to multi-provider search.",
    size: "sm",
  },
  {
    icon: History,
    title: "Persistent Sessions",
    desc: "All history saved locally and searchable. Pick up exactly where you left off.",
    size: "md",
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
    <section id="features" className="border-t border-neutral-800 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-16"
        >
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-neutral-50">
            Everything you need<br />to ship faster
          </h2>
          <p className="mt-3 max-w-md text-neutral-500">
            Built for developers who want AI assistance without leaving the terminal.
          </p>
        </motion.div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:grid-rows-2">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: delays[f.size] ?? 0, ease: [0.16, 1, 0.3, 1] as const }}
              className={`group rounded-lg border border-neutral-800 bg-neutral-900/50 p-5 hover-card ${
                sizeClasses[f.size]
              } ${f.size === "lg" ? "lg:col-span-2" : ""}`}
            >
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-md bg-neutral-800 text-neutral-400 transition-colors group-hover:bg-neutral-700 group-hover:text-neutral-200">
                <f.icon size={17} />
              </div>
              <h3 className="mb-1.5 text-base font-medium text-neutral-50">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed text-neutral-500">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
