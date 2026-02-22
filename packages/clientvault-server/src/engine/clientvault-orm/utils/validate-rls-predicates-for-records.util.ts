/* @license Enterprise */

import { type ObjectRecord } from 'clientvault-shared/types';
import { type ObjectLiteral } from 'typeorm';

import { type WorkspaceInternalContext } from 'src/engine/clientvault-orm/interfaces/workspace-internal-context.interface';

import { type AuthContext } from 'src/engine/core-modules/auth/types/auth-context.type';
import { type FlatObjectMetadata } from 'src/engine/metadata-modules/flat-object-metadata/types/flat-object-metadata.type';
import {
  ClientVaultORMException,
  ClientVaultORMExceptionCode,
} from 'src/engine/clientvault-orm/exceptions/clientvault-orm.exception';
import { buildRowLevelPermissionRecordFilter } from 'src/engine/clientvault-orm/utils/build-row-level-permission-record-filter.util';
import { isRecordMatchingRLSRowLevelPermissionPredicate } from 'src/engine/clientvault-orm/utils/is-record-matching-rls-row-level-permission-predicate.util';

type ValidateRLSPredicatesForRecordsArgs<T extends ObjectLiteral> = {
  records: T[];
  objectMetadata: FlatObjectMetadata;
  internalContext: WorkspaceInternalContext;
  authContext: AuthContext;
  shouldBypassPermissionChecks: boolean;
  errorMessage?: string;
};

export const validateRLSPredicatesForRecords = <T extends ObjectLiteral>({
  records,
  objectMetadata,
  internalContext,
  authContext,
  shouldBypassPermissionChecks,
  errorMessage = 'Record does not satisfy row-level security constraints of your current role',
}: ValidateRLSPredicatesForRecordsArgs<T>): void => {
  if (shouldBypassPermissionChecks) {
    return;
  }

  const roleId = authContext.userWorkspaceId
    ? internalContext.userWorkspaceRoleMap[authContext.userWorkspaceId]
    : undefined;

  if (!roleId) {
    return;
  }

  const recordFilter = buildRowLevelPermissionRecordFilter({
    flatRowLevelPermissionPredicateMaps:
      internalContext.flatRowLevelPermissionPredicateMaps,
    flatRowLevelPermissionPredicateGroupMaps:
      internalContext.flatRowLevelPermissionPredicateGroupMaps,
    flatFieldMetadataMaps: internalContext.flatFieldMetadataMaps,
    objectMetadata,
    roleId,
    authContext,
  });

  if (!recordFilter || Object.keys(recordFilter).length === 0) {
    return;
  }

  for (const record of records) {
    const matchesRLS = isRecordMatchingRLSRowLevelPermissionPredicate({
      record: record as unknown as ObjectRecord,
      filter: recordFilter,
      flatObjectMetadata: objectMetadata,
      flatFieldMetadataMaps: internalContext.flatFieldMetadataMaps,
    });

    if (!matchesRLS) {
      throw new ClientVaultORMException(
        errorMessage,
        ClientVaultORMExceptionCode.RLS_VALIDATION_FAILED,
      );
    }
  }
};
