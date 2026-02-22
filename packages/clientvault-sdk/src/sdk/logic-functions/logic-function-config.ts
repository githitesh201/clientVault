import { type LogicFunctionManifest } from 'clientvault-shared/application';
import { type InputJsonSchema } from 'clientvault-shared/logic-function';

export type LogicFunctionHandler = (...args: any[]) => any | Promise<any>;

export type LogicFunctionConfig = Omit<
  LogicFunctionManifest,
  | 'sourceHandlerPath'
  | 'builtHandlerPath'
  | 'builtHandlerChecksum'
  | 'handlerName'
  | 'toolInputSchema'
> & {
  handler: LogicFunctionHandler;
  toolInputSchema?: InputJsonSchema;
};
