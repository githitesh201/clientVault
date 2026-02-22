import { type MetadataOperation } from '@/browser-event/types/MetadataOperation';
import { type AllMetadataName } from 'clientvault-shared/metadata';

export type MetadataOperationBrowserEventDetail<
  T extends Record<string, unknown>,
> = {
  metadataName: AllMetadataName;
  operation: MetadataOperation<T>;
};
