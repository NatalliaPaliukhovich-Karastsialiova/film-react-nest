import { Module } from '@nestjs/common';
import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';
import { APP_LOGGER, loggerProvider } from './logger.provider';

@Module({
  providers: [DevLogger, JsonLogger, TskvLogger, loggerProvider],
  exports: [APP_LOGGER],
})
export class LoggerModule {}
