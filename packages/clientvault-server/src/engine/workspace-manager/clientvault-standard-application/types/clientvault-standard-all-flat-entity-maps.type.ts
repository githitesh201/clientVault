import { type AllFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/all-flat-entity-maps.type';
import { type MetadataToFlatEntityMapsKey } from 'src/engine/metadata-modules/flat-entity/types/metadata-to-flat-entity-maps-key';
import { type CLIENTVAULT_STANDARD_ALL_METADATA_NAME } from 'src/engine/workspace-manager/clientvault-standard-application/constants/clientvault-standard-all-metadata-name.constant';

export type ClientVaultStandardAllFlatEntityMaps = Pick<
  AllFlatEntityMaps,
  MetadataToFlatEntityMapsKey<
    (typeof CLIENTVAULT_STANDARD_ALL_METADATA_NAME)[number]
  >
>;
