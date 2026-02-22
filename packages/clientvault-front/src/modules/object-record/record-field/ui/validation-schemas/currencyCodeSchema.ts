import { z } from 'zod';

import { CurrencyCode } from 'clientvault-shared/constants';

export const currencyCodeSchema = z.enum(CurrencyCode);
