import mongoose, { Schema, type InferSchemaType } from "mongoose";

const partnerSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    inviteUrl: { type: String, required: true },
    iconUrl: { type: String, default: null },
    memberCount: { type: String, default: null },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

export type PartnerDoc = InferSchemaType<typeof partnerSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
};

export const Partner =
  mongoose.models["Partner"] ?? mongoose.model("Partner", partnerSchema);
