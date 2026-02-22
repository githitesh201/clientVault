import { Global, Module } from '@nestjs/common';

import { RedisClientService } from 'src/engine/core-modules/redis-client/redis-client.service';
import { ClientVaultConfigModule } from 'src/engine/core-modules/clientvault-config/clientvault-config.module';

@Global()
@Module({
  imports: [ClientVaultConfigModule],
  providers: [RedisClientService],
  exports: [RedisClientService],
})
export class RedisClientModule {}
