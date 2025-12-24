import { ConsoleLogger, LogLevel } from '@nestjs/common'
import { DateTime } from 'luxon'

export class Logger extends ConsoleLogger {
  protected formatPid(): string {
    return ''
  }

  protected formatMessage(logLevel: LogLevel, message: unknown, pidMessage: string, formattedLogLevel: string, contextMessage: string, timestampDiff: string): string {
    const msg = super.formatMessage(logLevel, message, pidMessage, formattedLogLevel, contextMessage, timestampDiff)
    if (process.env.NO_TIMESTAMP) {
      const regex = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3}){0,1}Z /g
      return msg.replace(regex, '')
    }
    return msg
  }

  getTimestamp(): string {
    return DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss.SSS Z')
  }
}
