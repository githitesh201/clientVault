import { Injectable } from '@nestjs/common';

import { SecureHttpClientService } from 'src/engine/core-modules/secure-http-client/secure-http-client.service';
import { ClientVaultConfigService } from 'src/engine/core-modules/clientvault-config/clientvault-config.service';

type CreateEventInput = {
  action: string;
  payload: object;
};

@Injectable()
export class TelemetryService {
  constructor(
    private readonly clientvaultConfigService: ClientVaultConfigService,
    private readonly secureHttpClientService: SecureHttpClientService,
  ) {}

  async create(
    createEventInput: CreateEventInput,
    userId: string | null | undefined,
    workspaceId: string | null | undefined,
  ) {
    if (!this.clientvaultConfigService.get('TELEMETRY_ENABLED')) {
      return { success: true };
    }

    const data = {
      action: createEventInput.action,
      timestamp: new Date().toISOString(),
      version: '1',
      payload: {
        userId: userId,
        workspaceId: workspaceId,
        ...createEventInput.payload,
      },
    };

    try {
      const httpClient = this.secureHttpClientService.getHttpClient({
        baseURL: 'https://clientvault-telemetry.com/api/v2',
      });

      await httpClient.post(`/selfHostingEvent`, data);
    } catch {
      return { success: false };
    }

    return { success: true };
  }
}
