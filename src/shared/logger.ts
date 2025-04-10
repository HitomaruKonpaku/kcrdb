import { ConsoleLogger } from '@nestjs/common'

export class Logger extends ConsoleLogger {
  getTimestamp(): string {
    const d = new Date()
    const s = d.toISOString()
    return s
  }
}
