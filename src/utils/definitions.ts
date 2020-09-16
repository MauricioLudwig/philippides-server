/**
 * * All type definitions
 */

export interface IUserTable {
  [key: string]: {
    socketId: string;
    name: string;
  };
}

export interface IMessage {
  id: string;
  admin: boolean;
  user: string | null;
  text: string;
  created: number;
}

export interface IRequest {
  id: string;
}

export interface IMessageRequest extends IRequest {
  text: string;
}

export enum SocketType {
  NewMessage = 'new-message',
  UserConnected = 'user-connected',
  UserDisconnected = 'user-disconnected',
  UserInactive = 'user-inactive',
}
