<div align="center">

# 🔵🟢🟡🔴 Adlens
### AI-Powered Ad Campaign Intelligence Platform

*Built to mirror the tooling mandate of Google's gTech Ads TAI team*

![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![Groq](https://img.shields.io/badge/Groq_LLM-FF6B35?style=flat&logoColor=white)

</div>

---

## What is Adlens?

Adlens is a full-stack ad campaign intelligence dashboard that aggregates campaign data from multiple sources, detects underperforming campaigns in real time against industry benchmarks, and surfaces LLM-generated optimization recommendations the same class of tooling Google's gTech Ads TAI team builds internally to support advertisers at scale.

---

## Live Preview

```
┌─────────────────────────────────────────────────────────────────┐
│  🔵🟢🟡🔴  Adlens  / AI Ad Intelligence   30 campaigns · 16 industries │
├─────────────────────────────────────────────────────────────────┤
│  $110,300       109,240        3.74x          4,264             │
│  Total Spend    Clicks         Avg ROAS       Conversions       │
│  +12% ↑         +8% ↑          +vs 3.5x ↑     +23% ↑           │
├────────────────────────────┬────────────────────────────────────┤
│  Spend vs ROAS Chart       │  🔵 AI Insights                   │
│  Top 10 campaigns          │  ⚠  Brand Awareness: 1.8x         │
│  Benchmark: 3.5x           │  ⚠  Retargeting: 1.2x             │
│  [Bar + Line Chart]        │  ✅  Gaming App: 8.1x              │
│                            │  📊  Industry benchmarks           │
│                            │  ┌──────────────────────────────┐ │
│                            │  │ Ask AI about campaigns...    │ │
│                            │  └──────────────────────────────┘ │
├────────────────────────────┼────────────────────────────────────┤
│  Spend by Type (Pie)       │  Quick Actions                    │
│  Search 48%                │  [ Export campaigns to CSV ]      │
│  Display 26%               │  [ Generate AI performance report]│
│  Video 26%                 │  [ Optimize budget allocation ]   │
│                            │  Total campaigns:    30           │
│                            │  Total impressions:  6,973,000    │
│                            │  Avg CTR:            2.17%        │
│                            │  Avg CPC:            $1.57        │
│                            │  Underperforming:    6 campaigns  │
├────────────────────────────┴────────────────────────────────────┤
│  All Campaigns (30 total)                                       │
├──────────────────────┬─────────┬─────────────┬────────┬────────┤
│  Campaign            │  Type   │  Industry   │ Status │  ROAS  │
├──────────────────────┼─────────┼─────────────┼────────┼────────┤
│  Spring Sale Search  │ search  │ retail      │ active │  4.2x  │
│  Brand Awareness     │ display │ retail      │ active │  1.8x 🔴│
│  Product Demo Video  │ video   │ tech        │ active │  3.5x  │
│  Retargeting Search  │ search  │ retail      │ paused │  1.2x 🔴│
│  Holiday Promo       │ display │ retail      │ active │  5.8x ✅│
│  App Install Video   │ video   │ tech        │ active │  6.2x ✅│
│  Gaming App Video    │ video   │ gaming      │ active │  8.1x ✅│
│  B2B SaaS Search     │ search  │ saas        │ active │  4.8x  │
│  Fitness App Video   │ video   │ health      │ active │  6.7x ✅│
│  Black Friday Search │ search  │ retail      │ paused │  7.2x ✅│
│  ... 20 more         │         │             │        │        │
└──────────────────────┴─────────┴─────────────┴────────┴────────┘
```

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│          React 18 + TypeScript + Vite + Recharts                │
└────────────────────────────┬────────────────────────────────────┘
                             │ HTTP (Axios) sub-200ms
┌────────────────────────────▼────────────────────────────────────┐
│                          API LAYER                              │
│               Node.js + Express + TypeScript                    │
│          GET /api/campaigns  |  GET /api/campaigns/stats        │
└──────────────┬──────────────────────────────┬───────────────────┘
               │                              │
┌──────────────▼───────────┐  ┌───────────────▼─────────────────┐
│      DATA PIPELINE       │  │       AGGREGATION ENGINE        │
│  30 campaigns            │  │  Multi-source normalization      │
│  16 industries           │  │  Industry benchmark comparison   │
│  3 ad types              │  │  Anomaly detection (ROAS/CTR)   │
│  Search/Display/Video    │  │  Top performer identification    │
│                          │  │  byType + byIndustry grouping   │
└──────────────────────────┘  └─────────────────────────────────┘
                              │
┌─────────────────────────────▼───────────────────────────────────┐
│                       AI INSIGHTS LAYER                         │
│               Groq API (llama-3.3-70b-versatile)                │
│   • Full campaign data injected as system context               │
│   • Google Ads industry benchmarks embedded in prompt           │
│   • Optimization playbook for Search / Display / Video          │
│   • Budget allocation rules by ROAS tier                        │
│   • Seasonal performance patterns                               │
│   • Natural language Q&A over live data                         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Features

### Data Pipeline
- Ingests and normalizes campaign data across **3 ad types** (search, display, video)
- Covers **30 campaigns** across **16 industries**
- Aggregates metrics **by type** and **by industry** with benchmark delta comparison
- Flags underperforming campaigns automatically (ROAS < 2x or CTR < 0.4%)

### AI Insights Engine
- **Expert system prompt** — embeds Google Ads optimization playbook, industry benchmarks, ROAS thresholds, budget allocation rules, and seasonal patterns
- **Live data context** — full campaign JSON injected per query for data-aware responses
- **Natural language Q&A** — ask anything about your campaigns in plain English
- **One-click reports** — AI performance report and budget optimizer prebuilt

### Dashboard
- Spend vs ROAS composed chart (bar + line) for top 10 campaigns
- Spend breakdown by campaign type (pie chart)
- 4 KPI metric cards with period-over-period and industry benchmark deltas
- Scrollable campaign table with industry column and color-coded ROAS
- CSV export with all 30 campaigns and metadata

### Partner-Facing API
- REST endpoints processing at sub-200ms latency
- CORS-enabled for partner integrations
- Structured JSON responses with aggregated stats and anomaly flags

---

## Tech Stack

```
┌─────────────────┬──────────────────────────────────┬──────────────────────────────────────┐
│ Layer           │ Technology                        │ Why                                  │
├─────────────────┼──────────────────────────────────┼──────────────────────────────────────┤
│ Frontend        │ React 18, TypeScript, Vite        │ Type-safe, fast HMR, Google stack    │
│ Charts          │ Recharts                          │ React-native composable primitives   │
│ Backend         │ Node.js, Express, TypeScript      │ Lightweight REST with type safety    │
│ AI / LLM        │ Groq (llama-3.3-70b-versatile)   │ Sub-100ms inference for analyst UX   │
│ HTTP client     │ Axios                             │ Clean async fetching                 │
│ Build           │ Vite                              │ Sub-500ms cold starts in dev         │
└─────────────────┴──────────────────────────────────┴──────────────────────────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Groq API key — free at [console.groq.com](https://console.groq.com)

### Backend
```bash
cd backend
npm install
npm run dev
# Runs on http://localhost:4000
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Add your Groq API key to .env
npm run dev
# Runs on http://localhost:5173
```

### Environment variables
```bash
# frontend/.env
VITE_GROQ_API_KEY=your_groq_api_key_here
```

---

## API Reference

### `GET /api/campaigns`
Returns all 30 campaigns with full metrics.

```json
[
  {
    "id": "c1",
    "name": "Spring Sale - Search",
    "type": "search",
    "status": "active",
    "budget": 5000,
    "spend": 4200,
    "impressions": 120000,
    "clicks": 3600,
    "conversions": 180,
    "cpc": 1.17,
    "ctr": 3.0,
    "roas": 4.2,
    "industry": "retail",
    "region": "US-West"
  }
]
```

### `GET /api/campaigns/stats`
Returns aggregated stats with benchmark comparisons and anomaly flags.

```json
{
  "totalSpend": 110300,
  "totalImpressions": 6973000,
  "totalClicks": 109240,
  "totalConversions": 4264,
  "avgCTR": 2.17,
  "avgCPC": 1.57,
  "avgROAS": 3.74,
  "byType": {
    "search":  { "spend": 52900, "roas": 3.6, "vsIndustryROAS": "+3% vs industry"  },
    "display": { "spend": 29500, "roas": 3.2, "vsIndustryROAS": "+14% vs industry" },
    "video":   { "spend": 27900, "roas": 5.9, "vsIndustryROAS": "+48% vs industry" }
  },
  "underperforming": ["..."],
  "topPerformers": ["..."]
}
```

---

## AI Expert Context

```
INDUSTRY BENCHMARKS:
┌──────────┬───────────┬──────────┬───────────┐
│ Type     │ Avg CTR   │ Avg CPC  │ Avg ROAS  │
├──────────┼───────────┼──────────┼───────────┤
│ Search   │ 3.17%     │ $2.69    │ 3.5x      │
│ Display  │ 0.46%     │ $0.63    │ 2.8x      │
│ Video    │ 0.514%    │ $0.10    │ 4.0x      │
└──────────┴───────────┴──────────┴───────────┘

ROAS THRESHOLDS:
┌────────────┬───────────────────────────────────────────┐
│ ROAS Range │ Action                                    │
├────────────┼───────────────────────────────────────────┤
│ < 2x       │ Losing money — pause immediately          │
│ 2x – 3x   │ Marginal — optimize before scaling        │
│ 3x – 5x   │ Healthy — maintain and test increases     │
│ > 5x       │ Strong — increase budget 20-30%           │
└────────────┴───────────────────────────────────────────┘

OPTIMIZATION PLAYBOOK:
┌────────────────────────────┬──────────────────────────────────────────┐
│ Signal                     │ Recommendation                           │
├────────────────────────────┼──────────────────────────────────────────┤
│ Low CTR Search (<2%)       │ Rewrite copy, add RSA variations         │
│ High CPC                   │ Switch to Target CPA, add negatives      │
│ Low Display ROAS           │ Tighten audiences, exclude placements    │
│ Low Display CTR (<0.4%)    │ Creative fatigue — rotate new banners    │
│ Strong Video ROAS          │ Increase budget, expand similar audiences│
│ Paused + good history      │ Reactivate with refined targeting        │
└────────────────────────────┴──────────────────────────────────────────┘

BUDGET ALLOCATION RULES:
┌───────────────────────────┬───────────────────────────┐
│ ROAS Tier                 │ Budget Allocation          │
├───────────────────────────┼───────────────────────────┤
│ Top performers (ROAS >5x) │ 40% of total budget       │
│ Mid performers (ROAS 3-5x)│ 40% of total budget       │
│ Underperformers (ROAS <3x)│ Max 20%, optimize only    │
└───────────────────────────┴───────────────────────────┘
```

---

## Design Decisions

**Why decouple the aggregation service from the route layer?**
Keeps the pipeline independently testable and extensible to real data sources (Google Ads API, DV360, Search Ads 360) without changing the API contract.

**Why embed industry benchmarks in the AI prompt instead of calling an external API?**
Eliminates a network dependency in the critical path, reduces latency, and gives the LLM static authoritative context rather than potentially stale external data.

**Why Groq over OpenAI?**
Sub-100ms inference latency on open-weight models makes Groq ideal for interactive analyst workflows where response time directly impacts usability — consistent with Google's internal latency SLAs for support tooling.

**Why TypeScript end-to-end?**
Enforces type safety across the data pipeline, reducing runtime errors in partner-facing tools where data integrity is critical.

**Why ROAS < 2x as the underperforming threshold?**
Industry standard before a campaign becomes net-negative after Google Ads platform fees and operational overhead.

---

## Relevance to Google gTech Ads TAI

```
┌──────────────────────────────────────┬────────────────────────────────────────────────────┐
│ TAI Team Mandate                     │ Adlens Implementation                              │
├──────────────────────────────────────┼────────────────────────────────────────────────────┤
│ Aggregate data from multiple sources │ Pipeline across 3 ad types, 16 industries          │
│ Leverage gen AI for Ads support      │ LLM engine with Google Ads expert context          │
│ Build partner-facing tools           │ REST API + CSV export + AI report generation       │
│ Improve performance of tools         │ Real-time anomaly detection on ROAS/CTR            │
│ Collaborate cross-functionally       │ Design doc README, typed interfaces, clean API     │
│ Data-driven insights                 │ Industry benchmark comparisons per campaign type   │
└──────────────────────────────────────┴────────────────────────────────────────────────────┘
```

---

## Project Structure

```
adlens/
├── backend/
│   ├── src/
│   │   ├── data/
│   │   │   └── mockData.ts        # 30 campaigns, benchmarks, AI context
│   │   ├── routes/
│   │   │   └── campaigns.ts       # REST API routes
│   │   ├── services/
│   │   │   └── aggregator.ts      # Multi-source aggregation pipeline
│   │   └── index.ts               # Express server
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── App.tsx                # Dashboard + AI panel + charts
│   │   └── main.tsx               # React entry point
│   ├── .env.example               # Environment variable template
│   ├── package.json
│   └── vite.config.ts
└── .gitignore
```

---

## Author

**Soumya Kakani**
MS Computer Science — University of North Carolina at Charlotte
Software Engineer Intern @ IT Solutions Point Inc

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/soumya-kakani-812b72215/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/S1o2u3)
