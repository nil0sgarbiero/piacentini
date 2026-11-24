import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from '../seguranca/usuario.entity.js';
import { Perfil } from '../seguranca/perfil.entity.js';
import { UsuariosService } from './usuarios.service.js';
import { UsuariosController } from './usuarios.controller.js';

@Module({
  imports: [TypeOrmModule.forFeature([Usuario, Perfil])],
  providers: [UsuariosService],
  controllers: [UsuariosController],
})
export class UsuariosModule {}