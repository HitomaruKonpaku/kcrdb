import { Global, Module } from '@nestjs/common'
import { AdminController } from './controller/admin.controller'
import { AdminService } from './service/admin.service'

@Global()
@Module({
  controllers: [
    AdminController,
  ],
  providers: [
    AdminService,
  ],
  exports: [
    AdminService,
  ],
})
export class AdminModule { }
