import { CLIENTVAULT_STANDARD_APPLICATION } from 'src/engine/workspace-manager/clientvault-standard-application/constants/clientvault-standard-applications';
import { type WorkspaceMigrationBuilderOptions } from 'src/engine/workspace-manager/workspace-migration/workspace-migration-builder/types/workspace-migration-builder-options.type';

export const isCallerClientVaultStandardApp = (
  buildOptions: WorkspaceMigrationBuilderOptions,
) =>
  buildOptions.applicationUniversalIdentifier ===
  CLIENTVAULT_STANDARD_APPLICATION.universalIdentifier;
