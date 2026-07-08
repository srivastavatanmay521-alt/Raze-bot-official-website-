import mongoose, { Schema, type InferSchemaType } from "mongoose";

const announcementSchema = new Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    type: {
      type: String,
      enum: ["info", "warning", "update", "maintenance"],
      default: "info",
      required: true,
    },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

export type AnnouncementDoc = InferSchemaType<typeof announcementSchema> & {
  _id: mongoose.Types.ObjectId;
  createdAt: Date;
};

export const Announcement =
  mongoose.models["Announcement"] ??
  mongoose.model("Announcement", announcementSchema);
