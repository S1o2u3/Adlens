import { useEffect, useState } from "react";
import axios from "axios";
import {
  Line,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: string;
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpc: number;
  ctr: number;
  roas: number;
}

interface Stats {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  avgCTR: number;
  avgCPC: number;
  avgROAS: number;
  underperforming: Campaign[];
}

interface Insight {
  type: "warn" | "good" | "info";
  badge: string;
  message: string;
}

function generateInsights(campaigns: Campaign[]): Insight[] {
  const insights: Insight[] = [];
  const underperforming = campaigns.filter((c) => c.roas < 2);
  const topPerformer = [...campaigns].sort((a, b) => b.roas - a.roas)[0];
  for (const c of underperforming) {
    insights.push({
      type: "warn",
      badge: "Action needed",
      message: `${c.name} has ROAS of ${c.roas}x — below 2x threshold. Consider tightening audience targeting or pausing.`,
    });
  }
  if (topPerformer) {
    insights.push({
      type: "good",
      badge: "Performing well",
      message: `${topPerformer.name}: ROAS ${topPerformer.roas}x with $${topPerformer.spend.toLocaleString()} spend. Recommend increasing budget by 20%.`,
    });
  }
  insights.push({
    type: "info",
    badge: "Tip",
    message: "Video campaigns show 2x higher conversion rates vs display. Consider shifting 15% of display budget to video.",
  });
  return insights;
}

const insightStyle: Record<string, { bg: string; color: string; badgeBg: string; badgeColor: string }> = {
  warn: { bg: "#FAEEDA", color: "#633806", badgeBg: "#FAC775", badgeColor: "#412402" },
  good: { bg: "#EAF3DE", color: "#27500A", badgeBg: "#C0DD97", badgeColor: "#173404" },
  info: { bg: "#E6F1FB", color: "#0C447C", badgeBg: "#B5D4F4", badgeColor: "#042C53" },
};

