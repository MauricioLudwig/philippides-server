// all Type Definitions

export interface IUserTable {
  [key: string]: string;
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
  UserDisconnected = 'user-disconnected',
  UserInactive = 'user-inactive',
}
