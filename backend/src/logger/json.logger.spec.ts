import { JsonLogger } from './json.logger';

describe('JsonLogger', () => {
  let logger: JsonLogger;

  beforeEach(() => {
    logger = new JsonLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats message as JSON payload', () => {
    const formatted = logger.formatMessage('warn', 'сообщение', [
      { id: 1 },
      123,
    ]);
    const parsed = JSON.parse(formatted) as {
      time: string;
      level: string;
      message: string;
      optionalParams: string[];
    };

    expect(parsed.level).toBe('warn');
    expect(parsed.message).toBe('сообщение');
    expect(parsed.optionalParams).toEqual(['{"id":1}', '123']);
    expect(new Date(parsed.time).toString()).not.toBe('Invalid Date');
  });

  it('writes log level messages to console.log', () => {
    const logSpy = jest
      .spyOn(console, 'log')
      .mockImplementation(() => undefined);

    logger.log('привет', { поле: 'значение' });

    expect(logSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(logSpy.mock.calls[0][0] as string) as {
      level: string;
      message: string;
      optionalParams: string[];
    };
    expect(payload.level).toBe('log');
    expect(payload.message).toBe('привет');
    expect(payload.optionalParams).toEqual(['{"поле":"значение"}']);
  });

  it('writes error level messages to console.error', () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    logger.error('ошибка', 'трассировка');

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const payload = JSON.parse(errorSpy.mock.calls[0][0] as string) as {
      level: string;
      message: string;
      optionalParams: string[];
    };
    expect(payload.level).toBe('error');
    expect(payload.message).toBe('ошибка');
    expect(payload.optionalParams).toEqual(['трассировка']);
  });
});
