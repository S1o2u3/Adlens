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
  }
  
  export const mockCampaigns: Campaign[] = [
    {
      id: "c1",
      name: "Spring Sale - Search",
      type: "search",
      status: "active",
      budget: 5000,
      spend: 4200,
      impressions: 120000,
      clicks: 3600,
      conversions: 180,
      cpc: 1.17,
      ctr: 3.0,
      roas: 4.2,
      date: "2026-04-01",
    },
    {
      id: "c2",
      name: "Brand Awareness - Display",
      type: "display",
      status: "active",
      budget: 3000,
      spend: 2900,
      impressions: 450000,
      clicks: 2250,
      conversions: 45,
      cpc: 1.29,
      ctr: 0.5,
      roas: 1.8,
      date: "2026-04-01",
    },
    {
      id: "c3",
      name: "Product Demo - Video",
      type: "video",
      status: "active",
      budget: 4000,
      spend: 3800,
      impressions: 200000,
      clicks: 4000,
      conversions: 120,
      cpc: 0.95,
      ctr: 2.0,
      roas: 3.5,
      date: "2026-04-01",
    },
    {
      id: "c4",
      name: "Retargeting - Search",
      type: "search",
      status: "paused",
      budget: 2000,
      spend: 800,
      impressions: 30000,
      clicks: 450,
      conversions: 12,
      cpc: 1.78,
      ctr: 1.5,
      roas: 1.2,
      date: "2026-04-01",
    },
    {
      id: "c5",
      name: "Holiday Promo - Display",
      type: "display",
      status: "active",
      budget: 6000,
      spend: 5500,
      impressions: 800000,
      clicks: 8000,
      conversions: 320,
      cpc: 0.69,
      ctr: 1.0,
      roas: 5.8,
      date: "2026-04-01",
    },
  ];