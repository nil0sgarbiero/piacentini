import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auditoria } from './auditoria.entity.js';

export interface RegistroAuditoria {
  codUsuario: number | null;
  desLogin: string | null;
  desAcao: string;
  desRecurso: string;
  desMetodo: string;
  desRota: string;
  desIp: string | null;
  desUserAgent: string | null;
  desPayload: any;
  numStatus: number | null;
}

export interface FiltroAuditoria {
  codUsuario?: number;
  desRecurso?: string;
  desAcao?: string;
  datInicio?: string;
  datFim?: string;
  pagina?: number;
  limite?: number;
}

@Injectable()
export class AuditoriaService {
  private readonly logger = new Logger(AuditoriaService.name);

  constructor(
    @InjectRepository(Auditoria)
    private readonly auditoriaRepo: Repository<Auditoria>,
  ) {}

  async registrar(dados: RegistroAuditoria): Promise<void> {
    try {
      const registro = this.auditoriaRepo.create({
        codUsuario: dados.codUsuario,
        desLogin: dados.desLogin,
        desAcao: dados.desAcao,
        desRecurso: dados.desRecurso,
        desMetodo: dados.desMetodo,
        desRota: dados.desRota,
        desIp: dados.desIp,
        desUserAgent: dados.desUserAgent?.slice(0, 255) ?? null,
        desPayload: dados.desPayload,
        numStatus: dados.numStatus,
      });

      await this.auditoriaRepo.save(registro);
    } catch (err) {
      this.logger.warn(`Falha ao gravar auditoria: ${(err as Error).message}`);
    }
  }

  async listar(filtro: FiltroAuditoria) {
    const pagina = Math.max(1, Number(filtro.pagina) || 1);
    const limite = Math.min(200, Math.max(1, Number(filtro.limite) || 50));

    const qb = this.auditoriaRepo
      .createQueryBuilder('a')
      .orderBy('a.datEvento', 'DESC')
      .skip((pagina - 1) * limite)
      .take(limite);

    if (filtro.codUsuario) {
      qb.andWhere('a.codUsuario = :codUsuario', { codUsuario: filtro.codUsuario });
    }

    if (filtro.desRecurso) {
      qb.andWhere('a.desRecurso ILIKE :recurso', { recurso: `%${filtro.desRecurso}%` });
    }

    if (filtro.desAcao) {
      qb.andWhere('a.desAcao = :acao', { acao: filtro.desAcao.toUpperCase() });
    }

    if (filtro.datInicio) {
      qb.andWhere('a.datEvento >= :datInicio', { datInicio: filtro.datInicio });
    }

    if (filtro.datFim) {
      qb.andWhere('a.datEvento <= :datFim', { datFim: filtro.datFim });
    }

    const [registros, total] = await qb.getManyAndCount();

    return {
      total,
      pagina,
      limite,
      paginas: Math.ceil(total / limite),
      registros,
    };
  }

  async limparAntigos(dias: number) {
    const resultado = await this.auditoriaRepo
      .createQueryBuilder()
      .delete()
      .from(Auditoria)
      .where(`dat_evento < now() - interval '${Number(dias)} days'`)
      .execute();

    return {
      mensagem: `Registros com mais de ${dias} dias removidos`,
      removidos: resultado.affected ?? 0,
    };
  }
}