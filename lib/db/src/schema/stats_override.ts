import mongoose, { Schema, type InferSchemaType } from "mongoose";

// Single-document collection — always upsert the same key "singleton"
const statsOverrideSchema = new Schema(
  {
    _id: { type: String, default: "singleton" },
    servers: { type: Number, default: null },
    users: { type: Number, default: null },
    commandsRun: { type: Number, default: null },
  },
  { timestamps: { createdAt: false, updatedAt: "updatedAt" } },
);

export type StatsOverrideDoc = InferSchemaType<typeof statsOverrideSchema> & {
  updatedAt: Date;
};

export const StatsOverride =
  mongoose.models["StatsOverride"] ??
  mongoose.model("StatsOverride", statsOverrideSchema);
