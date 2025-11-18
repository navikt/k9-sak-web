import { action, type ActionOptions, type HandlerFunction } from 'storybook/actions';

export type AsyncHandlerFunction = (...args: Parameters<HandlerFunction>) => Promise<ReturnType<HandlerFunction>>;

/**
 * Kan brukast i storybook istadenfor standard action, når funksjonen ein skal erstatte er async.
 * Unngår med dette typescript klaging.
 */
export const asyncAction = (name: string, options: ActionOptions = {}): AsyncHandlerFunction => {
  const handler = action(name, options);
  return async (...args: Parameters<typeof handler>) => handler(...args);
};
