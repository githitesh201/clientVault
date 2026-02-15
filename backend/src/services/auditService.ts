import { AuditLog } from '../models/AuditLog.js';

export async function writeAuditLog(input: {
  userId: string;
  actionType: string;
  entity: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
}): Promise<void> {
  await AuditLog.create({
    userId: input.userId,
    actionType: input.actionType,
    entity: input.entity,
    entityId: input.entityId,
    metadata: input.metadata ?? {},
    ipAddress: input.ipAddress ?? ''
  });
}
