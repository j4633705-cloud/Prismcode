export function Docs() {
  const sections = [
    {
      title: "Installation",
      items: [
        { cmd: "bun install", desc: "Install all dependencies" },
        { cmd: "cp .env.example .env", desc: "Create environment config" },
        { cmd: "bun run setup", desc: "Initialize database" },
      ],
    },
    {
      title: "Running",
      items: [
        { cmd: "bun run dev:server", desc: "Start API server (port 3000)" },
        { cmd: "bun run dev:cli", desc: "Start terminal client" },
        { cmd: "bun run dev:web", desc: "Start landing page (port 3001)" },
      ],
    },
    {
      title: "Authentication",
      items: [
        { cmd: "prismcode login", desc: "Authenticate via browser OAuth" },
        { cmd: "prismcode logout", desc: "Clear local session" },
        { cmd: "prismcode whoami", desc: "Show current user" },
      ],
    },
    {
      title: "Configuration",
      items: [
        { cmd: "prismcode init", desc: "Interactive setup wizard" },
        { cmd: "prismcode config", desc: "View current configuration" },
        { cmd: "prismcode config set openai_api_key <key>", desc: "Set an API key" },
      ],
    },
    {
      title: "Chat",
      items: [
        { cmd: "prismcode", desc: "Start a new chat session" },
        { cmd: "prismcode --mode plan", desc: "Start in read-only plan mode" },
        { cmd: "prismcode --mode build", desc: "Start with write/edit/shell tools" },
        { cmd: "Ctrl+C", desc: "Cancel current response" },
      ],
    },
    {
      title: "Models",
      items: [
        { cmd: "/model claude-sonnet-4", desc: "Switch to Claude Sonnet" },
        { cmd: "/model gpt-4.1", desc: "Switch to GPT-4.1" },
        { cmd: "/model gemini-2.5-flash", desc: "Switch to Gemini Flash" },
        { cmd: "/model ollama", desc: "Switch to local Ollama model" },
      ],
    },
    {
      title: "Git",
      items: [
        { cmd: "git status", desc: "View working tree status" },
        { cmd: "git diff", desc: "Show unstaged changes" },
        { cmd: "git commit <message>", desc: "Stage and commit changes" },
        { cmd: "git log", desc: "Browse commit history" },
      ],
    },
  ];

  return (
    <main className="pt-24 pb-20 px-6 max-w-xl mx-auto">
      <h1 className="text-[28px] font-semibold text-white mb-2">Documentation</h1>
      <p className="text-sm text-white/35 mb-10">Commands and usage for PrismCode.</p>
      {sections.map((section) => (
        <div key={section.title} className="mb-10">
          <h2 className="text-[17px] font-semibold text-white mb-3">{section.title}</h2>
          <div className="flex flex-col gap-1.5">
            {section.items.map((item) => (
              <div key={item.cmd} className="flex items-baseline gap-3 px-4 py-2.5 rounded-lg bg-white/[0.02] border border-white/[0.03]">
                <code className="text-[13px] font-mono text-indigo-400/80 shrink-0">{item.cmd}</code>
                <span className="text-[13px] text-white/30">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
}
