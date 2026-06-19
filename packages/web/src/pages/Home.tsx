import { useState } from "react";
import { Terminal } from "../components/Terminal";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

const features = [
  {
    tag: "Multi-Provider",
    title: "Use any model from one terminal.",
    desc: "Claude for architecture, GPT for debugging, Gemini for analysis, Ollama for sensitive code. Switch models mid-conversation without losing context. Each response is tagged so you always know which model you're talking to.",
  },
  {
    tag: "BYOK",
    title: "Your keys, your choice.",
    desc: "No subscription required. Bring your own API keys from Anthropic, OpenAI, Google, or any provider and use them directly. No markup, no middleman, no data leaving your machine unless you choose it.",
  },
  {
    tag: "Git",
    title: "Full git workflow in the chat.",
    desc: "Review diffs, stage changes, write commits, browse history — all without leaving the terminal. Natural language interface to your repository, powered by whatever model you prefer.",
  },
  {
    tag: "MCP",
    title: "Extend with any tool.",
    desc: "Model Context Protocol support means your agent can connect to databases, APIs, internal services, and custom tools. No hardcoded integrations — just configure and go.",
  },
];

const plans = [
  {
    id: "free",
    name: "Free",
    desc: "Bring your own API keys",
    price: "$0",
    highlight: false,
  },
  {
    id: "pro",
    name: "Pro",
    desc: "Managed access to every model, priority support",
    price: "$20/mo",
    highlight: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    desc: "Team seats, SSO, dedicated support, SLA",
    price: "$100/mo",
    highlight: false,
  },
];

export function Home() {
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  async function handleCheckout(planId: string) {
    if (planId === "free") return;
    setCheckoutLoading(planId);
    setCheckoutError(null);
    try {
      const token = localStorage.getItem("prismcode_token");
      const res = await fetch(`${API}/billing/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ plan: planId }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text.includes("POLAR") ? "Billing not configured yet. Run your own keys for free." : text);
      }
      const data = await res.json();
      if (data.url) {
        window.open(data.url, "_blank");
      } else {
        setCheckoutError(data.message || "Plan not available.");
      }
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setCheckoutLoading(null);
    }
  }

  return (
    <main>
      {/* Hero */}
      <section className="pt-36 pb-20 px-6 max-w-xl mx-auto">
        <h1 className="text-[40px] font-semibold leading-[1.15] tracking-tight text-white mb-5">
          A terminal client for<br />every AI model.
        </h1>
        <p className="text-[15px] leading-relaxed text-white/35 mb-10">
          PrismCode connects Claude, GPT, Gemini, and local models through a single interface.
          Use your own API keys or subscribe for managed access. No lock-in, no separate apps.
        </p>
        <div className="flex gap-2">
          <a href="#features" className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:opacity-90 transition">
            Read more
          </a>
          <a href="#pricing" className="inline-flex items-center px-5 py-2.5 rounded-lg bg-white/[0.06] text-white/70 text-sm font-medium border border-white/[0.06] hover:bg-white/[0.1] hover:text-white transition">
            Pricing
          </a>
        </div>
        <div className="mt-16">
          <Terminal />
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 max-w-xl mx-auto pb-20">
        {features.map((f) => (
          <div key={f.tag} className="mb-16 last:mb-0">
            <span className="text-[11px] font-semibold tracking-widest uppercase text-indigo-400/50 mb-3 block">
              {f.tag}
            </span>
            <h3 className="text-[17px] font-semibold text-white mb-2">{f.title}</h3>
            <p className="text-[14px] leading-relaxed text-white/35">{f.desc}</p>
          </div>
        ))}
      </section>

      <hr className="border-white/[0.04] max-w-xl mx-auto" />

      {/* Pricing */}
      <section id="pricing" className="px-6 max-w-xl mx-auto py-20">
        <h2 className="text-[28px] font-semibold text-white mb-2">Pricing</h2>
        <p className="text-sm text-white/35 mb-6">Use your own keys for free, or subscribe for managed access across all providers.</p>
        {checkoutError && (
          <p className="text-sm text-amber-400/80 mb-4 px-4 py-2 rounded-lg bg-amber-500/5 border border-amber-500/10">{checkoutError}</p>
        )}
        <div className="flex flex-col gap-2">
          {plans.map((plan) => (
            <button
              key={plan.id}
              onClick={() => handleCheckout(plan.id)}
              disabled={checkoutLoading === plan.id}
              className={`flex items-center justify-between w-full px-6 py-5 rounded-lg border text-left transition disabled:opacity-50 ${
                plan.highlight
                  ? "border-indigo-500/10 bg-indigo-500/[0.03] hover:bg-indigo-500/[0.06]"
                  : "border-white/[0.04] hover:bg-white/[0.02]"
              }`}
            >
              <div>
                <h4 className="text-[15px] font-semibold text-white">{plan.name}</h4>
                <p className="text-[13px] text-white/30">{plan.desc}</p>
              </div>
              <span className="text-[15px] text-white/50 font-medium whitespace-nowrap ml-4">
                {checkoutLoading === plan.id ? "Redirecting..." : plan.price}
              </span>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
