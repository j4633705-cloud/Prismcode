import { Github, MessageCircle, Twitter } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-800">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-50">
                <span className="text-xs font-bold text-black">P</span>
              </div>
              <span className="text-sm font-semibold text-neutral-200">PrismCode</span>
            </div>
            <p className="mt-2 max-w-xs text-sm text-neutral-500">
              The terminal AI agent for your codebase.
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Product</h4>
            <div className="flex flex-col gap-2 text-sm text-neutral-500">
              <Link href="/#features" className="hover:text-neutral-300 transition-colors">Features</Link>
              <Link href="/#pricing" className="hover:text-neutral-300 transition-colors">Pricing</Link>
              <Link href="/docs" className="hover:text-neutral-300 transition-colors">Docs</Link>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Community</h4>
            <div className="flex flex-col gap-2 text-sm text-neutral-500">
              <a href="https://github.com/prismcode/prismcode" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">GitHub</a>
              <a href="https://discord.gg/prismcode" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">Discord</a>
              <a href="https://twitter.com/prismcode" target="_blank" rel="noopener noreferrer" className="hover:text-neutral-300 transition-colors">X / Twitter</a>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-semibold text-neutral-400 uppercase tracking-wider">Legal</h4>
            <div className="flex flex-col gap-2 text-sm text-neutral-500">
              <Link href="/privacy" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
              <Link href="/terms" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="mt-12 flex items-center justify-between border-t border-neutral-800 pt-6">
          <p className="text-xs text-neutral-600">
            &copy; {new Date().getFullYear()} PrismCode. All rights reserved.
          </p>
          <div className="flex gap-4 text-neutral-500">
            <a href="https://github.com/prismcode/prismcode" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <Github size={16} className="hover:text-neutral-300 transition-colors" />
            </a>
            <a href="https://discord.gg/prismcode" target="_blank" rel="noopener noreferrer" aria-label="Discord">
              <MessageCircle size={16} className="hover:text-neutral-300 transition-colors" />
            </a>
            <a href="https://twitter.com/prismcode" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <Twitter size={16} className="hover:text-neutral-300 transition-colors" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
