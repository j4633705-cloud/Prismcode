"use client";

import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "PrismCode understands my monorepo better than I do. The plan-build toggle is genius.",
    name: "Sarah Chen",
    role: "Engineer at Vercel",
    initials: "SC",
  },
  {
    quote: "Finally, an AI tool that respects my terminal workflow. No bloated IDE, no context switching.",
    name: "Marcus Johnson",
    role: "Founder",
    initials: "MJ",
  },
  {
    quote: "Multi-model support is incredible. Claude for architecture, GPT-4 for implementation — same session.",
    name: "Aiko Tanaka",
    role: "Full-stack Developer",
    initials: "AT",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-neutral-800 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as const }}
          className="mb-14"
        >
          <p className="mb-2 text-xs text-neutral-500 uppercase tracking-[0.15em]">Testimonials</p>
          <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl text-neutral-50">
            Loved by developers
          </h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] as const }}
              className="group rounded-lg border border-neutral-800 bg-neutral-950/30 p-6 hover-card"
            >
              <div className="mb-1 text-3xl font-light text-neutral-700 leading-none">&ldquo;</div>
              <p className="mb-6 text-sm leading-relaxed text-neutral-400">
                {t.quote}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-800 text-xs font-medium text-neutral-300">
                  {t.initials}
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-200">{t.name}</div>
                  <div className="text-xs text-neutral-500">{t.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
