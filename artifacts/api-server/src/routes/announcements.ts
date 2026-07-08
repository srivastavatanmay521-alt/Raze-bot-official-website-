import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, announcementsTable } from "@workspace/db";
import { GetAnnouncementsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/announcements", async (req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(announcementsTable)
    .orderBy(desc(announcementsTable.createdAt))
    .limit(20);

  res.json(
    GetAnnouncementsResponse.parse(
      rows.map((r) => ({
        ...r,
        createdAt: r.createdAt.toISOString(),
      })),
    ),
  );
});

export default router;
