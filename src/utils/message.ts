import { v4 as uuid } from 'uuid';
import { IMessage } from './definitions';

export class Message {
  id: string;
  created: number;

  constructor() {
    this.id = uuid();
    this.created = this.getTimestamp();
  }

  new(user: string, text: string): IMessage {
    return {
      id: this.id,
      admin: false,
      user,
      text,
      created: this.created,
    };
  }

  userConnected(): IMessage {
    return {
      id: this.id,
      admin: true,
      user: null,
      text: `Damien connected to the chat. Say hello!`,
      created: this.created,
    };
  }

  userInactive(user: string): IMessage {
    return {
      id: this.id,
      admin: true,
      user: null,
      text: `${user} left the chat, connection lost`,
      created: this.created,
    };
  }

  userDisconnected(user: string): IMessage {
    return {
      id: this.id,
      admin: true,
      user: null,
      text: `${user} was disconnected due to inactivity`,
      created: this.created,
    };
  }

  private getTimestamp(): number {
    return new Date().getTime();
  }
}