export default function App() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [insights, setInsights] = useState<Insight[]>([]);
  const [aiInput, setAiInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:4000/api/campaigns").then((r) => {
      setCampaigns(r.data);
      setInsights(generateInsights(r.data));
    });
    axios.get("http://localhost:4000/api/campaigns/stats").then((r) => setStats(r.data));
  }, []);

  const chartData = campaigns.map((c) => ({
    name: c.name.split(" — ")[0],
    spend: c.spend,
    roas: c.roas,
  }));

  const pieData = [
    { name: "Search", value: campaigns.filter(c => c.type === "search").reduce((a, c) => a + c.spend, 0) },
    { name: "Display", value: campaigns.filter(c => c.type === "display").reduce((a, c) => a + c.spend, 0) },
    { name: "Video", value: campaigns.filter(c => c.type === "video").reduce((a, c) => a + c.spend, 0) },
  ];

  const pieColors = ["#378ADD", "#639922", "#BA7517"];

  function exportCSV() {
    const headers = ["Name", "Type", "Status", "Budget", "Spend", "CTR", "CPC", "ROAS"];
    const rows = campaigns.map(c => [c.name, c.type, c.status, c.budget, c.spend, c.ctr, c.cpc, c.roas]);
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "adinsight_campaigns.csv";
    a.click();
  }

  async function askAI(overrideInput?: string) {
    const question = overrideInput ?? aiInput;
    if (!question.trim()) return;
    setAiLoading(true);
    setAiResponse("");
    try {
      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: `You are an expert Google Ads analyst. Here is the campaign data: ${JSON.stringify(campaigns)}. Answer concisely in 2-3 sentences.`,
            },
            { role: "user", content: question },
          ],
        }),
      });
      const data = await res.json();
      setAiResponse(data.choices?.[0]?.message?.content ?? "No response.");
    } catch {
      setAiResponse("Error contacting AI. Make sure your API key is set.");
    }
    setAiLoading(false);
  }

  return (
    <div style={{ fontFamily: "sans-serif", background: "#f8f9fa", minHeight: "100vh" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1.25rem 2rem", background: "white", borderBottom: "0.5px solid #e8eaed" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ display: "flex", gap: 4 }}>
            {["#378ADD", "#639922", "#BA7517", "#E24B4A"].map((c) => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            ))}
          </div>
          <span style={{ fontSize: 16, fontWeight: 500 }}>Adlens</span>
          <span style={{ fontSize: 12, color: "#5f6368" }}>/ AI Ad Intelligence</span>
        </div>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 500, color: "#0C447C" }}>SK</div>
      </div>

      <div style={{ padding: "1.5rem 2rem" }}>

        {/* Metric Cards */}
        {stats && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: "1.5rem" }}>
            {[
              { label: "Total spend", value: `$${stats.totalSpend.toLocaleString()}`, color: "#378ADD", delta: "+12% vs last period", up: true },
              { label: "Total clicks", value: stats.totalClicks.toLocaleString(), color: "#639922", delta: "+8% vs last period", up: true },
              { label: "Avg ROAS", value: `${stats.avgROAS}x`, color: "#BA7517", delta: "-0.4 vs last period", up: false },
              { label: "Conversions", value: stats.totalConversions, color: "#E24B4A", delta: "+23% vs last period", up: true },
            ].map((card) => (
              <div key={card.label} style={{ background: "white", borderRadius: 12, padding: "1rem 1.25rem", border: "0.5px solid #e8eaed" }}>
                <div style={{ fontSize: 12, color: "#5f6368", marginBottom: 6 }}>{card.label}</div>
                <div style={{ fontSize: 24, fontWeight: 500, color: card.color }}>{card.value}</div>
                <div style={{ fontSize: 11, marginTop: 4, color: card.up ? "#3B6D11" : "#A32D2D" }}>{card.delta}</div>
              </div>
            ))}
          </div>
        )}

        {/* Chart + AI Panel */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16, marginBottom: "1.5rem" }}>

          {/* Bar+Line Chart */}
          <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #e8eaed", padding: "1.25rem" }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Spend vs ROAS by campaign</div>
            <ResponsiveContainer width="100%" height={220}>
              <ComposedChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f4" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#5f6368" }} />
                <YAxis yAxisId="left" tick={{ fontSize: 10, fill: "#5f6368" }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: "#639922" }} tickFormatter={(v) => `${v}x`} />
                <Tooltip formatter={(value: number, name: string) => name === "spend" ? `$${value.toLocaleString()}` : `${value}x`} />
                <Bar yAxisId="left" dataKey="spend" fill="#378ADD" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="roas" stroke="#639922" strokeWidth={2} dot={{ fill: "#639922", r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", gap: 16, marginTop: 8, fontSize: 11, color: "#5f6368" }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#378ADD", display: "inline-block" }} />Spend ($)</span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 10, height: 10, borderRadius: 2, background: "#639922", display: "inline-block" }} />ROAS (x)</span>
            </div>
          </div>

          {/* AI Panel */}
          <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #e8eaed", padding: "1.25rem", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#378ADD" }} />
              <span style={{ fontSize: 13, fontWeight: 500 }}>AI insights</span>
            </div>
            {insights.map((ins, i) => {
              const s = insightStyle[ins.type];
              return (
                <div key={i} style={{ background: s.bg, borderRadius: 8, padding: "10px 12px", fontSize: 12, lineHeight: 1.5, color: s.color }}>
                  <span style={{ display: "inline-block", background: s.badgeBg, color: s.badgeColor, fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 10, marginBottom: 5 }}>{ins.badge}</span>
                  <br />{ins.message}
                </div>
              );
            })}
            {aiResponse && (
              <div style={{ background: "#E6F1FB", borderRadius: 8, padding: "10px 12px", fontSize: 12, lineHeight: 1.5, color: "#0C447C" }}>
                <span style={{ display: "inline-block", background: "#B5D4F4", color: "#042C53", fontSize: 10, fontWeight: 500, padding: "2px 7px", borderRadius: 10, marginBottom: 5 }}>AI answer</span>
                <br />{aiResponse}
              </div>
            )}
            <div style={{ marginTop: "auto", paddingTop: 8, borderTop: "0.5px solid #e8eaed" }}>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  value={aiInput}
                  onChange={(e) => setAiInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && askAI()}
                  placeholder="Ask AI about campaigns..."
                  style={{ flex: 1, fontSize: 12, padding: "6px 10px", borderRadius: 8, border: "0.5px solid #e8eaed", outline: "none", background: "#f8f9fa" }}
                />
                <button onClick={() => askAI()} disabled={aiLoading}
                  style={{ fontSize: 11, padding: "6px 10px", borderRadius: 8, border: "0.5px solid #e8eaed", background: aiLoading ? "#f1f3f4" : "#378ADD", color: aiLoading ? "#5f6368" : "white", cursor: "pointer" }}>
                  {aiLoading ? "..." : "Ask"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Pie Chart + Quick Actions */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: "1.5rem" }}>

          {/* Pie Chart */}
          <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #e8eaed", padding: "1.25rem" }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Spend by campaign type</div>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={pieColors[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Quick Actions */}
          <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #e8eaed", padding: "1.25rem" }}>
            <div style={{ fontSize: 13, fontWeight: 500, marginBottom: 16 }}>Quick actions</div>
            <button onClick={exportCSV}
              style={{ width: "100%", padding: "10px 16px", borderRadius: 8, border: "0.5px solid #e8eaed", background: "#378ADD", color: "white", fontSize: 13, cursor: "pointer", marginBottom: 10 }}>
              Export campaigns to CSV
            </button>
            <button onClick={() => askAI("Give me a full performance report and top 3 action items for my campaigns")}
              style={{ width: "100%", padding: "10px 16px", borderRadius: 8, border: "0.5px solid #e8eaed", background: "#f8f9fa", color: "#378ADD", fontSize: 13, cursor: "pointer" }}>
              Generate AI performance report
            </button>
            {stats && (
              <div style={{ marginTop: 16, padding: 12, background: "#f8f9fa", borderRadius: 8, fontSize: 12, color: "#5f6368", lineHeight: 1.8 }}>
                <div>Total impressions: <strong>{stats.totalImpressions.toLocaleString()}</strong></div>
                <div>Avg CTR: <strong>{stats.avgCTR}%</strong></div>
                <div>Avg CPC: <strong>${stats.avgCPC}</strong></div>
                <div>Underperforming: <strong style={{ color: "#A32D2D" }}>{stats.underperforming.length} campaigns</strong></div>
              </div>
            )}
          </div>
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: 12, border: "0.5px solid #e8eaed", overflow: "hidden" }}>
          <div style={{ padding: "1rem 1.25rem", borderBottom: "0.5px solid #e8eaed", fontSize: 13, fontWeight: 500 }}>All campaigns</div>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead>
              <tr style={{ background: "#f8f9fa" }}>
                {["Campaign", "Type", "Status", "Budget", "Spend", "CTR", "CPC", "ROAS"].map((h) => (
                  <th key={h} style={{ padding: "10px 14px", textAlign: "left", color: "#5f6368", fontWeight: 500, fontSize: 11, borderBottom: "0.5px solid #e8eaed" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {campaigns.map((c) => (
                <tr key={c.id} style={{ borderBottom: "0.5px solid #f1f3f4" }}>
                  <td style={{ padding: "10px 14px", fontWeight: 500 }}>{c.name}</td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 500, background: c.type === "search" ? "#E6F1FB" : c.type === "display" ? "#EAF3DE" : "#EEEDFE", color: c.type === "search" ? "#0C447C" : c.type === "display" ? "#27500A" : "#3C3489" }}>{c.type}</span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>
                    <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 10, fontWeight: 500, background: c.status === "active" ? "#EAF3DE" : "#F1EFE8", color: c.status === "active" ? "#27500A" : "#444441" }}>{c.status}</span>
                  </td>
                  <td style={{ padding: "10px 14px" }}>${c.budget.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px" }}>${c.spend.toLocaleString()}</td>
                  <td style={{ padding: "10px 14px" }}>{c.ctr}%</td>
                  <td style={{ padding: "10px 14px" }}>${c.cpc}</td>
                  <td style={{ padding: "10px 14px", fontWeight: 500, color: c.roas < 2 ? "#A32D2D" : c.roas > 4 ? "#3B6D11" : "#202124" }}>{c.roas}x</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}