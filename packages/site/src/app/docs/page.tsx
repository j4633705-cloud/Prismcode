import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import Link from "next/link";

const sections = [
  {
    title: "Quick Start",
    content: (
      <>
        <p className="mb-4 text-neutral-400">
          PrismCode runs in your terminal, inside your project directory. Get started in seconds:
        </p>
        <div className="mb-4 rounded-lg border border-neutral-800 bg-[#050505] p-4 font-mono text-sm">
          <div><span className="text-neutral-600">$ </span><span className="text-neutral-200">npx @prismcode543/cli</span></div>
        </div>
        <p className="mb-4 text-neutral-400">Or install globally:</p>
        <div className="mb-4 rounded-lg border border-neutral-800 bg-[#050505] p-4 font-mono text-sm">
          <div><span className="text-neutral-600">$ </span><span className="text-neutral-200">npm install -g @prismcode543/cli</span></div>
          <div><span className="text-neutral-600">$ </span><span className="text-neutral-200">cd my-project</span></div>
          <div><span className="text-neutral-600">$ </span><span className="text-neutral-200">prismcode</span></div>
        </div>
      </>
    ),
  },
  {
    title: "Commands",
    content: (
      <>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-neutral-800">
                <th className="px-4 py-3 text-left font-medium text-neutral-200">Command</th>
                <th className="px-4 py-3 text-left font-medium text-neutral-200">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {[
                ["/new", "Start a new session"],
                ["/agents", "Switch between Build / Plan mode"],
                ["/models", "Change the AI model"],
                ["/sessions", "Browse past sessions"],
                ["/search", "Search across all sessions"],
                ["/theme", "Change the color theme"],
                ["/login", "Authenticate with Clerk"],
                ["/logout", "Clear authentication"],
                ["/upgrade", "Purchase credits"],
                ["/usage", "View credit usage"],
                ["Tab", "Toggle Build / Plan mode"],
                ["Esc", "Cancel streaming response"],
              ].map(([cmd, desc]) => (
                <tr key={cmd}>
                  <td className="px-4 py-3 font-mono text-neutral-300">{cmd}</td>
                  <td className="px-4 py-3 text-neutral-500">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    ),
  },
  {
    title: "Configuration",
    content: (
      <>
        <p className="mb-4 text-neutral-400">
          Create a <code className="rounded-md bg-neutral-800 px-2 py-0.5 font-mono text-sm text-neutral-300">prismcode.json</code> in your project root:
        </p>
        <div className="mb-4 rounded-lg border border-neutral-800 bg-[#050505] p-4 font-mono text-sm">
          <pre className="text-neutral-500">{`{
  "model": "claude-sonnet-4-6",
  "mode": "BUILD",
  "maxSteps": 10,
  "toolConfirmation": true,
  "costEstimation": true,
  "timeout": {
    "bash": 30000,
    "readFile": 10000
  },
  "ignore": ["node_modules", ".git", "dist"]
}`}</pre>
        </div>
        <p className="text-neutral-500 text-sm">All fields are optional. Defaults are used for missing values.</p>
      </>
    ),
  },
  {
    title: "API Server",
    content: (
      <>
        <p className="mb-4 text-neutral-400">
          The PrismCode server handles authentication, session persistence, and billing. Deploy with Docker:
        </p>
        <div className="mb-4 rounded-lg border border-neutral-800 bg-[#050505] p-4 font-mono text-sm">
          <pre className="text-neutral-500">{`docker build -t prismcode/server .
docker run -p 3001:3001 prismcode/server`}</pre>
        </div>
        <p className="text-neutral-500 text-sm mb-2">Required environment variables:</p>
        <ul className="list-disc pl-5 text-sm text-neutral-500 space-y-1">
          <li><code className="text-neutral-300">DATABASE_URL</code> — PostgreSQL connection string</li>
          <li><code className="text-neutral-300">CLERK_SECRET_KEY</code> — Clerk secret key</li>
          <li><code className="text-neutral-300">CLERK_PUBLISHABLE_KEY</code> — Clerk publishable key</li>
        </ul>
      </>
    ),
  },
  {
    title: "Local Development",
    content: (
      <>
        <p className="mb-4 text-neutral-400">Clone the repository:</p>
        <div className="mb-4 rounded-lg border border-neutral-800 bg-[#050505] p-4 font-mono text-sm">
          <pre className="text-neutral-500">{`git clone https://github.com/prismcode/prismcode
cd prismcode
bun install
bun run dev:server   # Terminal 1
bun run dev:cli      # Terminal 2`}</pre>
        </div>
      </>
    ),
  },
];

export default function DocsPage() {
  return (
    <>
      <Nav />
      <main className="min-h-screen pt-20">
        <div className="mx-auto max-w-4xl px-6 py-12">
          <h1 className="text-4xl font-semibold tracking-tight text-neutral-50">
            Documentation
          </h1>
          <p className="mt-4 text-lg text-neutral-500">
            Everything you need to use PrismCode effectively.
          </p>

          <div className="mt-12 space-y-16">
            {sections.map((section) => (
              <section key={section.title} className="scroll-mt-24">
                <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-200">
                  {section.title}
                </h2>
                <div className="leading-relaxed">
                  {section.content}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-16 rounded-lg border border-neutral-800 bg-neutral-900/30 p-8 text-center">
            <h3 className="text-base font-semibold text-neutral-200">Need help?</h3>
            <p className="mt-2 text-sm text-neutral-500">
              Join our{" "}
              <a href="https://discord.gg/prismcode" target="_blank" rel="noopener noreferrer" className="text-neutral-400 underline underline-offset-2 hover:text-neutral-200">
                Discord
              </a>{" "}
              or open an issue on{" "}
              <a href="https://github.com/prismcode/prismcode" target="_blank" rel="noopener noreferrer" className="text-neutral-400 underline underline-offset-2 hover:text-neutral-200">
                GitHub
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
