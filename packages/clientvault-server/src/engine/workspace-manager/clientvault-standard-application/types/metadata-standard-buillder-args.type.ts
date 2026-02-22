import { type AllMetadataName } from 'clientvault-shared/metadata';

import { type MetadataValidationRelatedUniversalFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/metadata-related-types.type';
import { type StandardObjectMetadataRelatedEntityIds } from 'src/engine/workspace-manager/clientvault-standard-application/utils/get-standard-object-metadata-related-entity-ids.util';
import { type ComputeClientVaultStandardApplicationAllFlatEntityMapsArgs } from 'src/engine/workspace-manager/clientvault-standard-application/utils/clientvault-standard-application-all-flat-entity-maps.constant';

export type StandardBuilderArgs<T extends AllMetadataName> = {
  standardObjectMetadataRelatedEntityIds: StandardObjectMetadataRelatedEntityIds;
  dependencyFlatEntityMaps: MetadataValidationRelatedUniversalFlatEntityMaps<T>;
} & ComputeClientVaultStandardApplicationAllFlatEntityMapsArgs;
