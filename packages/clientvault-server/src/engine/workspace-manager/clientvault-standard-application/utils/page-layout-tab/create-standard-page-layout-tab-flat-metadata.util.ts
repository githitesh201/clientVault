import { type PageLayoutTabLayoutMode } from 'clientvault-shared/types';
import { isDefined } from 'clientvault-shared/utils';

import { type FlatPageLayoutTab } from 'src/engine/metadata-modules/flat-page-layout-tab/types/flat-page-layout-tab.type';
import { STANDARD_PAGE_LAYOUTS } from 'src/engine/workspace-manager/clientvault-standard-application/constants/standard-page-layout.constant';
import { CLIENTVAULT_STANDARD_APPLICATION } from 'src/engine/workspace-manager/clientvault-standard-application/constants/clientvault-standard-applications';
import { type StandardPageLayoutMetadataRelatedEntityIds } from 'src/engine/workspace-manager/clientvault-standard-application/utils/get-standard-page-layout-metadata-related-entity-ids.util';
import { type StandardPageLayoutTabConfig } from 'src/engine/workspace-manager/clientvault-standard-application/utils/page-layout-config';

export type CreateStandardPageLayoutTabContext = {
  layoutName: string;
  tabTitle: string;
  title: string;
  position: number;
  icon: string | null;
  layoutMode: PageLayoutTabLayoutMode;
};

export type CreateStandardPageLayoutTabArgs = {
  now: string;
  workspaceId: string;
  clientvaultStandardApplicationId: string;
  standardPageLayoutMetadataRelatedEntityIds: StandardPageLayoutMetadataRelatedEntityIds;
  context: CreateStandardPageLayoutTabContext;
};

export const createStandardPageLayoutTabFlatMetadata = ({
  context: { layoutName, tabTitle, title, position, icon, layoutMode },
  workspaceId,
  clientvaultStandardApplicationId,
  standardPageLayoutMetadataRelatedEntityIds,
  now,
}: CreateStandardPageLayoutTabArgs): FlatPageLayoutTab => {
  const layoutIds = standardPageLayoutMetadataRelatedEntityIds[layoutName];
  const layout = STANDARD_PAGE_LAYOUTS[
    layoutName as keyof typeof STANDARD_PAGE_LAYOUTS
  ] as {
    universalIdentifier: string;
    tabs: Record<
      string,
      StandardPageLayoutTabConfig & {
        widgets: Record<string, { universalIdentifier: string }>;
      }
    >;
  };
  const tabDefinition = layout.tabs[tabTitle];

  if (!isDefined(tabDefinition)) {
    throw new Error(`Invalid configuration ${layoutName} ${tabTitle}`);
  }

  const tabIds = layoutIds.tabs[tabTitle];
  const widgetIds = Object.values(tabIds.widgets).map((widget) => widget.id);
  const widgetUniversalIdentifiers = Object.values(tabDefinition.widgets).map(
    (widget) => widget.universalIdentifier,
  );

  return {
    id: tabIds.id,
    universalIdentifier: tabDefinition.universalIdentifier,
    applicationId: clientvaultStandardApplicationId,
    applicationUniversalIdentifier:
      CLIENTVAULT_STANDARD_APPLICATION.universalIdentifier,
    workspaceId,
    title,
    position,
    pageLayoutId: layoutIds.id,
    pageLayoutUniversalIdentifier: layout.universalIdentifier,
    widgetIds,
    widgetUniversalIdentifiers,
    createdAt: now,
    updatedAt: now,
    deletedAt: null,
    icon,
    layoutMode,
  };
};
