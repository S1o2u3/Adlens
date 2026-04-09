export interface Campaign {
  id: string;
  name: string;
  type: "search" | "display" | "video";
  status: "active" | "paused";
  budget: number;
  spend: number;
  impressions: number;
  clicks: number;
  conversions: number;
  cpc: number;
  ctr: number;
  roas: number;
  date: string;
  industry: string;
  region: string;
}

export const mockCampaigns: Campaign[] = [
  { id: "c1", name: "Spring Sale - Search", type: "search", status: "active", budget: 5000, spend: 4200, impressions: 120000, clicks: 3600, conversions: 180, cpc: 1.17, ctr: 3.0, roas: 4.2, date: "2026-04-01", industry: "retail", region: "US-West" },
  { id: "c2", name: "Brand Awareness - Display", type: "display", status: "active", budget: 3000, spend: 2900, impressions: 450000, clicks: 2250, conversions: 45, cpc: 1.29, ctr: 0.5, roas: 1.8, date: "2026-04-01", industry: "retail", region: "US-East" },
  { id: "c3", name: "Product Demo - Video", type: "video", status: "active", budget: 4000, spend: 3800, impressions: 200000, clicks: 4000, conversions: 120, cpc: 0.95, ctr: 2.0, roas: 3.5, date: "2026-04-01", industry: "tech", region: "US-West" },
  { id: "c4", name: "Retargeting - Search", type: "search", status: "paused", budget: 2000, spend: 800, impressions: 30000, clicks: 450, conversions: 12, cpc: 1.78, ctr: 1.5, roas: 1.2, date: "2026-04-01", industry: "retail", region: "US-South" },
  { id: "c5", name: "Holiday Promo - Display", type: "display", status: "active", budget: 6000, spend: 5500, impressions: 800000, clicks: 8000, conversions: 320, cpc: 0.69, ctr: 1.0, roas: 5.8, date: "2026-04-01", industry: "retail", region: "US-East" },
  { id: "c6", name: "Summer Clearance - Search", type: "search", status: "active", budget: 4500, spend: 4100, impressions: 95000, clicks: 2850, conversions: 142, cpc: 1.44, ctr: 3.0, roas: 3.8, date: "2026-04-01", industry: "fashion", region: "US-West" },
  { id: "c7", name: "App Install - Video", type: "video", status: "active", budget: 3500, spend: 3200, impressions: 180000, clicks: 5400, conversions: 270, cpc: 0.59, ctr: 3.0, roas: 6.2, date: "2026-04-01", industry: "tech", region: "US-East" },
  { id: "c8", name: "Lead Gen - Search", type: "search", status: "active", budget: 2500, spend: 2300, impressions: 45000, clicks: 1350, conversions: 67, cpc: 1.70, ctr: 3.0, roas: 2.9, date: "2026-04-01", industry: "finance", region: "US-East" },
  { id: "c9", name: "Remarketing - Display", type: "display", status: "active", budget: 1800, spend: 1600, impressions: 220000, clicks: 1760, conversions: 53, cpc: 0.91, ctr: 0.8, roas: 3.1, date: "2026-04-01", industry: "finance", region: "US-West" },
  { id: "c10", name: "YouTube Pre-roll - Video", type: "video", status: "active", budget: 5500, spend: 5100, impressions: 310000, clicks: 6200, conversions: 248, cpc: 0.82, ctr: 2.0, roas: 4.7, date: "2026-04-01", industry: "entertainment", region: "US-East" },
  { id: "c11", name: "Black Friday - Search", type: "search", status: "paused", budget: 8000, spend: 7800, impressions: 210000, clicks: 8400, conversions: 504, cpc: 0.93, ctr: 4.0, roas: 7.2, date: "2026-03-01", industry: "retail", region: "US-National" },
  { id: "c12", name: "Competitor Keywords - Search", type: "search", status: "active", budget: 3000, spend: 2800, impressions: 55000, clicks: 1650, conversions: 49, cpc: 1.70, ctr: 3.0, roas: 1.9, date: "2026-04-01", industry: "tech", region: "US-West" },
  { id: "c13", name: "New User Acquisition - Display", type: "display", status: "active", budget: 4000, spend: 3700, impressions: 560000, clicks: 4480, conversions: 89, cpc: 0.83, ctr: 0.8, roas: 2.4, date: "2026-04-01", industry: "saas", region: "US-East" },
  { id: "c14", name: "Product Launch - Video", type: "video", status: "active", budget: 6000, spend: 5800, impressions: 420000, clicks: 8400, conversions: 336, cpc: 0.69, ctr: 2.0, roas: 5.4, date: "2026-04-01", industry: "tech", region: "US-National" },
  { id: "c15", name: "Local Services - Search", type: "search", status: "active", budget: 1500, spend: 1400, impressions: 28000, clicks: 840, conversions: 42, cpc: 1.67, ctr: 3.0, roas: 3.2, date: "2026-04-01", industry: "services", region: "US-West" },
  { id: "c16", name: "Seasonal Fashion - Display", type: "display", status: "active", budget: 2500, spend: 2200, impressions: 330000, clicks: 2310, conversions: 46, cpc: 0.95, ctr: 0.7, roas: 1.6, date: "2026-04-01", industry: "fashion", region: "US-East" },
  { id: "c17", name: "B2B SaaS - Search", type: "search", status: "active", budget: 5000, spend: 4800, impressions: 38000, clicks: 1140, conversions: 57, cpc: 4.21, ctr: 3.0, roas: 4.8, date: "2026-04-01", industry: "saas", region: "US-National" },
  { id: "c18", name: "E-commerce Promo - Video", type: "video", status: "paused", budget: 2000, spend: 600, impressions: 45000, clicks: 900, conversions: 18, cpc: 0.67, ctr: 2.0, roas: 1.1, date: "2026-04-01", industry: "retail", region: "US-South" },
  { id: "c19", name: "Insurance Leads - Search", type: "search", status: "active", budget: 6000, spend: 5700, impressions: 42000, clicks: 1260, conversions: 63, cpc: 4.52, ctr: 3.0, roas: 3.6, date: "2026-04-01", industry: "finance", region: "US-East" },
  { id: "c20", name: "Travel Summer - Display", type: "display", status: "active", budget: 3500, spend: 3200, impressions: 480000, clicks: 3360, conversions: 67, cpc: 0.95, ctr: 0.7, roas: 2.7, date: "2026-04-01", industry: "travel", region: "US-West" },
  { id: "c21", name: "Gaming App - Video", type: "video", status: "active", budget: 4500, spend: 4200, impressions: 380000, clicks: 11400, conversions: 570, cpc: 0.37, ctr: 3.0, roas: 8.1, date: "2026-04-01", industry: "gaming", region: "US-National" },
  { id: "c22", name: "Healthcare Search - Search", type: "search", status: "active", budget: 4000, spend: 3800, impressions: 32000, clicks: 960, conversions: 48, cpc: 3.96, ctr: 3.0, roas: 3.3, date: "2026-04-01", industry: "healthcare", region: "US-East" },
  { id: "c23", name: "Auto Dealer - Search", type: "search", status: "active", budget: 5500, spend: 5200, impressions: 48000, clicks: 1440, conversions: 43, cpc: 3.61, ctr: 3.0, roas: 2.8, date: "2026-04-01", industry: "automotive", region: "US-South" },
  { id: "c24", name: "Food Delivery - Display", type: "display", status: "active", budget: 2000, spend: 1900, impressions: 285000, clicks: 2280, conversions: 114, cpc: 0.83, ctr: 0.8, roas: 4.4, date: "2026-04-01", industry: "food", region: "US-West" },
  { id: "c25", name: "EdTech Course - Video", type: "video", status: "active", budget: 3000, spend: 2800, impressions: 210000, clicks: 6300, conversions: 189, cpc: 0.44, ctr: 3.0, roas: 5.1, date: "2026-04-01", industry: "education", region: "US-National" },
  { id: "c26", name: "Real Estate - Search", type: "search", status: "active", budget: 7000, spend: 6800, impressions: 52000, clicks: 1560, conversions: 31, cpc: 4.36, ctr: 3.0, roas: 2.2, date: "2026-04-01", industry: "realestate", region: "US-West" },
  { id: "c27", name: "Pet Products - Display", type: "display", status: "paused", budget: 1500, spend: 400, impressions: 60000, clicks: 420, conversions: 8, cpc: 0.95, ctr: 0.7, roas: 0.9, date: "2026-04-01", industry: "retail", region: "US-East" },
  { id: "c28", name: "Fitness App - Video", type: "video", status: "active", budget: 3500, spend: 3300, impressions: 290000, clicks: 8700, conversions: 348, cpc: 0.38, ctr: 3.0, roas: 6.7, date: "2026-04-01", industry: "health", region: "US-National" },
  { id: "c29", name: "Home Improvement - Search", type: "search", status: "active", budget: 3000, spend: 2800, impressions: 38000, clicks: 1140, conversions: 57, cpc: 2.46, ctr: 3.0, roas: 3.4, date: "2026-04-01", industry: "home", region: "US-South" },
  { id: "c30", name: "Luxury Fashion - Display", type: "display", status: "active", budget: 8000, spend: 7600, impressions: 920000, clicks: 6440, conversions: 128, cpc: 1.18, ctr: 0.7, roas: 4.1, date: "2026-04-01", industry: "fashion", region: "US-National" },
];

