import { type ObjectRecord } from 'clientvault-shared/types';

export type PartialObjectRecordWithId = Partial<ObjectRecord> & { id: string };
