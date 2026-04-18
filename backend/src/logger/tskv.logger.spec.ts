import { TskvLogger } from './tskv.logger';

type TskvRecord = Record<string, string>;

const parseTskv = (line: string): TskvRecord => {
  return line.split('\t').reduce<TskvRecord>((acc, pair) => {
    const separatorIndex = pair.indexOf('=');
    const key = pair.slice(0, separatorIndex);
    const value = pair.slice(separatorIndex + 1);
    acc[key] = value;
    return acc;
  }, {});
};

describe('TskvLogger', () => {
  let logger: TskvLogger;

  beforeEach(() => {
    logger = new TskvLogger();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('formats message as TSKV payload', () => {
    const formatted = logger.formatMessage('debug', 'привет\tмир', [{ строка: 'раз\nдва' }, 7]);
    const record = parseTskv(formatted);

    expect(record.level).toBe('debug');
    expect(record.message).toBe('привет\\tмир');
    expect(record.optionalParam0).toBe('{"строка":"раз\\\\nдва"}');
    expect(record.optionalParam1).toBe('7');
    expect(new Date(record.time).toString()).not.toBe('Invalid Date');
  });

  it('writes warning messages to console.warn', () => {
    const warnSpy = jest
      .spyOn(console, 'warn')
      .mockImplementation(() => undefined);

    logger.warn('внимание', 'контекст');

    expect(warnSpy).toHaveBeenCalledTimes(1);
    const payload = parseTskv(warnSpy.mock.calls[0][0] as string);
    expect(payload.level).toBe('warn');
    expect(payload.message).toBe('внимание');
    expect(payload.optionalParam0).toBe('контекст');
  });

  it('writes error messages to console.error', () => {
    const errorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    logger.error('сбой', 'стек');

    expect(errorSpy).toHaveBeenCalledTimes(1);
    const payload = parseTskv(errorSpy.mock.calls[0][0] as string);
    expect(payload.level).toBe('error');
    expect(payload.message).toBe('сбой');
    expect(payload.optionalParam0).toBe('стек');
  });
});
