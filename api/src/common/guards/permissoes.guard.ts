import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PERMISSOES_KEY } from '../decorators/permissoes.decorator.js';
import { Perfil } from '../../modules/seguranca/perfil.entity.js';

@Injectable()
export class PermissoesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @InjectRepository(Perfil)
    private readonly perfilRepo: Repository<Perfil>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const exigidas = this.reflector.getAllAndOverride<string[]>(PERMISSOES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!exigidas || exigidas.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const perfis: string[] = request.user?.perfis ?? [];

    if (perfis.length === 0) {
      throw new ForbiddenException('Sem perfil atribuído');
    }

    const permissoes = await this.perfilRepo
      .createQueryBuilder('p')
      .innerJoin('seg_perfil_permissao', 'pp', 'pp.cod_perfil = p.cod_perfil')
      .innerJoin('seg_permissao', 'm', 'm.cod_permissao = pp.cod_permissao')
      .where('p.den_perfil IN (:...perfis)', { perfis })
      .select('m.des_permissao', 'permissao')
      .getRawMany<{ permissao: string }>();

    const conjunto = new Set(permissoes.map((p) => p.permissao));
    const autorizado = exigidas.some((e) => conjunto.has(e));

    if (!autorizado) {
      throw new ForbiddenException('Permissão insuficiente');
    }

    return true;
  }
}