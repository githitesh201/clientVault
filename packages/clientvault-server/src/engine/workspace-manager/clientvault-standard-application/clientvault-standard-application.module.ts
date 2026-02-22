import { Module } from '@nestjs/common';

import { ApplicationModule } from 'src/engine/core-modules/application/application.module';
import { ClientVaultConfigModule } from 'src/engine/core-modules/clientvault-config/clientvault-config.module';
import { WorkspaceManyOrAllFlatEntityMapsCacheModule } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module';
import { GlobalWorkspaceDataSourceModule } from 'src/engine/clientvault-orm/global-workspace-datasource/global-workspace-datasource.module';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';
import { WorkspaceMigrationModule } from 'src/engine/workspace-manager/workspace-migration/workspace-migration.module';

import { ClientVaultStandardApplicationService } from './services/clientvault-standard-application.service';

@Module({
  providers: [ClientVaultStandardApplicationService],
  imports: [
    ApplicationModule,
    ClientVaultConfigModule,
    WorkspaceCacheModule,
    WorkspaceMigrationModule,
    GlobalWorkspaceDataSourceModule,
    WorkspaceManyOrAllFlatEntityMapsCacheModule,
  ],
  exports: [ClientVaultStandardApplicationService],
})
export class ClientVaultStandardApplicationModule {}
