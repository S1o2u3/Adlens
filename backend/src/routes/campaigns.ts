import { Router } from "express";
import { mockCampaigns } from "../data/mockData";
import { aggregateCampaigns } from "../services/aggregator";

const router = Router();

router.get("/", (req, res) => {
  res.json(mockCampaigns);
});

router.get("/stats", (req, res) => {
  const stats = aggregateCampaigns();
  res.json(stats);
});

export default router;