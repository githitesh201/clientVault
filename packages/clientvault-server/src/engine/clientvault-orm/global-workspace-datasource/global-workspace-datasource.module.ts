import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ClientVaultConfigModule } from 'src/engine/core-modules/clientvault-config/clientvault-config.module';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { DataSourceModule } from 'src/engine/metadata-modules/data-source/data-source.module';
import { FieldMetadataEntity } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { WorkspaceManyOrAllFlatEntityMapsCacheModule } from 'src/engine/metadata-modules/flat-entity/services/workspace-many-or-all-flat-entity-maps-cache.module';
import { ObjectMetadataEntity } from 'src/engine/metadata-modules/object-metadata/object-metadata.entity';
import { WorkspaceFeatureFlagsMapCacheModule } from 'src/engine/metadata-modules/workspace-feature-flags-map-cache/workspace-feature-flags-map-cache.module';
import { EntitySchemaColumnFactory } from 'src/engine/clientvault-orm/factories/entity-schema-column.factory';
import { EntitySchemaRelationFactory } from 'src/engine/clientvault-orm/factories/entity-schema-relation.factory';
import { EntitySchemaFactory } from 'src/engine/clientvault-orm/factories/entity-schema.factory';
import { GlobalWorkspaceDataSourceService } from 'src/engine/clientvault-orm/global-workspace-datasource/global-workspace-datasource.service';
import { GlobalWorkspaceOrmManager } from 'src/engine/clientvault-orm/global-workspace-datasource/global-workspace-orm.manager';
import { WorkspaceORMEntityMetadatasCacheService } from 'src/engine/clientvault-orm/global-workspace-datasource/workspace-orm-entity-metadatas-cache.service';
import { ClientVaultORMModule } from 'src/engine/clientvault-orm/clientvault-orm.module';
import { WorkspaceCacheStorageModule } from 'src/engine/workspace-cache-storage/workspace-cache-storage.module';
import { WorkspaceCacheModule } from 'src/engine/workspace-cache/workspace-cache.module';
import { WorkspaceEventEmitterModule } from 'src/engine/workspace-event-emitter/workspace-event-emitter.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      WorkspaceEntity,
      ObjectMetadataEntity,
      FieldMetadataEntity,
    ]),
    DataSourceModule,
    WorkspaceCacheStorageModule,
    WorkspaceManyOrAllFlatEntityMapsCacheModule,
    WorkspaceFeatureFlagsMapCacheModule,
    ClientVaultConfigModule,
    WorkspaceEventEmitterModule,
    WorkspaceCacheModule,
    ClientVaultORMModule,
  ],
  providers: [
    GlobalWorkspaceDataSourceService,
    GlobalWorkspaceOrmManager,
    EntitySchemaFactory,
    EntitySchemaColumnFactory,
    EntitySchemaRelationFactory,
    WorkspaceORMEntityMetadatasCacheService,
  ],
  exports: [GlobalWorkspaceDataSourceService, GlobalWorkspaceOrmManager],
})
export class GlobalWorkspaceDataSourceModule {}
