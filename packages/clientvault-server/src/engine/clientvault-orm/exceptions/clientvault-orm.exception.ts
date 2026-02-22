import { type MessageDescriptor } from '@lingui/core';
import { msg } from '@lingui/core/macro';
import { assertUnreachable } from 'clientvault-shared/utils';

import { STANDARD_ERROR_MESSAGE } from 'src/engine/api/common/common-query-runners/errors/standard-error-message.constant';
import { CustomException } from 'src/utils/custom-exception';

export enum ClientVaultORMExceptionCode {
  METADATA_VERSION_MISMATCH = 'METADATA_VERSION_MISMATCH',
  WORKSPACE_SCHEMA_NOT_FOUND = 'WORKSPACE_SCHEMA_NOT_FOUND',
  ROLES_PERMISSIONS_VERSION_NOT_FOUND = 'ROLES_PERMISSIONS_VERSION_NOT_FOUND',
  FEATURE_FLAG_MAP_VERSION_NOT_FOUND = 'FEATURE_FLAG_MAP_VERSION_NOT_FOUND',
  USER_WORKSPACE_ROLE_MAP_VERSION_NOT_FOUND = 'USER_WORKSPACE_ROLE_MAP_VERSION_NOT_FOUND',
  API_KEY_ROLE_MAP_VERSION_NOT_FOUND = 'API_KEY_ROLE_MAP_VERSION_NOT_FOUND',
  MALFORMED_METADATA = 'MALFORMED_METADATA',
  WORKSPACE_NOT_FOUND = 'WORKSPACE_NOT_FOUND',
  CONNECT_RECORD_NOT_FOUND = 'CONNECT_RECORD_NOT_FOUND',
  CONNECT_NOT_ALLOWED = 'CONNECT_NOT_ALLOWED',
  CONNECT_UNIQUE_CONSTRAINT_ERROR = 'CONNECT_UNIQUE_CONSTRAINT_ERROR',
  MISSING_MAIN_ALIAS_TARGET = 'MISSING_MAIN_ALIAS_TARGET',
  METHOD_NOT_ALLOWED = 'METHOD_NOT_ALLOWED',
  ENUM_TYPE_NAME_NOT_FOUND = 'ENUM_TYPE_NAME_NOT_FOUND',
  QUERY_READ_TIMEOUT = 'QUERY_READ_TIMEOUT',
  DUPLICATE_ENTRY_DETECTED = 'DUPLICATE_ENTRY_DETECTED',
  TOO_MANY_RECORDS_TO_UPDATE = 'TOO_MANY_RECORDS_TO_UPDATE',
  INVALID_INPUT = 'INVALID_INPUT',
  ORM_EVENT_DATA_CORRUPTED = 'ORM_EVENT_DATA_CORRUPTED',
  RLS_VALIDATION_FAILED = 'RLS_VALIDATION_FAILED',
  NO_ROLE_FOUND_FOR_USER_WORKSPACE = 'NO_ROLE_FOUND_FOR_USER_WORKSPACE',
}

const getClientVaultORMExceptionUserFriendlyMessage = (
  code: ClientVaultORMExceptionCode,
) => {
  switch (code) {
    case ClientVaultORMExceptionCode.METADATA_VERSION_MISMATCH:
      return msg`Data version mismatch. Please refresh and try again.`;
    case ClientVaultORMExceptionCode.WORKSPACE_SCHEMA_NOT_FOUND:
      return msg`Workspace schema not found.`;
    case ClientVaultORMExceptionCode.ROLES_PERMISSIONS_VERSION_NOT_FOUND:
      return msg`Roles and permissions configuration not found.`;
    case ClientVaultORMExceptionCode.FEATURE_FLAG_MAP_VERSION_NOT_FOUND:
      return msg`Feature configuration not found.`;
    case ClientVaultORMExceptionCode.USER_WORKSPACE_ROLE_MAP_VERSION_NOT_FOUND:
      return msg`User workspace role configuration not found.`;
    case ClientVaultORMExceptionCode.API_KEY_ROLE_MAP_VERSION_NOT_FOUND:
      return msg`API key role configuration not found.`;
    case ClientVaultORMExceptionCode.MALFORMED_METADATA:
      return msg`Data structure is invalid.`;
    case ClientVaultORMExceptionCode.WORKSPACE_NOT_FOUND:
      return msg`Workspace not found.`;
    case ClientVaultORMExceptionCode.CONNECT_RECORD_NOT_FOUND:
      return msg`Related record not found.`;
    case ClientVaultORMExceptionCode.CONNECT_NOT_ALLOWED:
      return msg`This connection is not allowed.`;
    case ClientVaultORMExceptionCode.CONNECT_UNIQUE_CONSTRAINT_ERROR:
      return msg`A record with this relationship already exists.`;
    case ClientVaultORMExceptionCode.MISSING_MAIN_ALIAS_TARGET:
      return msg`Missing main alias target.`;
    case ClientVaultORMExceptionCode.METHOD_NOT_ALLOWED:
      return msg`This operation is not allowed.`;
    case ClientVaultORMExceptionCode.QUERY_READ_TIMEOUT:
      return msg`Query timed out. Please try again.`;
    case ClientVaultORMExceptionCode.DUPLICATE_ENTRY_DETECTED:
      return msg`A duplicate entry was detected.`;
    case ClientVaultORMExceptionCode.TOO_MANY_RECORDS_TO_UPDATE:
      return msg`Too many records to update at once.`;
    case ClientVaultORMExceptionCode.INVALID_INPUT:
      return msg`Invalid input provided.`;
    case ClientVaultORMExceptionCode.RLS_VALIDATION_FAILED:
      return msg`Record does not satisfy security constraints.`;
    case ClientVaultORMExceptionCode.ENUM_TYPE_NAME_NOT_FOUND:
    case ClientVaultORMExceptionCode.ORM_EVENT_DATA_CORRUPTED:
      return STANDARD_ERROR_MESSAGE;
    case ClientVaultORMExceptionCode.NO_ROLE_FOUND_FOR_USER_WORKSPACE:
      return msg`No role found for user.`;
    default:
      assertUnreachable(code);
  }
};

export class ClientVaultORMException extends CustomException<ClientVaultORMExceptionCode> {
  constructor(
    message: string,
    code: ClientVaultORMExceptionCode,
    { userFriendlyMessage }: { userFriendlyMessage?: MessageDescriptor } = {},
  ) {
    super(message, code, {
      userFriendlyMessage:
        userFriendlyMessage ?? getClientVaultORMExceptionUserFriendlyMessage(code),
    });
  }
}
