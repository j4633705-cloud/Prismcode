import { useEffect, useState } from "react";
import { fetchPlan, type PlanInfo } from "../App";

function getToken() {
  return localStorage.getItem("prismcode_token");
}

export function Dashboard() {
  const [plan, setPlan] = useState<PlanInfo | null>(null);
  const [token, setToken] = useState(getToken());

  useEffect(() => {
    if (token) {
      fetchPlan(token).then(setPlan);
    }
  }, [token]);

  if (!token) {
    return (
      <main className="pt-24 px-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-4">Dashboard</h1>
        <p className="text-sm text-white/35 mb-6">Connect your account to see usage and manage your subscription.</p>
        <p className="text-sm text-white/20">Use <code className="text-indigo-400/70 font-mono text-xs">prismcode login</code> in the terminal to get your token.</p>
      </main>
    );
  }

  return (
    <main className="pt-24 px-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold text-white mb-6">Dashboard</h1>
      {plan ? (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between px-5 py-4 rounded-lg border border-white/[0.04]">
            <span className="text-sm text-white/50">Plan</span>
            <span className="text-sm font-medium text-white">{plan.planName}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4 rounded-lg border border-white/[0.04]">
            <span className="text-sm text-white/50">Messages today</span>
            <span className="text-sm font-medium text-white">
              {plan.isUnlimited ? "Unlimited" : `${plan.remainingMessages} remaining`}
            </span>
          </div>
          {plan.stats && (
            <>
              <div className="flex items-center justify-between px-5 py-4 rounded-lg border border-white/[0.04]">
                <span className="text-sm text-white/50">Sessions</span>
                <span className="text-sm font-medium text-white">{plan.stats.sessionCount}</span>
              </div>
              <div className="flex items-center justify-between px-5 py-4 rounded-lg border border-white/[0.04]">
                <span className="text-sm text-white/50">Total credits used</span>
                <span className="text-sm font-medium text-white">{plan.stats.creditsUsed}</span>
              </div>
            </>
          )}
        </div>
      ) : (
        <p className="text-sm text-white/30">Loading...</p>
      )}
      <button
        onClick={() => { localStorage.removeItem("prismcode_token"); setToken(null); }}
        className="mt-6 text-xs text-white/20 hover:text-white/50 transition"
      >
        Disconnect
      </button>
    </main>
  );
}
