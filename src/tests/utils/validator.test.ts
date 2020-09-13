import { isRequest, isMessageRequest } from '../../utils/validator';

describe('should test isRequest', () => {
  test('should return false for missing properties', () => {
    expect(isRequest({})).toBeFalsy();
  });

  test('should return false for correct properties but wrong types', () => {
    const req = { id: 123 };
    expect(isRequest(req)).toBeFalsy();
  });

  test('should return true for correct payload', () => {
    const req = { id: '123' };
    expect(isRequest(req)).toBeTruthy();
  });
});

describe('should test isMessageRequest', () => {
  test('should return false for missing properties', () => {
    expect(isMessageRequest({})).toBeFalsy();
  });

  test('should return false for correct properties but wrong types', () => {
    const req = { id: 123, message: 'hello world!' };
    expect(isMessageRequest(req)).toBeFalsy();
  });

  test('should return true for correct payload', () => {
    const req = { id: '123', message: 'hello world!' };
    expect(isMessageRequest(req)).toBeTruthy();
  });
});
