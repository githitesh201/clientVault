import { Module } from '@nestjs/common';

import { ClientVaultORMModule } from 'src/engine/clientvault-orm/clientvault-orm.module';

import { RecordPositionService } from './services/record-position.service';

@Module({
  imports: [ClientVaultORMModule],
  providers: [RecordPositionService],
  exports: [RecordPositionService],
})
export class RecordPositionModule {}
