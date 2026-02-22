import { CLIENTVAULT_STANDARD_APPLICATION } from 'src/engine/workspace-manager/clientvault-standard-application/constants/clientvault-standard-applications';
import { type UniversalSyncableFlatEntity } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/universal-flat-entity-from.type';

export const belongsToClientVaultStandardApp = <
  T extends UniversalSyncableFlatEntity,
>({
  applicationUniversalIdentifier,
}: T) =>
  applicationUniversalIdentifier ===
  CLIENTVAULT_STANDARD_APPLICATION.universalIdentifier;
