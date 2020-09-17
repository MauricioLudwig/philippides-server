/**
 * * User-Defined Type Guards to ensure valid data at runtime
 */

import { IRequest, IMessageRequest } from './definitions';

export const isRequest = (req: any): req is IRequest => {
  return isValidString(req?.id);
};

export const isMessageRequest = (req: any): req is IMessageRequest => {
  return isValidString(req?.id) && isValidString(req?.text);
};

export const isValidString = (req: unknown): req is string => {
  return typeof req === 'string' && req.length > 0;
};
