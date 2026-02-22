import { createState } from '@/ui/utilities/state/utils/createState';
import {
  type MetadataGqlOperationSignature,
  type RecordGqlOperationSignature,
} from 'clientvault-shared/types';

export const activeQueryListenersState = createState<
  {
    queryId: string;
    operationSignature:
      | RecordGqlOperationSignature
      | MetadataGqlOperationSignature;
  }[]
>({
  key: 'activeQueryListenersState',
  defaultValue: [],
});
