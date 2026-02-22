import { Module } from '@nestjs/common';

import { ClientVaultConfigModule } from 'src/engine/core-modules/clientvault-config/clientvault-config.module';

import { ClickHouseService } from './clickHouse.service';

@Module({
  imports: [ClientVaultConfigModule],
  providers: [ClickHouseService],
  exports: [ClickHouseService],
})
export class ClickHouseModule {}
