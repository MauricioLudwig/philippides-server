import { IUserTable } from '../utils/definitions';

class UserTable {
  users: IUserTable = {};

  add(socketId: string, name: string): void {
    this.users[name.toLowerCase()] = {
      socketId,
      name,
    };
  }

  remove(name: string): void {
    delete this.users[name];
  }
}

const userTable = new UserTable();
export { userTable };
