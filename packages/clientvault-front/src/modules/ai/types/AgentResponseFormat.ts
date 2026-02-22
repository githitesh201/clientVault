import { type BaseOutputSchemaV2 } from 'clientvault-shared/workflow';

export type AgentResponseFormat =
  | { type: 'text' }
  | {
      type: 'json';
      schema: BaseOutputSchemaV2;
    };
