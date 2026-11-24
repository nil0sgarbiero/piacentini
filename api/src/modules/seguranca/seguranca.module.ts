import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './usuario.entity.js';
import { Perfil } from './perfil.entity.js';
import { Permissao } from './permissao.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Perfil, Permissao])],
  exports: [TypeOrmModule],
})
export class SegurancaModule {}