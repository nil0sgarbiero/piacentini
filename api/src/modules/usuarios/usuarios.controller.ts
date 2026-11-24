import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { Permissoes } from '../../common/decorators/permissoes.decorator.js';
import { UsuariosService } from './usuarios.service.js';
import { CriarUsuarioDto, AtualizarUsuarioDto } from './usuario.dto.js';

@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @Permissoes('listar_usuario')
  listar() {
    return this.usuariosService.listar();
  }

  @Get(':id')
  @Permissoes('listar_usuario')
  obter(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.obterPorId(id);
  }

  @Post()
  @Permissoes('novo_usuario')
  criar(@Body() dto: CriarUsuarioDto) {
    return this.usuariosService.criar(dto);
  }

  @Patch(':id')
  @Permissoes('editar_usuario')
  atualizar(@Param('id', ParseIntPipe) id: number, @Body() dto: AtualizarUsuarioDto) {
    return this.usuariosService.atualizar(id, dto);
  }

  @Delete(':id')
  @Permissoes('deletar_usuario')
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.usuariosService.remover(id);
  }
}