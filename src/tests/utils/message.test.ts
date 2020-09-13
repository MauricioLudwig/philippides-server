import { Message } from '../../utils/message';

describe('test message generation', () => {
  let message: Message;
  let arrange = {};

  beforeEach(() => {
    message = new Message();
    arrange = {
      id: message.id,
      created: message.created,
    };
  });

  test('should generate new message', () => {
    const msg = message.new('Mauricio', 'This is my new message');

    expect(msg).toEqual({
      ...arrange,
      admin: false,
      user: 'Mauricio',
      message: 'This is my new message',
    });
  });

  test('should generate user inactive message', () => {
    const msg = message.userInactive('Damien');

    expect(msg).toEqual({
      ...arrange,
      admin: true,
      user: null,
      message: 'Damien left the chat, connection lost',
    });
  });

  test('should generate user disconnected message', () => {
    const msg = message.userDisconnected('Kafka');

    expect(msg).toEqual({
      ...arrange,
      admin: true,
      user: null,
      message: 'Kafka was disconnected due to inactivity',
    });
  });
});
