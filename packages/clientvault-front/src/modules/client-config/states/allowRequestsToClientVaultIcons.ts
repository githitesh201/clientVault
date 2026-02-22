import { createState } from '@/ui/utilities/state/utils/createState';

export const allowRequestsToClientVaultIconsState = createState<boolean>({
  key: 'allowRequestsToClientVaultIcons',
  defaultValue: true,
});
