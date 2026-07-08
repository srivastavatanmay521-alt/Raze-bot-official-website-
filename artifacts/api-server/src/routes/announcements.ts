import { Router, type IRouter } from "express";
import { connectDB, Announcement } from "@workspace/db";
import { GetAnnouncementsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/announcements", async (_req, res): Promise<void> => {
  await connectDB();
  const rows = await Announcement.find().sort({ createdAt: -1 }).limit(20).lean();

  res.json(
    GetAnnouncementsResponse.parse(
      rows.map((r) => ({
        id: String(r._id),
        title: r.title,
        content: r.content,
        type: r.type,
        createdAt: (r.createdAt as Date).toISOString(),
      })),
    ),
  );
});

export default router;
