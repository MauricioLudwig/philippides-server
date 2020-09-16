/**
 * * Type guards to ensure valid request data at runtime
 */

import { IRequest, IMessageRequest } from './definitions';

export const isRequest = (req: any): req is IRequest => {
  return typeof req?.id === 'string';
};

export const isMessageRequest = (req: any): req is IMessageRequest => {
  return typeof req?.id === 'string' && typeof req?.message === 'string';
};
