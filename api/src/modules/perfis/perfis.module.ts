import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Perfil } from '../seguranca/perfil.entity.js';
import { Permissao } from '../seguranca/permissao.entity.js';
import { PerfisService } from './perfis.service.js';
import { PerfisController } from './perfis.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Perfil, Permissao])],
  providers: [PerfisService],
  controllers: [PerfisController],
})
export class PerfisModule {}