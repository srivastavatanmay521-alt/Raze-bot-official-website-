import { Router, type IRouter } from "express";
import { connectDB, StatsOverride, type StatsOverrideDoc } from "@workspace/db";
import { GetBotStatsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

const startTime = Date.now();

function formatUptime(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

router.get("/stats", async (_req, res): Promise<void> => {
  await connectDB();
  const override = await StatsOverride.findById("singleton").lean<StatsOverrideDoc>();

  const stats = {
    servers: override?.servers ?? 1247,
    users: override?.users ?? 89432,
    commandsRun: override?.commandsRun ?? 4182903,
    uptime: formatUptime(Date.now() - startTime),
  };

  res.json(GetBotStatsResponse.parse(stats));
});

export { startTime, formatUptime };
export default router;
