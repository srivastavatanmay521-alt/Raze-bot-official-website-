import { Router, type IRouter } from "express";
import { connectDB, Partner } from "@workspace/db";
import { GetPartnersResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/partners", async (_req, res): Promise<void> => {
  await connectDB();
  const rows = await Partner.find().sort({ createdAt: -1 }).lean();

  res.json(
    GetPartnersResponse.parse(
      rows.map((r) => ({
        id: String(r._id),
        name: r.name,
        description: r.description,
        inviteUrl: r.inviteUrl,
        iconUrl: r.iconUrl ?? null,
        memberCount: r.memberCount ?? null,
        createdAt: (r.createdAt as Date).toISOString(),
      })),
    ),
  );
});

export default router;
