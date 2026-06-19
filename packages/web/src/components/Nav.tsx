import { Link } from "react-router-dom";

const navLinks = [
  { to: "/#features", label: "Features" },
  { to: "/#pricing", label: "Pricing" },
  { to: "/docs", label: "Docs" },
  { href: "https://github.com/davifariasp/prismcode", label: "GitHub" },
];

export function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-6 bg-[#0a0a0a]/85 backdrop-blur-md border-b border-white/[0.04]">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 text-white font-semibold text-sm">
          <span className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
            P
          </span>
          PrismCode
        </Link>
        <div className="hidden sm:flex items-center gap-6">
          {navLinks.map((l) =>
            l.href ? (
              <a key={l.label} href={l.href} target="_blank" className="text-xs text-white/35 hover:text-white/70 transition font-medium">
                {l.label}
              </a>
            ) : (
              <a key={l.label} href={l.to} className="text-xs text-white/35 hover:text-white/70 transition font-medium">
                {l.label}
              </a>
            ),
          )}
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="text-xs text-white/35 hover:text-white/70 transition font-medium">
          Dashboard
        </Link>
        <a href="#" className="bg-white/10 hover:bg-white/15 text-white text-xs font-medium px-4 py-1.5 rounded-md transition">
          Download
        </a>
      </div>
    </nav>
  );
}
