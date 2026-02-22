import { type AllMetadataName } from 'clientvault-shared/metadata';

export type MetadataToFlatEntityMapsKey<T extends AllMetadataName> =
  T extends AllMetadataName ? `flat${Capitalize<T>}Maps` : never;
