import { type AllMetadataName } from 'clientvault-shared/metadata';

export const CLIENTVAULT_STANDARD_ALL_METADATA_NAME = [
  'index',
  'objectMetadata',
  'fieldMetadata',
  'viewField',
  'viewFieldGroup',
  'viewFilter',
  'viewGroup',
  'view',
  'navigationMenuItem',
  'role',
  'agent',
  'skill',
  'pageLayout',
  'pageLayoutTab',
  'pageLayoutWidget',
] as const satisfies AllMetadataName[];
