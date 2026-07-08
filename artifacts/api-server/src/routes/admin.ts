import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import { db, announcementsTable, statsOverrideTable, partnersTable } from "@workspace/db";
import {
  AdminLoginBody,
  AdminLoginResponse,
  CreateAnnouncementBody,
  CreateAnnouncementResponse,
  DeleteAnnouncementParams,
  DeleteAnnouncementResponse,
  CreatePartnerBody,
  CreatePartnerResponse,
  DeletePartnerParams,
  DeletePartnerResponse,
  GetAdminStatsResponse,
  UpdateStatsOverrideBody,
  UpdateStatsOverrideResponse,
} from "@workspace/api-zod";
import { startTime, formatUptime } from "./stats";

const router: IRouter = Router();

const ADMIN_EMAIL = process.env["ADMIN_EMAIL"] ?? "void@razebot.site";
const ADMIN_PASSWORD = process.env["ADMIN_PASSWORD"] ?? "R@zeB0t#Admin2025";
const ADMIN_TOKEN = process.env["ADMIN_TOKEN"] ?? "razebot-secret-token-xyz";

function requireAuth(req: any, res: any): boolean {
  const auth = req.headers["authorization"] as string | undefined;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token !== ADMIN_TOKEN) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}

router.post("/admin/login", async (req, res): Promise<void> => {
  const parsed = AdminLoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  if (
    parsed.data.email.toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
    parsed.data.password !== ADMIN_PASSWORD
  ) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  res.json(AdminLoginResponse.parse({ success: true, token: ADMIN_TOKEN }));
});

router.get("/admin/stats", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;

  const [override] = await db
    .select()
    .from(statsOverrideTable)
    .orderBy(statsOverrideTable.updatedAt)
    .limit(1);

  const [announcementCount, partnerCount] = await Promise.all([
    db.$count(announcementsTable),
    db.$count(partnersTable),
  ]);

  const stats = {
    servers: override?.servers ?? 1247,
    users: override?.users ?? 89432,
    commandsRun: override?.commandsRun ?? 4182903,
    uptime: formatUptime(Date.now() - startTime),
    announcements: announcementCount,
    partners: partnerCount,
    lastUpdated: new Date().toISOString(),
  };

  res.json(GetAdminStatsResponse.parse(stats));
});

router.post("/admin/announcements", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;

  const parsed = CreateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(announcementsTable)
    .values({
      title: parsed.data.title,
      content: parsed.data.content,
      type: parsed.data.type,
    })
    .returning();

  res.status(201).json(
    CreateAnnouncementResponse.parse({
      ...row,
      createdAt: row.createdAt.toISOString(),
    }),
  );
});

router.delete("/admin/announcements/:id", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;

  const params = DeleteAnnouncementParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(announcementsTable)
    .where(eq(announcementsTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Announcement not found" });
    return;
  }

  res.json(DeleteAnnouncementResponse.parse({ success: true }));
});

router.post("/admin/partners", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;

  const parsed = CreatePartnerBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [row] = await db
    .insert(partnersTable)
    .values({
      name: parsed.data.name,
      description: parsed.data.description,
      inviteUrl: parsed.data.inviteUrl,
      iconUrl: parsed.data.iconUrl ?? null,
      memberCount: parsed.data.memberCount ?? null,
    })
    .returning();

  res.status(201).json(
    CreatePartnerResponse.parse({
      ...row,
      iconUrl: row.iconUrl ?? null,
      memberCount: row.memberCount ?? null,
      createdAt: row.createdAt.toISOString(),
    }),
  );
});

router.delete("/admin/partners/:id", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;

  const params = DeletePartnerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [deleted] = await db
    .delete(partnersTable)
    .where(eq(partnersTable.id, params.data.id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Partner not found" });
    return;
  }

  res.json(DeletePartnerResponse.parse({ success: true }));
});

router.post("/admin/stats-override", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;

  const parsed = UpdateStatsOverrideBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  await db.delete(statsOverrideTable);
  const [row] = await db
    .insert(statsOverrideTable)
    .values({
      servers: parsed.data.servers ?? null,
      users: parsed.data.users ?? null,
      commandsRun: parsed.data.commandsRun ?? null,
    })
    .returning();

  const stats = {
    servers: row.servers ?? 1247,
    users: row.users ?? 89432,
    commandsRun: row.commandsRun ?? 4182903,
    uptime: formatUptime(Date.now() - startTime),
  };

  res.json(UpdateStatsOverrideResponse.parse(stats));
});

export default router;
