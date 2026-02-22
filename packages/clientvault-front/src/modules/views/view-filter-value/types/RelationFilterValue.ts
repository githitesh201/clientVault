import { type jsonRelationFilterValueSchema } from 'clientvault-shared/utils';
import { type z } from 'zod';

export type RelationFilterValue = z.infer<typeof jsonRelationFilterValueSchema>;
