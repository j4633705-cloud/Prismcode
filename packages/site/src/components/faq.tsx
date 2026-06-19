"use client";

import { useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { cat: "General", q: "What is PrismCode?", a: "PrismCode is a terminal-based AI coding agent. You run it in your project directory, and it can plan, analyze, and implement changes using 25+ AI models." },
  { cat: "General", q: "Which AI models are supported?", a: "Over 25 providers including Anthropic (Claude), OpenAI (GPT-4/4o), Google (Gemini), Groq, and OpenRouter. Switch at any time." },
  { cat: "Pricing", q: "Is PrismCode free?", a: "Yes, the Free tier includes open models with 50 sessions per day. Pro at $20/month unlocks all models and unlimited usage." },
  { cat: "Pricing", q: "What counts as a session?", a: "A session starts when you run PrismCode and ends when you exit. Background sessions don't count toward your limit." },
  { cat: "Technical", q: "How is this different from Cursor or Copilot?", a: "PrismCode runs entirely in your terminal. It supports agentic multi-step planning and works with any editor or IDE." },
  { cat: "Technical", q: "Does it require internet?", a: "AI inference needs internet. Your code never leaves your machine — only context relevant to your request is sent." },
  { cat: "Technical", q: "Can I use my own API keys?", a: "Yes. Configure keys for any supported provider in your environment or project config." },
  { cat: "General", q: "Is PrismCode open source?", a: "Yes, under the MIT license. Check our GitHub to contribute or open issues." },
];

const categories = ["All", "General", "Pricing", "Technical"];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = faqs.filter((faq) => {
    const matchCat = category === "All" || faq.cat === category;
    const matchSearch = !search || faq.q.toLowerCase().includes(search.toLowerCase()) || faq.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <section className="border-t border-neutral-800 py-24">
      <div className="mx-auto max-w-3xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-12 text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-neutral-50">
            Frequently asked questions
          </h2>
        </motion.div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-md bg-neutral-900 p-0.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded px-3 py-1.5 text-xs font-medium transition-all ${
                  category === cat ? "bg-neutral-800 text-neutral-200" : "text-neutral-500 hover:text-neutral-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="relative">
            <Search size={13} className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              type="text"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-md border border-neutral-800 bg-neutral-900 py-1.5 pl-8 pr-3 text-sm text-neutral-200 placeholder-neutral-500 outline-none transition-colors focus:border-neutral-700 sm:w-48"
            />
          </div>
        </div>

        <div className="space-y-2">
          {filtered.map((faq) => {
            const idx = faqs.indexOf(faq);
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2 }}
                className="rounded-lg border border-neutral-800 bg-neutral-900/30 overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="flex w-full items-center justify-between px-5 py-3.5 text-left text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-800/30"
                >
                  <span>{faq.q}</span>
                  <ChevronDown size={14} className={`shrink-0 text-neutral-500 transition-transform ${openIndex === idx ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openIndex === idx && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <p className="border-t border-neutral-800 px-5 py-3.5 text-sm leading-relaxed text-neutral-500">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-sm text-neutral-500 py-8">No results found.</p>
        )}

        <div className="mt-10 text-center">
          <p className="text-sm text-neutral-500">
            Still have questions?{" "}
            <a href="https://discord.gg/prismcode" target="_blank" rel="noopener noreferrer" className="text-neutral-400 underline underline-offset-2 hover:text-neutral-200">
              Join our Discord
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
