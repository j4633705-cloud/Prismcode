"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 12, suffix: "K+", label: "GitHub stars" },
  { value: 50, suffix: "K+", label: "Downloads" },
  { value: 100, suffix: "K+", label: "Sessions run" },
  { value: 25, suffix: "+", label: "AI providers" },
];

function CountUp({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const counted = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !counted.current) {
          counted.current = true;
          let start = 0;
          const duration = 1500;
          const step = Math.ceil(target / (duration / 16));
          const interval = setInterval(() => {
            start += step;
            if (start >= target) {
              setCount(target);
              clearInterval(interval);
            } else {
              setCount(start);
            }
          }, 16);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <div ref={ref} className="text-3xl font-semibold tracking-tight sm:text-4xl">
      <span className="text-neutral-50">
        {count}
        {suffix}
      </span>
    </div>
  );
}

export function Stats() {
  return (
    <section className="border-t border-neutral-800 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <div key={stat.label} className="text-center">
              <CountUp target={stat.value} suffix={stat.suffix} />
              <div className="mt-1 text-sm text-neutral-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
