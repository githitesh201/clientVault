import {
  type ObjectRecordGroupByDateGranularity,
  type FirstDayOfTheWeek,
} from 'clientvault-shared/types';

export type DateFieldGroupByDefinition = {
  granularity: ObjectRecordGroupByDateGranularity;
  weekStartDay?: FirstDayOfTheWeek;
  timeZone?: string;
};
