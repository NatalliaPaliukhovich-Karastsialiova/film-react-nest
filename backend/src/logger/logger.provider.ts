import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerService } from '@nestjs/common';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export const APP_LOGGER = 'APP_LOGGER';

export const loggerProvider: Provider = {
  provide: APP_LOGGER,
  inject: [ConfigService, DevLogger, JsonLogger, TskvLogger],
  useFactory: (
    configService: ConfigService,
    devLogger: DevLogger,
    jsonLogger: JsonLogger,
    tskvLogger: TskvLogger,
  ): LoggerService => {
    const loggerType = configService.get<string>('LOGGER_TYPE', 'dev');

    switch (loggerType) {
      case 'json':
        return jsonLogger;
      case 'tskv':
        return tskvLogger;
      case 'dev':
      default:
        return devLogger;
    }
  },
};
