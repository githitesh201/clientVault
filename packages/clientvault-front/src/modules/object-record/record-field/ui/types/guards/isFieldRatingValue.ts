import { RATING_VALUES } from 'clientvault-shared/constants';
import { type FieldRatingValue } from 'clientvault-shared/types';

export const isFieldRatingValue = (
  fieldValue: unknown,
): fieldValue is FieldRatingValue =>
  RATING_VALUES.includes(fieldValue as NonNullable<FieldRatingValue>);