export const industryBenchmarks = {
  search: { avgCTR: 3.17, avgCPC: 2.69, avgCVR: 3.75, avgROAS: 3.5 },
  display: { avgCTR: 0.46, avgCPC: 0.63, avgCVR: 0.77, avgROAS: 2.8 },
  video: { avgCTR: 0.514, avgCPC: 0.10, avgCVR: 1.8, avgROAS: 4.0 },
  byIndustry: {
    retail: { avgROAS: 4.0, avgCPC: 1.20 },
    tech: { avgROAS: 3.8, avgCPC: 2.50 },
    finance: { avgROAS: 3.2, avgCPC: 4.80 },
    saas: { avgROAS: 4.2, avgCPC: 3.90 },
    healthcare: { avgROAS: 3.0, avgCPC: 4.20 },
    automotive: { avgROAS: 2.5, avgCPC: 3.50 },
    travel: { avgROAS: 3.5, avgCPC: 1.80 },
    gaming: { avgROAS: 7.0, avgCPC: 0.40 },
    education: { avgROAS: 4.5, avgCPC: 0.50 },
    food: { avgROAS: 4.0, avgCPC: 0.90 },
    fashion: { avgROAS: 3.8, avgCPC: 1.10 },
    realestate: { avgROAS: 2.0, avgCPC: 4.50 },
    home: { avgROAS: 3.2, avgCPC: 2.50 },
    health: { avgROAS: 5.5, avgCPC: 0.40 },
    entertainment: { avgROAS: 4.2, avgCPC: 0.80 },
    services: { avgROAS: 3.0, avgCPC: 1.70 },
  }
};

