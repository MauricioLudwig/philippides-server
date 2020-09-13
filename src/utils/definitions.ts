// all Type Definitions

export interface IUser {
  name: string;
}

export interface IMessage {
  id: string;
  admin: boolean;
  user: string | null;
  message: string;
  created: number;
}

export interface IRequest {
  id: string;
}

export interface IMessageRequest extends IRequest {
  message: string;
}

export enum SocketType {
  NewMessage = 'new-message',
}
