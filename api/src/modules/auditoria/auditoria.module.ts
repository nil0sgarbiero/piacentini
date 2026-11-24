import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auditoria } from './auditoria.entity.js';
import { AuditoriaService } from './auditoria.service.js';
import { AuditoriaController } from './auditoria.controller.js';
import { AuditoriaInterceptor } from './auditoria.interceptor.js';

@Module({
  imports: [TypeOrmModule.forFeature([Auditoria])],
  providers: [AuditoriaService, AuditoriaInterceptor],
  controllers: [AuditoriaController],
  exports: [AuditoriaService, AuditoriaInterceptor],
})
export class AuditoriaModule {}