export const googleAdsContext = `
GOOGLE ADS EXPERT CONTEXT — USE THIS TO GIVE EXPERT RECOMMENDATIONS:

INDUSTRY BENCHMARKS:
- Search campaigns: avg CTR 3.17%, avg CPC $2.69, avg ROAS 3.5x
- Display campaigns: avg CTR 0.46%, avg CPC $0.63, avg ROAS 2.8x  
- Video campaigns: avg CTR 0.514%, avg CPC $0.10, avg ROAS 4.0x

ROAS THRESHOLDS:
- Below 2x: Campaign is losing money after platform fees — pause or restructure immediately
- 2x-3x: Marginal — optimize targeting, bids, and creative before scaling
- 3x-5x: Healthy — maintain and test incremental budget increases
- Above 5x: Strong performer — increase budget aggressively by 20-30%

OPTIMIZATION PLAYBOOK:
- Low CTR on Search (<2%): Rewrite ad copy, add RSA variations, review keyword match types
- High CPC on Search: Switch to Target CPA bidding, add negative keywords, improve Quality Score
- Low ROAS on Display: Tighten audience segments, exclude low-intent placements, test new creatives
- Low CTR on Display (<0.4%): Creative fatigue — rotate new banner sizes, test new imagery
- Strong Video ROAS: Increase budget, test unskippable formats, expand to similar audiences
- Paused campaigns with good historical ROAS: Consider reactivating with refined targeting

BUDGET ALLOCATION RULES:
- Top performers (ROAS >5x): Allocate 40% of total budget
- Mid performers (ROAS 3-5x): Allocate 40% of total budget  
- Underperformers (ROAS <3x): Allocate max 20%, focus on optimization
- Never let a paused campaign sit >30 days without review

SEASONAL PATTERNS:
- Q4 (Oct-Dec): 35% higher CPCs, 60% higher conversion rates — increase budgets
- Q1 (Jan-Mar): Lower competition, good for brand awareness campaigns
- Q2 (Apr-Jun): Steady growth period, ideal for testing new campaigns
- Summer: Travel, food, gaming perform above average
`;