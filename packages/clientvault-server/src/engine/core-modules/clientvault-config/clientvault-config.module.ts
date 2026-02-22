import { type DynamicModule, Global, Module } from '@nestjs/common';

import { ConfigVariables } from 'src/engine/core-modules/clientvault-config/config-variables';
import { CONFIG_VARIABLES_INSTANCE_TOKEN } from 'src/engine/core-modules/clientvault-config/constants/config-variables-instance-tokens.constants';
import { DatabaseConfigModule } from 'src/engine/core-modules/clientvault-config/drivers/database-config.module';
import { ConfigurableModuleClass } from 'src/engine/core-modules/clientvault-config/clientvault-config.module-definition';
import { ClientVaultConfigService } from 'src/engine/core-modules/clientvault-config/clientvault-config.service';

@Global()
@Module({})
export class ClientVaultConfigModule extends ConfigurableModuleClass {
  static forRoot(): DynamicModule {
    const isConfigVariablesInDbEnabled =
      process.env.IS_CONFIG_VARIABLES_IN_DB_ENABLED !== 'false';

    const imports = isConfigVariablesInDbEnabled
      ? [DatabaseConfigModule.forRoot()]
      : [];

    return {
      module: ClientVaultConfigModule,
      imports,
      providers: [
        ClientVaultConfigService,
        {
          provide: CONFIG_VARIABLES_INSTANCE_TOKEN,
          useValue: new ConfigVariables(),
        },
      ],
      exports: [ClientVaultConfigService],
    };
  }
}
