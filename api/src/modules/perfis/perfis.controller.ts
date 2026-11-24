import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { Permissoes } from '../../common/decorators/permissoes.decorator.js';
import { PerfisService } from './perfis.service.js';
import {
  CriarPerfilDto,
  AtualizarPerfilDto,
  DefinirPermissoesDto,
} from './perfil.dto.js';

@Controller('perfis')
export class PerfisController {
  constructor(private readonly perfisService: PerfisService) {}

  @Get()
  @Permissoes('listar_perfil')
  listar() {
    return this.perfisService.listar();
  }

  @Get('permissoes')
  @Permissoes('listar_perfil')
  listarPermissoes() {
    return this.perfisService.listarPermissoes();
  }

  @Get(':id')
  @Permissoes('listar_perfil')
  obter(@Param('id', ParseIntPipe) id: number) {
    return this.perfisService.obterPorId(id);
  }

  @Post()
  @Permissoes('novo_perfil')
  criar(@Body() dto: CriarPerfilDto) {
    return this.perfisService.criar(dto);
  }

  @Patch(':id')
  @Permissoes('editar_perfil')
  atualizar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AtualizarPerfilDto,
  ) {
    return this.perfisService.atualizar(id, dto);
  }

  @Put(':id/permissoes')
  @Permissoes('editar_perfil')
  definirPermissoes(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: DefinirPermissoesDto,
  ) {
    return this.perfisService.definirPermissoes(id, dto);
  }

  @Delete(':id')
  @Permissoes('deletar_perfil')
  remover(@Param('id', ParseIntPipe) id: number) {
    return this.perfisService.remover(id);
  }
}