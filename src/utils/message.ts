import { v4 as uuid } from 'uuid';

interface IMessage {
  id: string;
  admin: boolean;
  user: string | null;
  message: string;
  created: number;
}

export class Message {
  id: string;
  created: number;

  constructor() {
    this.id = uuid();
    this.created = this.getTimestamp();
  }

  new(user: string, message: string): IMessage {
    return {
      id: this.id,
      admin: false,
      user,
      message,
      created: this.created,
    };
  }

  userInactive(user: string): IMessage {
    return {
      id: this.id,
      admin: true,
      user: null,
      message: `${user} left the chat, connection lost`,
      created: this.created,
    };
  }

  userDisconnected(user: string): IMessage {
    return {
      id: this.id,
      admin: true,
      user: null,
      message: `${user} was disconnected due to inactivity`,
      created: this.created,
    };
  }

  private getTimestamp(): number {
    return new Date().getTime();
  }
}
