import { type AllMetadataName } from 'clientvault-shared/metadata';

export type FlatEntityMapsKeyToMetadata<T extends string> =
  T extends `flat${infer Name}Maps`
    ? Uncapitalize<Name> extends AllMetadataName
      ? Uncapitalize<Name>
      : never
    : never;
