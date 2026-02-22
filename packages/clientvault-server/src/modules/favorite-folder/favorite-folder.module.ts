import { Module } from '@nestjs/common';

import { ClientVaultORMModule } from 'src/engine/clientvault-orm/clientvault-orm.module';
import { FavoriteFolderDeletionListener } from 'src/modules/favorite-folder/listeners/favorite-folder.listener';

@Module({
  imports: [ClientVaultORMModule],
  providers: [FavoriteFolderDeletionListener],
})
export class FavoriteFolderModule {}
