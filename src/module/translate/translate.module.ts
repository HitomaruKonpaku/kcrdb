import { Global, Module } from '@nestjs/common'
import { TranslateService } from './service/translate.service'

@Global()
@Module({
  providers: [
    TranslateService,
  ],
  exports: [
    TranslateService,
  ],
})
export class TranslateModule { }
