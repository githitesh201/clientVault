import { type AppPath, type NavigateOptions } from 'clientvault-shared/types';

export type FrontComponentHostCommunicationApi = {
  navigate: (
    to: AppPath,
    params?: Record<string, string | null>,
    queryParams?: Record<string, unknown>,
    options?: NavigateOptions,
  ) => Promise<void>;
};
