import { Router, type IRouter } from "express";
import mongoose from "mongoose";
import {
  connectDB,
  Announcement,
  Partner,
  StatsOverride,
  type StatsOverrideDoc,
} from "@workspace/db";
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

const IS_PROD = process.env["NODE_ENV"] === "production";

function requireEnv(key: string, devDefault: string): string {
  const val = process.env[key];
  if (!val) {
    if (IS_PROD) {
      throw new Error(
        `Missing required environment variable: ${key}. Set it in your deployment environment.`,
      );
    }
    console.warn(
      `[admin] WARNING: ${key} not set — using insecure dev default. Never deploy without setting this.`,
    );
    return devDefault;
  }
  return val;
}

const ADMIN_EMAIL    = requireEnv("ADMIN_EMAIL",    "void@razebot.site");
const ADMIN_PASSWORD = requireEnv("ADMIN_PASSWORD", "R@zeB0t#Admin2025");
const ADMIN_TOKEN    = requireEnv("ADMIN_TOKEN",    "razebot-dev-token-change-me");

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
  await connectDB();

  const override = await StatsOverride.findById("singleton").lean<StatsOverrideDoc>();
  const [announcementCount, partnerCount] = await Promise.all([
    Announcement.countDocuments(),
    Partner.countDocuments(),
  ]);

  res.json(
    GetAdminStatsResponse.parse({
      servers: override?.servers ?? 1247,
      users: override?.users ?? 89432,
      commandsRun: override?.commandsRun ?? 4182903,
      uptime: formatUptime(Date.now() - startTime),
      announcements: announcementCount,
      partners: partnerCount,
      lastUpdated: new Date().toISOString(),
    }),
  );
});

router.post("/admin/announcements", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;
  const parsed = CreateAnnouncementBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await connectDB();
  const doc = await Announcement.create({
    title: parsed.data.title,
    content: parsed.data.content,
    type: parsed.data.type,
  });
  res.status(201).json(
    CreateAnnouncementResponse.parse({
      id: String(doc._id),
      title: doc.title,
      content: doc.content,
      type: doc.type,
      createdAt: (doc.createdAt as Date).toISOString(),
    }),
  );
});

router.delete("/admin/announcements/:id", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;
  const parsed = DeleteAnnouncementParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (!mongoose.isValidObjectId(parsed.data.id)) {
    res.status(404).json({ error: "Announcement not found" });
    return;
  }
  await connectDB();
  const result = await Announcement.findByIdAndDelete(parsed.data.id);
  if (!result) {
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
  await connectDB();
  const doc = await Partner.create({
    name: parsed.data.name,
    description: parsed.data.description,
    inviteUrl: parsed.data.inviteUrl,
    iconUrl: parsed.data.iconUrl ?? null,
    memberCount: parsed.data.memberCount ?? null,
  });
  res.status(201).json(
    CreatePartnerResponse.parse({
      id: String(doc._id),
      name: doc.name,
      description: doc.description,
      inviteUrl: doc.inviteUrl,
      iconUrl: doc.iconUrl ?? null,
      memberCount: doc.memberCount ?? null,
      createdAt: (doc.createdAt as Date).toISOString(),
    }),
  );
});

router.delete("/admin/partners/:id", async (req, res): Promise<void> => {
  if (!requireAuth(req, res)) return;
  const parsed = DeletePartnerParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  if (!mongoose.isValidObjectId(parsed.data.id)) {
    res.status(404).json({ error: "Partner not found" });
    return;
  }
  await connectDB();
  const result = await Partner.findByIdAndDelete(parsed.data.id);
  if (!result) {
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
  await connectDB();
  await StatsOverride.findByIdAndUpdate(
    "singleton",
    {
      servers: parsed.data.servers ?? null,
      users: parsed.data.users ?? null,
      commandsRun: parsed.data.commandsRun ?? null,
    },
    { upsert: true, new: true },
  );
  const override = await StatsOverride.findById("singleton").lean<StatsOverrideDoc>();
  res.json(
    UpdateStatsOverrideResponse.parse({
      servers: override?.servers ?? 1247,
      users: override?.users ?? 89432,
      commandsRun: override?.commandsRun ?? 4182903,
      uptime: formatUptime(Date.now() - startTime),
    }),
  );
});

export default router;
