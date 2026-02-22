import { Injectable } from '@nestjs/common';

import { isNonEmptyString } from '@sniptt/guards';

import { NodeEnvironment } from 'src/engine/core-modules/clientvault-config/interfaces/node-environment.interface';
import { SupportDriver } from 'src/engine/core-modules/clientvault-config/interfaces/support.interface';

import {
  type ClientAIModelConfig,
  type ClientConfig,
} from 'src/engine/core-modules/client-config/client-config.entity';
import { DomainServerConfigService } from 'src/engine/core-modules/domain/domain-server-config/services/domain-server-config.service';
import { PUBLIC_FEATURE_FLAGS } from 'src/engine/core-modules/feature-flag/constants/public-feature-flag.const';
import { ClientVaultConfigService } from 'src/engine/core-modules/clientvault-config/clientvault-config.service';
import { convertCentsToBillingCredits } from 'src/engine/metadata-modules/ai/ai-billing/utils/convert-cents-to-billing-credits.util';
import {
  AI_MODELS,
  DEFAULT_FAST_MODEL,
  DEFAULT_SMART_MODEL,
  ModelProvider,
} from 'src/engine/metadata-modules/ai/ai-models/constants/ai-models.const';
import { AiModelRegistryService } from 'src/engine/metadata-modules/ai/ai-models/services/ai-model-registry.service';

@Injectable()
export class ClientConfigService {
  constructor(
    private clientvaultConfigService: ClientVaultConfigService,
    private domainServerConfigService: DomainServerConfigService,
    private aiModelRegistryService: AiModelRegistryService,
  ) {}

  private isCloudflareIntegrationEnabled(): boolean {
    return (
      !!this.clientvaultConfigService.get('CLOUDFLARE_API_KEY') &&
      !!this.clientvaultConfigService.get('CLOUDFLARE_ZONE_ID')
    );
  }

