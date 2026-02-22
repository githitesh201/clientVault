import { type AgentResponseSchema } from 'clientvault-shared/ai';

export type AgentResponseFormatType = AgentResponseFormat['type'];

export type AgentTextResponseFormat = { type: 'text' };
export type AgentJsonResponseFormat = {
  type: 'json';
  schema: AgentResponseSchema;
};
export type AgentResponseFormat =
  | AgentTextResponseFormat
  | AgentJsonResponseFormat;
