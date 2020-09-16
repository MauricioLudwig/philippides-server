import { v4 as uuid } from 'uuid';
import { IUser, IUserTable } from '../utils/definitions';

class UserTable {
  users: IUserTable = {};

  add(name: string): IUser {
    const id = uuid();
    this.users[id] = {
      id,
      name,
      socketId: null,
    };

    return this.users[id];
  }

  remove(socketId: string): string {
    const user = Object.values(this.users).find((o) => o.socketId === socketId);

    if (!user?.id) {
      throw new Error(`User not found.`);
    }

    const { name } = user;
    delete this.users[user.id];
    return name;
  }

  exists(userId: string): boolean {
    return !!this.users[userId];
  }

  isAvailable(name: string): boolean {
    return !Object.values(this.users).some(
      (o) => o.name.toLowerCase() === name.toLowerCase()
    );
  }

  addSocketId(userId: string, socketId: string): IUser {
    const user = this.users[userId];
    user.socketId = socketId;
    console.log('user', user);
    return user;
  }

  get activeUsers(): string[] {
    return Object.values(this.users)
      .map((o) => o.name)
      .sort();
  }
}

const userTable = new UserTable();
export { userTable };
