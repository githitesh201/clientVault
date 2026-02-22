import {
  LoggerDriverType,
  type LoggerModuleOptions,
} from 'src/engine/core-modules/logger/interfaces';
import { type ClientVaultConfigService } from 'src/engine/core-modules/clientvault-config/clientvault-config.service';

/**
 * Logger Module factory
 * @returns LoggerModuleOptions
 * @param clientvaultConfigService
 */
export const loggerModuleFactory = async (
  clientvaultConfigService: ClientVaultConfigService,
): Promise<LoggerModuleOptions> => {
  const driverType = clientvaultConfigService.get('LOGGER_DRIVER');
  const logLevels = clientvaultConfigService.get('LOG_LEVELS');

  switch (driverType) {
    case LoggerDriverType.CONSOLE: {
      return {
        type: LoggerDriverType.CONSOLE,
        logLevels: logLevels,
      };
    }
    default:
      throw new Error(
        `Invalid logger driver type (${driverType}), check your .env file`,
      );
  }
};
