import { Campaign, mockCampaigns, industryBenchmarks } from "../data/mockData";

export interface AggregatedStats {
  totalSpend: number;
  totalImpressions: number;
  totalClicks: number;
  totalConversions: number;
  avgCTR: number;
  avgCPC: number;
  avgROAS: number;
  byType: Record<string, {
    spend: number;
    impressions: number;
    clicks: number;
    conversions: number;
    roas: number;
    vsIndustryROAS: string;
  }>;
  byIndustry: Record<string, { spend: number; roas: number; campaigns: number }>;
  underperforming: Campaign[];
  topPerformers: Campaign[];
}

export function aggregateCampaigns(): AggregatedStats {
  const campaigns = mockCampaigns;
  const count = campaigns.length;

  const totals = campaigns.reduce(
    (acc, c) => ({
      totalSpend: acc.totalSpend + c.spend,
      totalImpressions: acc.totalImpressions + c.impressions,
      totalClicks: acc.totalClicks + c.clicks,
      totalConversions: acc.totalConversions + c.conversions,
      avgCTR: acc.avgCTR + c.ctr,
      avgCPC: acc.avgCPC + c.cpc,
      avgROAS: acc.avgROAS + c.roas,
    }),
    { totalSpend: 0, totalImpressions: 0, totalClicks: 0, totalConversions: 0, avgCTR: 0, avgCPC: 0, avgROAS: 0 }
  );

  const byType: AggregatedStats["byType"] = {};
  for (const c of campaigns) {
    if (!byType[c.type]) {
      byType[c.type] = { spend: 0, impressions: 0, clicks: 0, conversions: 0, roas: 0, vsIndustryROAS: "" };
    }
    byType[c.type].spend += c.spend;
    byType[c.type].impressions += c.impressions;
    byType[c.type].clicks += c.clicks;
    byType[c.type].conversions += c.conversions;
    byType[c.type].roas = parseFloat(((byType[c.type].roas + c.roas) / 2).toFixed(2));
  }

  for (const type of Object.keys(byType)) {
    const benchmark = industryBenchmarks[type as keyof typeof industryBenchmarks] as { avgROAS: number };
    if (benchmark) {
      const diff = ((byType[type].roas - benchmark.avgROAS) / benchmark.avgROAS * 100).toFixed(0);
      byType[type].vsIndustryROAS = `${Number(diff) >= 0 ? "+" : ""}${diff}% vs industry`;
    }
  }

  const byIndustry: AggregatedStats["byIndustry"] = {};
  for (const c of campaigns) {
    if (!byIndustry[c.industry]) {
      byIndustry[c.industry] = { spend: 0, roas: 0, campaigns: 0 };
    }
    byIndustry[c.industry].spend += c.spend;
    byIndustry[c.industry].roas = parseFloat(((byIndustry[c.industry].roas + c.roas) / 2).toFixed(2));
    byIndustry[c.industry].campaigns += 1;
  }

  const underperforming = campaigns.filter((c) => c.roas < 2 || c.ctr < 0.4);
  const topPerformers = [...campaigns].sort((a, b) => b.roas - a.roas).slice(0, 3);

  return {
    totalSpend: totals.totalSpend,
    totalImpressions: totals.totalImpressions,
    totalClicks: totals.totalClicks,
    totalConversions: totals.totalConversions,
    avgCTR: parseFloat((totals.avgCTR / count).toFixed(2)),
    avgCPC: parseFloat((totals.avgCPC / count).toFixed(2)),
    avgROAS: parseFloat((totals.avgROAS / count).toFixed(2)),
    byType,
    byIndustry,
    underperforming,
    topPerformers,
  };
}