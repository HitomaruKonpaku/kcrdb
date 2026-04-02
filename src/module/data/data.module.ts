import { Global, Module } from '@nestjs/common'
import { DataService } from './service/data.service'

@Global()
@Module({
  providers: [
    DataService,
  ],
  exports: [
    DataService,
  ],
})
export class DataModule { }
