import { fromNodeProviderChain } from '@aws-sdk/credential-providers';

import {
  LogicFunctionDriverType,
  type LogicFunctionModuleOptions,
} from 'src/engine/core-modules/logic-function/logic-function-drivers/interfaces/logic-function-driver.interface';

import { type ClientVaultConfigService } from 'src/engine/core-modules/clientvault-config/clientvault-config.service';
import type { LogicFunctionResourceService } from 'src/engine/core-modules/logic-function/logic-function-resource/logic-function-resource.service';

export const logicFunctionModuleFactory = async (
  clientvaultConfigService: ClientVaultConfigService,
  logicFunctionResourceService: LogicFunctionResourceService,
): Promise<LogicFunctionModuleOptions> => {
  const driverType = clientvaultConfigService.get('LOGIC_FUNCTION_TYPE');
  const options = { logicFunctionResourceService };

  switch (driverType) {
    case LogicFunctionDriverType.DISABLED: {
      return {
        type: LogicFunctionDriverType.DISABLED,
      };
    }
    case LogicFunctionDriverType.LOCAL: {
      return {
        type: LogicFunctionDriverType.LOCAL,
        options,
      };
    }
    case LogicFunctionDriverType.LAMBDA: {
      const region = clientvaultConfigService.get('LOGIC_FUNCTION_LAMBDA_REGION');
      const accessKeyId = clientvaultConfigService.get(
        'LOGIC_FUNCTION_LAMBDA_ACCESS_KEY_ID',
      );
      const secretAccessKey = clientvaultConfigService.get(
        'LOGIC_FUNCTION_LAMBDA_SECRET_ACCESS_KEY',
      );
      const lambdaRole = clientvaultConfigService.get('LOGIC_FUNCTION_LAMBDA_ROLE');

      const subhostingRole = clientvaultConfigService.get(
        'LOGIC_FUNCTION_LAMBDA_SUBHOSTING_ROLE',
      );

      return {
        type: LogicFunctionDriverType.LAMBDA,
        options: {
          ...options,
          credentials: accessKeyId
            ? {
                accessKeyId,
                secretAccessKey,
              }
            : fromNodeProviderChain({
                clientConfig: { region },
              }),
          region,
          lambdaRole,
          subhostingRole,
        },
      };
    }
    default:
      throw new Error(
        `Invalid logic function executor driver type (${driverType}), check your .env file`,
      );
  }
};
