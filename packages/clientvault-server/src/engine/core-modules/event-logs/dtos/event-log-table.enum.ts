import { registerEnumType } from '@nestjs/graphql';

import { EventLogTable } from 'clientvault-shared/types';

export const registerEventLogTableEnum = () => {
  registerEnumType(EventLogTable, {
    name: 'EventLogTable',
  });
};

export { EventLogTable };
