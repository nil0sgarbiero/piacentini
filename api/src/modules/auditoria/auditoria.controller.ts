import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Permissoes } from '../../common/decorators/permissoes.decorator.js';
import { AuditoriaService } from './auditoria.service.js';

@Controller('auditoria')
export class AuditoriaController {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  @Get()
  @Permissoes('listar_auditoria')
  listar(
    @Query('codUsuario') codUsuario?: string,
    @Query('desRecurso') desRecurso?: string,
    @Query('desAcao') desAcao?: string,
    @Query('datInicio') datInicio?: string,
    @Query('datFim') datFim?: string,
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
  ) {
    return this.auditoriaService.listar({
      codUsuario: codUsuario ? Number(codUsuario) : undefined,
      desRecurso,
      desAcao,
      datInicio,
      datFim,
      pagina: pagina ? Number(pagina) : undefined,
      limite: limite ? Number(limite) : undefined,
    });
  }

  @Delete('limpar/:dias')
  @Permissoes('deletar_auditoria')
  limpar(@Param('dias', ParseIntPipe) dias: number) {
    return this.auditoriaService.limparAntigos(dias);
  }
}