import { type ObjectsPermissions } from 'clientvault-shared/types';
import { type PermissionFlagType } from 'clientvault-shared/constants';

export type UserWorkspacePermissions = {
  permissionFlags: Record<PermissionFlagType, boolean>;
  objectsPermissions: ObjectsPermissions;
};
