import { isDefined } from 'clientvault-shared/utils';

import { type AuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { type WorkspaceAuthContext } from 'src/engine/core-modules/auth/types/workspace-auth-context.type';

export const isWorkspaceAuthContext = (
  context: AuthContext,
): context is WorkspaceAuthContext => {
  return (
    isDefined(context.workspace) &&
    (isDefined(context.userWorkspaceId) ||
      isDefined(context.apiKey) ||
      isDefined(context.application))
  );
};
