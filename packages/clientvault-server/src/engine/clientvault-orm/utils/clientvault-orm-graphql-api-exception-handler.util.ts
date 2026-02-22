import { isDefined } from 'clientvault-shared/utils';

import { UserInputError } from 'src/engine/core-modules/graphql/utils/graphql-errors.util';
import {
  type ClientVaultORMException,
  ClientVaultORMExceptionCode,
} from 'src/engine/clientvault-orm/exceptions/clientvault-orm.exception';

interface DuplicateKeyErrorWithMetadata extends ClientVaultORMException {
  conflictingRecordId?: string;
  conflictingObjectNameSingular?: string;
}

export const clientvaultORMGraphqlApiExceptionHandler = (
  error: ClientVaultORMException,
) => {
  switch (error.code) {
    case ClientVaultORMExceptionCode.DUPLICATE_ENTRY_DETECTED: {
      const duplicateKeyError: DuplicateKeyErrorWithMetadata = error;

      const extensions: Record<string, unknown> = {
        userFriendlyMessage: error.userFriendlyMessage,
        ...(isDefined(duplicateKeyError.conflictingRecordId) &&
        isDefined(duplicateKeyError.conflictingObjectNameSingular)
          ? {
              conflictingRecordId: duplicateKeyError.conflictingRecordId,
              conflictingObjectNameSingular:
                duplicateKeyError.conflictingObjectNameSingular,
            }
          : {}),
      };

      throw new UserInputError(error.message, extensions);
    }

    case ClientVaultORMExceptionCode.INVALID_INPUT:
    case ClientVaultORMExceptionCode.CONNECT_RECORD_NOT_FOUND:
    case ClientVaultORMExceptionCode.CONNECT_NOT_ALLOWED:
    case ClientVaultORMExceptionCode.CONNECT_UNIQUE_CONSTRAINT_ERROR:
    case ClientVaultORMExceptionCode.RLS_VALIDATION_FAILED:
    case ClientVaultORMExceptionCode.TOO_MANY_RECORDS_TO_UPDATE:
      throw new UserInputError(error.message, {
        userFriendlyMessage: error.userFriendlyMessage,
      });
    default: {
      throw error;
    }
  }
};
