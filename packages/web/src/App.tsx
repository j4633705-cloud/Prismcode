import { Routes, Route } from "react-router-dom";
import { Nav } from "./components/Nav";
import { Footer } from "./components/Footer";
import { Home } from "./pages/Home";
import { Docs } from "./pages/Docs";
import { Dashboard } from "./pages/Dashboard";

const API = import.meta.env.VITE_API_URL || "http://localhost:3000";

export type PlanInfo = {
  planId: string;
  planName: string;
  remainingMessages: number;
  isUnlimited: boolean;
  stats?: {
    messagesToday: number;
    creditsUsed: number;
    sessionCount: number;
  } | null;
};

export function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white antialiased">
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
      <Footer />
    </div>
  );
}

export async function fetchPlan(token?: string): Promise<PlanInfo | null> {
  try {
    const res = await fetch(`${API}/billing/plan`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export async function fetchPlans() {
  try {
    const res = await fetch(`${API}/billing/plans`);
    if (!res.ok) return [];
    const data = await res.json();
    return data.plans;
  } catch {
    return [];
  }
}
