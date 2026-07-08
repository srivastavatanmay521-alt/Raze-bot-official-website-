import { Router, type IRouter } from "express";
import { desc } from "drizzle-orm";
import { db, partnersTable } from "@workspace/db";
import { GetPartnersResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/partners", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(partnersTable)
    .orderBy(desc(partnersTable.createdAt));

  res.json(
    GetPartnersResponse.parse(
      rows.map((r) => ({
        ...r,
        iconUrl: r.iconUrl ?? null,
        memberCount: r.memberCount ?? null,
        createdAt: r.createdAt.toISOString(),
      })),
    ),
  );
});

export default router;
