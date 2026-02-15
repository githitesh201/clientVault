import { InferSchemaType, model, Schema } from 'mongoose';

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['task', 'invoice', 'project', 'security'], default: 'project' },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export type NotificationDocument = InferSchemaType<typeof notificationSchema>;
export const Notification = model<NotificationDocument>('Notification', notificationSchema);
