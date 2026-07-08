import { pgTable, integer, serial, timestamp } from "drizzle-orm/pg-core";

export const statsOverrideTable = pgTable("stats_override", {
  id: serial("id").primaryKey(),
  servers: integer("servers"),
  users: integer("users"),
  commandsRun: integer("commands_run"),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export type StatsOverride = typeof statsOverrideTable.$inferSelect;
