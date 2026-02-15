import { InferSchemaType, model, Schema } from 'mongoose';

const auditLogSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    actionType: { type: String, required: true },
    entity: { type: String, required: true },
    entityId: { type: String, required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '' }
  },
  { timestamps: true }
);

export type AuditLogDocument = InferSchemaType<typeof auditLogSchema>;
export const AuditLog = model<AuditLogDocument>('AuditLog', auditLogSchema);