  async getClientConfig(): Promise<ClientConfig> {
    const captchaProvider = this.clientvaultConfigService.get('CAPTCHA_DRIVER');
    const supportDriver = this.clientvaultConfigService.get('SUPPORT_DRIVER');
    const calendarBookingPageId = this.clientvaultConfigService.get(
      'CALENDAR_BOOKING_PAGE_ID',
    );

    const availableModels = this.aiModelRegistryService.getAvailableModels();

    const aiModels: ClientAIModelConfig[] = availableModels.map(
      (registeredModel) => {
        const builtInModel = AI_MODELS.find(
          (m) => m.modelId === registeredModel.modelId,
        );

        return {
          modelId: registeredModel.modelId,
          label: builtInModel?.label || registeredModel.modelId,
          provider: registeredModel.provider,
          nativeCapabilities: builtInModel?.nativeCapabilities,
          inputCostPer1kTokensInCredits: builtInModel
            ? convertCentsToBillingCredits(
                builtInModel.inputCostPer1kTokensInCents,
              )
            : 0,
          outputCostPer1kTokensInCredits: builtInModel
            ? convertCentsToBillingCredits(
                builtInModel.outputCostPer1kTokensInCents,
              )
            : 0,
          deprecated: builtInModel?.deprecated,
        };
      },
    );

    if (aiModels.length > 0) {
      const defaultSpeedModel =
        this.aiModelRegistryService.getDefaultSpeedModel();
      const defaultSpeedModelConfig = AI_MODELS.find(
        (m) => m.modelId === defaultSpeedModel?.modelId,
      );
      const defaultSpeedModelLabel =
        defaultSpeedModelConfig?.label ||
        defaultSpeedModel?.modelId ||
        'Default';

      const defaultPerformanceModel =
        this.aiModelRegistryService.getDefaultPerformanceModel();
      const defaultPerformanceModelConfig = AI_MODELS.find(
        (m) => m.modelId === defaultPerformanceModel?.modelId,
      );
      const defaultPerformanceModelLabel =
        defaultPerformanceModelConfig?.label ||
        defaultPerformanceModel?.modelId ||
        'Default';

      aiModels.unshift(
        {
          modelId: DEFAULT_SMART_MODEL,
          label: `Smart (${defaultPerformanceModelLabel})`,
          provider: ModelProvider.NONE,
          inputCostPer1kTokensInCredits: 0,
          outputCostPer1kTokensInCredits: 0,
        },
        {
          modelId: DEFAULT_FAST_MODEL,
          label: `Fast (${defaultSpeedModelLabel})`,
          provider: ModelProvider.NONE,
          inputCostPer1kTokensInCredits: 0,
          outputCostPer1kTokensInCredits: 0,
        },
      );
    }

    const clientConfig: ClientConfig = {
      appVersion: this.clientvaultConfigService.get('APP_VERSION'),
      billing: {
        isBillingEnabled: this.clientvaultConfigService.get('IS_BILLING_ENABLED'),
        billingUrl: this.clientvaultConfigService.get('BILLING_PLAN_REQUIRED_LINK'),
        trialPeriods: [
          {
            duration: this.clientvaultConfigService.get(
              'BILLING_FREE_TRIAL_WITH_CREDIT_CARD_DURATION_IN_DAYS',
            ),
            isCreditCardRequired: true,
          },
          {
            duration: this.clientvaultConfigService.get(
              'BILLING_FREE_TRIAL_WITHOUT_CREDIT_CARD_DURATION_IN_DAYS',
            ),
            isCreditCardRequired: false,
          },
        ],
      },
      aiModels,
      authProviders: {
        google: this.clientvaultConfigService.get('AUTH_GOOGLE_ENABLED'),
        magicLink: false,
        password: this.clientvaultConfigService.get('AUTH_PASSWORD_ENABLED'),
        microsoft: this.clientvaultConfigService.get('AUTH_MICROSOFT_ENABLED'),
        sso: [],
      },
      signInPrefilled: this.clientvaultConfigService.get('SIGN_IN_PREFILLED'),
      isMultiWorkspaceEnabled: this.clientvaultConfigService.get(
        'IS_MULTIWORKSPACE_ENABLED',
      ),
      isEmailVerificationRequired: this.clientvaultConfigService.get(
        'IS_EMAIL_VERIFICATION_REQUIRED',
      ),
      defaultSubdomain: this.clientvaultConfigService.get('DEFAULT_SUBDOMAIN'),
      frontDomain: this.domainServerConfigService.getFrontUrl().hostname,
      support: {
        supportDriver: supportDriver ? supportDriver : SupportDriver.NONE,
        supportFrontChatId: this.clientvaultConfigService.get(
          'SUPPORT_FRONT_CHAT_ID',
        ),
      },
      sentry: {
        environment: this.clientvaultConfigService.get('SENTRY_ENVIRONMENT'),
        release: this.clientvaultConfigService.get('APP_VERSION'),
        dsn: this.clientvaultConfigService.get('SENTRY_FRONT_DSN'),
      },
      captcha: {
        provider: captchaProvider ? captchaProvider : undefined,
        siteKey: this.clientvaultConfigService.get('CAPTCHA_SITE_KEY'),
      },
      chromeExtensionId: this.clientvaultConfigService.get('CHROME_EXTENSION_ID'),
      api: {
        mutationMaximumAffectedRecords: this.clientvaultConfigService.get(
          'MUTATION_MAXIMUM_AFFECTED_RECORDS',
        ),
      },
      isAttachmentPreviewEnabled: this.clientvaultConfigService.get(
        'IS_ATTACHMENT_PREVIEW_ENABLED',
      ),
      analyticsEnabled: this.clientvaultConfigService.get('ANALYTICS_ENABLED'),
      canManageFeatureFlags:
        this.clientvaultConfigService.get('NODE_ENV') ===
          NodeEnvironment.DEVELOPMENT ||
        this.clientvaultConfigService.get('IS_BILLING_ENABLED'),
      publicFeatureFlags: PUBLIC_FEATURE_FLAGS,
      isMicrosoftMessagingEnabled: this.clientvaultConfigService.get(
        'MESSAGING_PROVIDER_MICROSOFT_ENABLED',
      ),
      isMicrosoftCalendarEnabled: this.clientvaultConfigService.get(
        'CALENDAR_PROVIDER_MICROSOFT_ENABLED',
      ),
      isGoogleMessagingEnabled: this.clientvaultConfigService.get(
        'MESSAGING_PROVIDER_GMAIL_ENABLED',
      ),
      isGoogleCalendarEnabled: this.clientvaultConfigService.get(
        'CALENDAR_PROVIDER_GOOGLE_ENABLED',
      ),
      isConfigVariablesInDbEnabled: this.clientvaultConfigService.get(
        'IS_CONFIG_VARIABLES_IN_DB_ENABLED',
      ),
      isImapSmtpCaldavEnabled: this.clientvaultConfigService.get(
        'IS_IMAP_SMTP_CALDAV_ENABLED',
      ),
      allowRequestsToClientVaultIcons: this.clientvaultConfigService.get(
        'ALLOW_REQUESTS_TO_CLIENTVAULT_ICONS',
      ),
      calendarBookingPageId: isNonEmptyString(calendarBookingPageId)
        ? calendarBookingPageId
        : undefined,
      isCloudflareIntegrationEnabled: this.isCloudflareIntegrationEnabled(),
      isClickHouseConfigured: !!this.clientvaultConfigService.get('CLICKHOUSE_URL'),
    };

    return clientConfig;
  }
}
