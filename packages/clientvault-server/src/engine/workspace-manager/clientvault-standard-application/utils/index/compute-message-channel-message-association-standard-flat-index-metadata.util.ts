import { type FlatIndexMetadata } from 'src/engine/metadata-modules/flat-index-metadata/types/flat-index-metadata.type';
import { type AllStandardObjectIndexName } from 'src/engine/workspace-manager/clientvault-standard-application/types/all-standard-object-index-name.type';
import {
  type CreateStandardIndexArgs,
  createStandardIndexFlatMetadata,
} from 'src/engine/workspace-manager/clientvault-standard-application/utils/index/create-standard-index-flat-metadata.util';

export const buildMessageChannelMessageAssociationStandardFlatIndexMetadatas =
  ({
    now,
    objectName,
    workspaceId,
    standardObjectMetadataRelatedEntityIds,
    dependencyFlatEntityMaps,
    clientvaultStandardApplicationId,
  }: Omit<
    CreateStandardIndexArgs<'messageChannelMessageAssociation'>,
    'context'
  >): Record<
    AllStandardObjectIndexName<'messageChannelMessageAssociation'>,
    FlatIndexMetadata
  > => ({
    messageChannelIdIndex: createStandardIndexFlatMetadata({
      objectName,
      workspaceId,
      context: {
        indexName: 'messageChannelIdIndex',
        relatedFieldNames: ['messageChannel'],
      },
      standardObjectMetadataRelatedEntityIds,
      dependencyFlatEntityMaps,
      clientvaultStandardApplicationId,
      now,
    }),
    messageIdIndex: createStandardIndexFlatMetadata({
      objectName,
      workspaceId,
      context: {
        indexName: 'messageIdIndex',
        relatedFieldNames: ['message'],
      },
      standardObjectMetadataRelatedEntityIds,
      dependencyFlatEntityMaps,
      clientvaultStandardApplicationId,
      now,
    }),
    messageChannelIdMessageIdUniqueIndex: createStandardIndexFlatMetadata({
      objectName,
      workspaceId,
      context: {
        indexName: 'messageChannelIdMessageIdUniqueIndex',
        relatedFieldNames: ['messageChannel', 'message'],
        isUnique: true,
        indexWhereClause: '"deletedAt" IS NULL',
      },
      standardObjectMetadataRelatedEntityIds,
      dependencyFlatEntityMaps,
      clientvaultStandardApplicationId,
      now,
    }),
  });
