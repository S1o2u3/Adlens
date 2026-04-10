import "dotenv/config";
import express from "express";
import cors from "cors";
import campaignRoutes from "./routes/campaigns";

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.use("/api/campaigns", campaignRoutes);

app.listen(PORT, () => {
  console.log(`✅ AdInsight backend running on http://localhost:${PORT}`);
});

