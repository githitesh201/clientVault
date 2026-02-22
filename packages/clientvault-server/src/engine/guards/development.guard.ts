import { type CanActivate, Injectable } from '@nestjs/common';

import { NodeEnvironment } from 'src/engine/core-modules/clientvault-config/interfaces/node-environment.interface';

import { ClientVaultConfigService } from 'src/engine/core-modules/clientvault-config/clientvault-config.service';

@Injectable()
export class DevelopmentGuard implements CanActivate {
  constructor(private readonly clientvaultConfigService: ClientVaultConfigService) {}

  canActivate(): boolean {
    const nodeEnv = this.clientvaultConfigService.get('NODE_ENV');

    if (
      nodeEnv !== NodeEnvironment.DEVELOPMENT &&
      nodeEnv !== NodeEnvironment.TEST
    ) {
      throw new Error(
        'This endpoint is only available in development or test environments',
      );
    }

    return true;
  }
}
