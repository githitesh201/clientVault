import { type StepFilter, type StepFilterGroup } from 'clientvault-shared/types';

export type FilterSettings = {
  stepFilterGroups?: StepFilterGroup[];
  stepFilters?: StepFilter[];
};
