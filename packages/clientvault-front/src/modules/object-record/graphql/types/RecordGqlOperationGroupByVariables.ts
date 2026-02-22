import {
  type RecordGqlOperationFilter,
  type RecordGqlOperationOrderBy,
} from 'clientvault-shared/types';

export type RecordGqlOperationGroupByVariables = {
  groupBy: Record<string, any>[] | Record<string, any>;
  filter?: RecordGqlOperationFilter;
  orderBy?: Record<string, any>[];
  orderByForRecords?: RecordGqlOperationOrderBy;
  viewId?: string;
};
