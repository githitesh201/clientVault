import {
  type CaptchaDriverOptions,
  type CaptchaModuleOptions,
} from 'src/engine/core-modules/captcha/interfaces';
import { type ClientVaultConfigService } from 'src/engine/core-modules/clientvault-config/clientvault-config.service';

export const captchaModuleFactory = (
  clientvaultConfigService: ClientVaultConfigService,
): CaptchaModuleOptions | undefined => {
  const driver = clientvaultConfigService.get('CAPTCHA_DRIVER');
  const siteKey = clientvaultConfigService.get('CAPTCHA_SITE_KEY');
  const secretKey = clientvaultConfigService.get('CAPTCHA_SECRET_KEY');

  if (!driver) {
    return;
  }

  if (!siteKey || !secretKey) {
    throw new Error('Captcha driver requires site key and secret key');
  }

  const captchaOptions: CaptchaDriverOptions = {
    siteKey,
    secretKey,
  };

  return {
    type: driver,
    options: captchaOptions,
  };
};
