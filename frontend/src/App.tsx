import { useEffect, useState } from "react";
import axios from "axios";
import {
  ComposedChart, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Bar, Line, PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";

interface Campaign {
  id: string; name: string; type: string; status: string;
  budget: number; spend: number; impressions: number; clicks: number;
  conversions: number; cpc: number; ctr: number; roas: number;
  industry?: string; region?: string;
}

interface Stats {
  totalSpend: number; totalImpressions: number; totalClicks: number;
  totalConversions: number; avgCTR: number; avgCPC: number; avgROAS: number;
  underperforming: Campaign[]; topPerformers?: Campaign[];
}

interface Insight { type: "warn" | "good" | "info"; badge: string; message: string; }

const EXPERT_CONTEXT = `You are a senior Google Ads analyst at Google's gTech Ads team with 10 years of experience.
INDUSTRY BENCHMARKS: Search avg CTR 3.17% avg CPC $2.69 avg ROAS 3.5x. Display avg CTR 0.46% avg CPC $0.63 avg ROAS 2.8x. Video avg CTR 0.514% avg ROAS 4.0x.
ROAS THRESHOLDS: Below 2x pause immediately. 2-3x optimize before scaling. 3-5x healthy maintain. Above 5x increase budget 20-30%.
OPTIMIZATION: Low CTR Search rewrite copy add RSA variations. High CPC switch to Target CPA add negatives. Low Display ROAS tighten audiences exclude placements. Strong Video ROAS increase budget expand similar audiences.
Give specific data-driven recommendations with exact numbers. Be direct and actionable like a real analyst.`;

function generateInsights(campaigns: Campaign[]): Insight[] {
  const insights: Insight[] = [];
  campaigns.filter(c => c.roas < 2).slice(0, 2).forEach(c => insights.push({
    type: "warn", badge: "Action needed",
    message: `${c.name} ROAS ${c.roas}x — below 2x threshold. Pause or restructure targeting immediately.`,
  }));
  const top = [...campaigns].sort((a, b) => b.roas - a.roas)[0];
  if (top) insights.push({ type: "good", badge: "Top performer", message: `${top.name}: ${top.roas}x ROAS with $${top.spend.toLocaleString()} spend. Increase budget 20%.` });
  insights.push({ type: "info", badge: "Benchmark", message: "Search 3.5x · Display 2.8x · Video 4.0x industry ROAS benchmarks." });
  return insights;
}

const C = {
  blue: "#378ADD", green: "#1D9E75", amber: "#BA7517", red: "#E24B4A",
  purple: "#7F77DD", teal: "#5DCAA5", bg: "#080C14", surface: "#0D1424",
  card: "#111827", border: "#1a2535", text: "#E2E8F0", muted: "#64748b",
  cardBorder: "#1e293b",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px", fontSize: 12 }}>
      <div style={{ color: C.muted, marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p: any, i: number) => (
        <div key={i} style={{ color: p.color, marginBottom: 2 }}>
          {p.name}: {p.name === "spend" ? `$${p.value.toLocaleString()}` : `${p.value}x`}
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "underperforming" | "top">("all");

  useEffect(() => {
    axios.get("http://localhost:4000/api/campaigns").then(r => {
      setCampaigns(r.data);
      setInsights(generateInsights(r.data));
    });
    axios.get("http://localhost:4000/api/campaigns/stats").then(r => setStats(r.data));
  }, []);

  const chartData = campaigns.slice(0, 10).map(c => ({
    name: c.name.split(" - ")[0].substring(0, 10),
    spend: c.spend, roas: c.roas,
  }));

  const roasArea = [
    { tier: "< 2x", count: campaigns.filter(c => c.roas < 2).length },
    { tier: "2-3x", count: campaigns.filter(c => c.roas >= 2 && c.roas < 3).length },
    { tier: "3-5x", count: campaigns.filter(c => c.roas >= 3 && c.roas < 5).length },
    { tier: "> 5x", count: campaigns.filter(c => c.roas >= 5).length },
  ];

  const pieData = [
    { name: "Search", value: campaigns.filter(c => c.type === "search").reduce((a, c) => a + c.spend, 0) },
    { name: "Display", value: campaigns.filter(c => c.type === "display").reduce((a, c) => a + c.spend, 0) },
    { name: "Video", value: campaigns.filter(c => c.type === "video").reduce((a, c) => a + c.spend, 0) },
  ];

  const filteredCampaigns = activeTab === "underperforming"
    ? campaigns.filter(c => c.roas < 2)
    : activeTab === "top"
    ? [...campaigns].sort((a, b) => b.roas - a.roas).slice(0, 10)
    : campaigns;

  function exportCSV() {
    const headers = ["Name","Type","Status","Spend","CTR","CPC","ROAS","Industry"];
    const rows = campaigns.map(c => [c.name,c.type,c.status,c.spend,c.ctr,c.cpc,c.roas,c.industry??""].join(","));
    const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "adlens_campaigns.csv"; a.click();
  }

  async function askAI(override?: string) {
    const q = override ?? aiInput;
    if (!q.trim()) return;
    setAiLoading(true); setAiResponse("");
    try {
      const summary = {
        total: campaigns.length,
        industries: [...new Set(campaigns.map(c => c.industry))].length,
        top10: campaigns.slice(0, 10),
        underperforming: campaigns.filter(c => c.roas < 2),
        topPerformers: campaigns.filter(c => c.roas > 5),
      };
      const res = await fetch("http://localhost:4000/api/campaigns/ask-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: q,
          context: `${EXPERT_CONTEXT}\n\nCAMPAIGN DATA:\n${JSON.stringify(summary, null, 2)}`,
        }),
      });
      const data = await res.json();
      setAiResponse(data.answer ?? "No response.");
    } catch { setAiResponse("Error — check backend is running."); }
    setAiLoading(false);
  }

  const roasColor = (r: number) => r < 2 ? C.red : r >= 5 ? C.green : r >= 3.5 ? C.amber : C.muted;

  return (
    <div style={{ fontFamily: "'DM Sans', 'Inter', sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>

      <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 0,
        background: `radial-gradient(ellipse 80% 50% at 20% 10%, ${C.blue}08 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 80%, ${C.purple}08 0%, transparent 60%)` }} />

      <div style={{ position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem 2rem", background: `${C.surface}cc`, backdropFilter: "blur(12px)", borderBottom: `1px solid ${C.border}`, position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
              {[C.blue, C.green, C.amber, C.red].map(c => (
                <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, boxShadow: `0 0 8px ${c}80` }} />
              ))}
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, letterSpacing: "-0.5px", color: "#fff" }}>Adlens</span>
            <span style={{ fontSize: 13, color: C.muted }}>/ AI Ad Intelligence</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 11, color: C.muted, background: C.card, padding: "4px 12px", borderRadius: 20, border: `1px solid ${C.border}` }}>
              {campaigns.length} campaigns · {[...new Set(campaigns.map(c => c.industry))].length} industries
            </span>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: `linear-gradient(135deg, ${C.blue}, ${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "white" }}>SK</div>
          </div>
        </div>

        <div style={{ padding: "1.5rem 2rem" }}>

          {/* KPI Cards */}
          {stats && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12, marginBottom: "1.5rem" }}>
              {[
                { label: "Total spend", value: `$${stats.totalSpend.toLocaleString()}`, color: C.blue, delta: "+12% vs last period", up: true },
                { label: "Total clicks", value: stats.totalClicks.toLocaleString(), color: C.green, delta: "+8% vs last period", up: true },
                { label: "Avg ROAS", value: `${stats.avgROAS}x`, color: C.amber, delta: stats.avgROAS >= 3.5 ? "↑ above industry 3.5x" : "↓ below industry 3.5x", up: stats.avgROAS >= 3.5 },
                { label: "Conversions", value: stats.totalConversions.toLocaleString(), color: C.purple, delta: "+23% vs last period", up: true },
              ].map(card => (
                <div key={card.label} style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.cardBorder}`, padding: "1.25rem", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 100% 60% at 50% 0%, ${card.color}12 0%, transparent 70%)`, pointerEvents: "none" }} />
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: card.color, borderRadius: "16px 16px 0 0" }} />
                  <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.8px", fontWeight: 600 }}>{card.label}</div>
                  <div style={{ fontSize: 30, fontWeight: 800, color: card.color, letterSpacing: "-1px", lineHeight: 1 }}>{card.value}</div>
                  <div style={{ fontSize: 11, marginTop: 10, color: card.up ? C.green : C.red }}>{card.delta}</div>
                </div>
              ))}
            </div>
          )}

          {/* Chart + AI */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 16, marginBottom: "1.5rem" }}>
            <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.cardBorder}`, padding: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Spend vs ROAS</div>
                  <div style={{ fontSize: 11, color: C.muted, marginTop: 2 }}>Top 10 campaigns · benchmark 3.5x</div>
                </div>
                <div style={{ display: "flex", gap: 12, fontSize: 11 }}>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, color: C.muted }}><span style={{ width: 10, height: 10, borderRadius: 2, background: C.blue, display: "inline-block" }} />Spend</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 5, color: C.muted }}><span style={{ width: 10, height: 10, borderRadius: 20, background: C.amber, display: "inline-block" }} />ROAS</span>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={210}>
                <ComposedChart data={chartData} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="name" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                  <YAxis yAxisId="left" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                  <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} tickFormatter={v => `${v}x`} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar yAxisId="left" dataKey="spend" fill={C.blue} radius={[6, 6, 0, 0]} opacity={0.85} />
                  <Line yAxisId="right" type="monotone" dataKey="roas" stroke={C.amber} strokeWidth={2.5} dot={{ fill: C.amber, r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* AI Panel */}
            <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.cardBorder}`, padding: "1.25rem", display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: C.purple, boxShadow: `0 0 10px ${C.purple}` }} />
                <span style={{ fontSize: 13, fontWeight: 600 }}>AI insights</span>
                <span style={{ fontSize: 10, color: C.muted, marginLeft: "auto" }}>Groq LLM</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1, overflowY: "auto", maxHeight: 280 }}>
                {insights.map((ins, i) => {
                  const colors = {
                    warn: { bg: "#2a1505", border: "#92400e", text: "#fbbf24", badge: "#78350f" },
                    good: { bg: "#051a0f", border: "#166534", text: "#4ade80", badge: "#14532d" },
                    info: { bg: "#050e2a", border: "#1e3a8a", text: "#60a5fa", badge: "#1e3a8a" }
                  }[ins.type];
                  return (
                    <div key={i} style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "10px 12px", fontSize: 11, lineHeight: 1.6, color: colors.text }}>
                      <span style={{ display: "inline-block", background: colors.badge, color: colors.text, fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>{ins.badge}</span>
                      <br />{ins.message}
                    </div>
                  );
                })}
                {aiResponse && (
                  <div style={{ background: "#130a2a", border: `1px solid ${C.purple}60`, borderRadius: 10, padding: "10px 12px", fontSize: 11, lineHeight: 1.6, color: "#c4b5fd" }}>
                    <span style={{ display: "inline-block", background: "#4c1d95", color: "#c4b5fd", fontSize: 9, fontWeight: 700, padding: "2px 8px", borderRadius: 20, marginBottom: 5, textTransform: "uppercase", letterSpacing: "0.5px" }}>AI answer</span>
                    <br />{aiResponse}
                  </div>
                )}
              </div>
              <div style={{ paddingTop: 8, borderTop: `1px solid ${C.border}`, display: "flex", gap: 6 }}>
                <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === "Enter" && askAI()}
                  placeholder="Ask about campaigns..."
                  style={{ flex: 1, fontSize: 11, padding: "7px 11px", borderRadius: 8, border: `1px solid ${C.border}`, outline: "none", background: C.bg, color: C.text }} />
                <button onClick={() => askAI()} disabled={aiLoading}
                  style={{ fontSize: 11, padding: "7px 14px", borderRadius: 8, border: "none", background: aiLoading ? C.border : C.purple, color: "white", cursor: "pointer", fontWeight: 600 }}>
                  {aiLoading ? "..." : "Ask"}
                </button>
              </div>
            </div>
          </div>

          {/* Three columns */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>

            {/* ROAS Distribution */}
            <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.cardBorder}`, padding: "1.25rem" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>ROAS distribution</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>Campaigns by performance tier</div>
              <ResponsiveContainer width="100%" height={150}>
                <AreaChart data={roasArea} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={C.teal} stopOpacity={0.4} />
                      <stop offset="95%" stopColor={C.teal} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke={C.border} />
                  <XAxis dataKey="tier" tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9, fill: C.muted }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11, color: C.text }} />
                  <Area type="monotone" dataKey="count" stroke={C.teal} strokeWidth={2} fill="url(#areaGrad)" dot={{ fill: C.teal, r: 4, strokeWidth: 0 }} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: "flex", gap: 6, marginTop: 10, flexWrap: "wrap" }}>
                {[{ l: "< 2x", c: C.red }, { l: "2-3x", c: C.amber }, { l: "3-5x", c: C.blue }, { l: "> 5x", c: C.green }].map(({ l, c }) => (
                  <span key={l} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 20, background: `${c}18`, color: c, border: `1px solid ${c}40` }}>
                    {l}: {roasArea.find(r => r.tier === l)?.count ?? 0}
                  </span>
                ))}
              </div>
            </div>

            {/* Donut Pie */}
            <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.cardBorder}`, padding: "1.25rem" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Spend by type</div>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 8 }}>All {campaigns.length} campaigns</div>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={{ stroke: C.muted, strokeWidth: 1 }}>
                    {pieData.map((_, i) => <Cell key={i} fill={[C.blue, C.green, C.amber][i]} strokeWidth={0} />)}
                  </Pie>
                  <Tooltip contentStyle={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 11, color: C.text }} formatter={(v: number) => `$${v.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Actions */}
            <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.cardBorder}`, padding: "1.25rem" }}>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>Quick actions</div>
              {[
                { label: "Export to CSV", color: C.blue, fn: exportCSV, prompt: undefined },
                { label: "AI performance report", color: C.green, fn: undefined, prompt: "Give me a full performance report with specific campaign names, compare against industry benchmarks, and give top 3 prioritized action items with exact budget recommendations" },
                { label: "Optimize budget allocation", color: C.purple, fn: undefined, prompt: "Which campaigns should I increase budget on and by how much? Which should I pause? Give specific dollar amounts" },
              ].map(({ label, color, fn, prompt }) => (
                <button key={label} onClick={() => fn ? fn() : askAI(prompt)}
                  style={{ width: "100%", padding: "9px 14px", borderRadius: 10, border: `1px solid ${color}40`, background: `${color}12`, color, fontSize: 12, cursor: "pointer", marginBottom: 8, textAlign: "left", fontWeight: 500 }}>
                  {label}
                </button>
              ))}
              {stats && (
                <div style={{ marginTop: 8, padding: "10px 12px", background: C.bg, borderRadius: 10, fontSize: 11, color: C.muted, lineHeight: 2 }}>
                  <div>Impressions: <span style={{ color: C.text, fontWeight: 600 }}>{stats.totalImpressions.toLocaleString()}</span></div>
                  <div>Avg CTR: <span style={{ color: C.text, fontWeight: 600 }}>{stats.avgCTR}%</span></div>
                  <div>Underperforming: <span style={{ color: C.red, fontWeight: 600 }}>{stats.underperforming.length}</span></div>
                </div>
              )}
            </div>
          </div>

          {/* Table */}
          <div style={{ background: C.card, borderRadius: 16, border: `1px solid ${C.cardBorder}`, overflow: "hidden" }}>
            <div style={{ padding: "1rem 1.5rem", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 13, fontWeight: 600 }}>Campaigns</span>
              <div style={{ display: "flex", gap: 6 }}>
                {(["all", "underperforming", "top"] as const).map(tab => (
                  <button key={tab} onClick={() => setActiveTab(tab)}
                    style={{ fontSize: 11, padding: "4px 12px", borderRadius: 20, border: `1px solid ${activeTab === tab ? C.blue : C.border}`, background: activeTab === tab ? `${C.blue}20` : "transparent", color: activeTab === tab ? C.blue : C.muted, cursor: "pointer", fontWeight: activeTab === tab ? 600 : 400 }}>
                    {tab === "all" ? `All (${campaigns.length})` : tab === "underperforming" ? "Underperforming" : "Top 10"}
                  </button>
                ))}
              </div>
            </div>
            <div style={{ maxHeight: 400, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead style={{ position: "sticky", top: 0, background: C.bg, zIndex: 10 }}>
                  <tr>
                    {["Campaign", "Type", "Industry", "Status", "Spend", "CTR", "CPC", "ROAS"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", color: C.muted, fontWeight: 600, fontSize: 10, borderBottom: `1px solid ${C.border}`, textTransform: "uppercase", letterSpacing: "0.6px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredCampaigns.map((c, idx) => (
                    <tr key={c.id} style={{ background: idx % 2 === 0 ? "transparent" : `${C.bg}50` }}>
                      <td style={{ padding: "10px 16px", fontWeight: 500, color: "#cbd5e1", borderBottom: `1px solid ${C.border}20` }}>{c.name}</td>
                      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}20` }}>
                        <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, fontWeight: 600,
                          background: c.type === "search" ? "#0c1e3a" : c.type === "display" ? "#0a2318" : "#1a1030",
                          color: c.type === "search" ? C.blue : c.type === "display" ? C.green : C.purple,
                          border: `1px solid ${c.type === "search" ? `${C.blue}40` : c.type === "display" ? `${C.green}40` : `${C.purple}40`}` }}>
                          {c.type}
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px", color: C.muted, fontSize: 11, borderBottom: `1px solid ${C.border}20` }}>{c.industry ?? "—"}</td>
                      <td style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}20` }}>
                        <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 20, fontWeight: 600,
                          background: c.status === "active" ? "#0a2318" : "#1a1a0a",
                          color: c.status === "active" ? C.green : C.muted,
                          border: `1px solid ${c.status === "active" ? `${C.green}40` : `${C.muted}20`}` }}>
                          {c.status}
                        </span>
                      </td>
                      <td style={{ padding: "10px 16px", color: C.muted, borderBottom: `1px solid ${C.border}20` }}>${c.spend.toLocaleString()}</td>
                      <td style={{ padding: "10px 16px", color: C.muted, borderBottom: `1px solid ${C.border}20` }}>{c.ctr}%</td>
                      <td style={{ padding: "10px 16px", color: C.muted, borderBottom: `1px solid ${C.border}20` }}>${c.cpc}</td>
                      <td style={{ padding: "10px 16px", fontWeight: 700, color: roasColor(c.roas), borderBottom: `1px solid ${C.border}20`, fontSize: 13 }}>
                        {c.roas}x
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}