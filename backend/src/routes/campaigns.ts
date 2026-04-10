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

router.post("/ask-ai", async (req, res) => {
  const { question, context } = req.body;
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: context },
          { role: "user", content: question },
        ],
      }),
    });
    const data = await response.json();
    res.json({ answer: data.choices?.[0]?.message?.content ?? "No response." });
  } catch (err) {
    res.status(500).json({ error: "AI request failed" });
  }
});

export default router;