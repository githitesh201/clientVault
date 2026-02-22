import { type ApplicationManifest } from 'clientvault-shared/application';

export type ApplicationConfig = Omit<
  ApplicationManifest,
  'packageJsonChecksum' | 'yarnLockChecksum' | 'apiClientChecksum'
>;
