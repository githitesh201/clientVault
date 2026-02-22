/* @license Enterprise */

import { Injectable } from '@nestjs/common';

import { isDefined } from 'clientvault-shared/utils';

import { OnCustomBatchEvent } from 'src/engine/api/graphql/graphql-query-runner/decorators/on-custom-batch-event.decorator';
import { BILLING_FEATURE_USED } from 'src/engine/core-modules/billing/constants/billing-feature-used.constant';
import { BillingUsageService } from 'src/engine/core-modules/billing/services/billing-usage.service';
import { type BillingUsageEvent } from 'src/engine/core-modules/billing/types/billing-usage-event.type';
import { ClientVaultConfigService } from 'src/engine/core-modules/clientvault-config/clientvault-config.service';
import { CustomWorkspaceEventBatch } from 'src/engine/workspace-event-emitter/types/custom-workspace-batch-event.type';

@Injectable()
export class BillingFeatureUsedListener {
  constructor(
    private readonly billingUsageService: BillingUsageService,
    private readonly clientvaultConfigService: ClientVaultConfigService,
  ) {}

  @OnCustomBatchEvent(BILLING_FEATURE_USED)
  async handleBillingFeatureUsedEvent(
    payload: CustomWorkspaceEventBatch<BillingUsageEvent>,
  ) {
    if (!isDefined(payload.workspaceId)) {
      return;
    }

    if (!this.clientvaultConfigService.get('IS_BILLING_ENABLED')) {
      return;
    }

    const canFeatureBeUsed = await this.billingUsageService.canFeatureBeUsed(
      payload.workspaceId,
    );

    if (!canFeatureBeUsed) {
      return;
    }

    await this.billingUsageService.billUsage({
      workspaceId: payload.workspaceId,
      billingEvents: payload.events,
    });
  }
}
