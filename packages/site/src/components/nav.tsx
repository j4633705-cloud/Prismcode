"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

const links = [
  { href: "/#features", label: "Features" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/docs", label: "Docs" },
];

export function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-neutral-800 bg-black/80 backdrop-blur-xl" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-50">
              <span className="text-xs font-bold text-black">P</span>
            </div>
            <span className="text-sm font-semibold text-neutral-50">PrismCode</span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-1.5 text-sm text-neutral-400 transition-colors hover:text-neutral-200"
              >
                {link.label}
              </Link>
            ))}
            <div className="ml-3 pl-3 border-l border-neutral-800">
              <a
                href="https://github.com/j4633705-cloud/Prismcode"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-neutral-800 bg-neutral-900 px-3.5 py-1.5 text-sm text-neutral-300 transition-colors hover:border-neutral-700 hover:text-neutral-50"
              >
                GitHub
              </a>
            </div>
          </div>

          <button
            className="flex items-center text-neutral-400 md:hidden"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 bg-black/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex h-full flex-col items-center justify-center gap-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg text-neutral-400 transition-colors hover:text-neutral-50"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="https://github.com/j4633705-cloud/Prismcode"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 rounded-md border border-neutral-800 bg-neutral-900 px-6 py-2.5 text-sm text-neutral-300 transition-colors hover:border-neutral-700 hover:text-neutral-50"
            onClick={() => setOpen(false)}
          >
            GitHub
          </a>
        </div>
      </div>
    </>
  );
}
