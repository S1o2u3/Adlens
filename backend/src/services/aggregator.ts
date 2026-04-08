import { Campaign, mockCampaigns } from "../data/mockData";

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
  }>;
  underperforming: Campaign[];
}

export function aggregateCampaigns(): AggregatedStats {
  const campaigns = mockCampaigns;

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
    {
      totalSpend: 0,
      totalImpressions: 0,
      totalClicks: 0,
      totalConversions: 0,
      avgCTR: 0,
      avgCPC: 0,
      avgROAS: 0,
    }
  );

  const count = campaigns.length;

  const byType: AggregatedStats["byType"] = {};
  for (const c of campaigns) {
    if (!byType[c.type]) {
      byType[c.type] = { spend: 0, impressions: 0, clicks: 0, conversions: 0, roas: 0 };
    }
    byType[c.type].spend += c.spend;
    byType[c.type].impressions += c.impressions;
    byType[c.type].clicks += c.clicks;
    byType[c.type].conversions += c.conversions;
    byType[c.type].roas = parseFloat(
      ((byType[c.type].roas + c.roas) / 2).toFixed(2)
    );
  }

  const underperforming = campaigns.filter((c) => c.roas < 2 || c.ctr < 1);

  return {
    totalSpend: totals.totalSpend,
    totalImpressions: totals.totalImpressions,
    totalClicks: totals.totalClicks,
    totalConversions: totals.totalConversions,
    avgCTR: parseFloat((totals.avgCTR / count).toFixed(2)),
    avgCPC: parseFloat((totals.avgCPC / count).toFixed(2)),
    avgROAS: parseFloat((totals.avgROAS / count).toFixed(2)),
    byType,
    underperforming,
  };
}