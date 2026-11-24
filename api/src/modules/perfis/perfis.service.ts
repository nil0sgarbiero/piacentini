import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Perfil } from '../seguranca/perfil.entity.js';
import { Permissao } from '../seguranca/permissao.entity.js';
import {
  CriarPerfilDto,
  AtualizarPerfilDto,
  DefinirPermissoesDto,
} from './perfil.dto.js';

@Injectable()
export class PerfisService {
  constructor(
    @InjectRepository(Perfil)
    private readonly perfilRepo: Repository<Perfil>,
    @InjectRepository(Permissao)
    private readonly permissaoRepo: Repository<Permissao>,
  ) {}

  async listar() {
    const perfis = await this.perfilRepo
      .createQueryBuilder('p')
      .leftJoin('seg_perfil_permissao', 'pp', 'pp.cod_perfil = p.cod_perfil')
      .leftJoin('seg_permissao', 'm', 'm.cod_permissao = pp.cod_permissao')
      .select([
        'p.cod_perfil AS cod_perfil',
        'p.den_perfil AS den_perfil',
        'p.des_perfil AS des_perfil',
        'p.ind_ativo AS ind_ativo',
        'COUNT(m.cod_permissao) AS qtd_permissoes',
      ])
      .groupBy('p.cod_perfil')
      .addGroupBy('p.den_perfil')
      .addGroupBy('p.des_perfil')
      .addGroupBy('p.ind_ativo')
      .orderBy('p.den_perfil', 'ASC')
      .getRawMany();

    return perfis.map((p) => ({
      codPerfil: Number(p.cod_perfil),
      denPerfil: p.den_perfil,
      desPerfil: p.des_perfil,
      indAtivo: p.ind_ativo,
      qtdPermissoes: Number(p.qtd_permissoes),
    }));
  }

  async obterPorId(codPerfil: number) {
    const perfil = await this.perfilRepo.findOne({
      where: { codPerfil },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const permissoes = await this.permissaoRepo
      .createQueryBuilder('m')
      .innerJoin('seg_perfil_permissao', 'pp', 'pp.cod_permissao = m.cod_permissao')
      .where('pp.cod_perfil = :codPerfil', { codPerfil })
      .orderBy('m.des_permissao', 'ASC')
      .getMany();

    return { ...perfil, permissoes };
  }

  async criar(dto: CriarPerfilDto) {
    const existe = await this.perfilRepo.findOne({
      where: { denPerfil: dto.denPerfil },
    });

    if (existe) {
      throw new ConflictException('Já existe um perfil com esse nome');
    }

    const perfil = this.perfilRepo.create({
      denPerfil: dto.denPerfil.toUpperCase(),
      desPerfil: dto.desPerfil ?? null,
      indAtivo: 'S',
    });

    const salvo = await this.perfilRepo.save(perfil);

    if (dto.codPermissoes?.length) {
      await this.definirPermissoes(salvo.codPerfil, {
        codPermissoes: dto.codPermissoes,
      });
    }

    return this.obterPorId(salvo.codPerfil);
  }

  async atualizar(codPerfil: number, dto: AtualizarPerfilDto) {
    const perfil = await this.perfilRepo.findOne({
      where: { codPerfil },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado');
    }

    if (dto.denPerfil !== undefined) {
      perfil.denPerfil = dto.denPerfil.toUpperCase();
    }
    if (dto.desPerfil !== undefined) perfil.desPerfil = dto.desPerfil;
    if (dto.indAtivo !== undefined) perfil.indAtivo = dto.indAtivo;

    await this.perfilRepo.save(perfil);
    return this.obterPorId(codPerfil);
  }

  async remover(codPerfil: number) {
    const perfil = await this.perfilRepo.findOne({
      where: { codPerfil },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado');
    }

    if (perfil.denPerfil === 'ADMIN') {
      throw new BadRequestException('Não é possível excluir o perfil ADMIN');
    }

    const emUso = await this.perfilRepo.manager.query(
      'SELECT 1 FROM seg_usuario_perfil WHERE cod_perfil = $1 LIMIT 1',
      [codPerfil],
    );

    if (emUso.length > 0) {
      throw new BadRequestException(
        'Perfil está vinculado a usuários e não pode ser excluído',
      );
    }

    await this.perfilRepo.remove(perfil);
    return { mensagem: 'Perfil excluído' };
  }

  async listarPermissoes() {
    return this.permissaoRepo.find({ order: { desPermissao: 'ASC' } });
  }

  async definirPermissoes(codPerfil: number, dto: DefinirPermissoesDto) {
    const perfil = await this.perfilRepo.findOne({
      where: { codPerfil },
    });

    if (!perfil) {
      throw new NotFoundException('Perfil não encontrado');
    }

    const permissoes = await this.permissaoRepo.find({
      where: { codPermissao: In(dto.codPermissoes) },
    });

    if (permissoes.length !== dto.codPermissoes.length) {
      throw new BadRequestException('Permissão inválida informada');
    }

    if (perfil.denPerfil === 'ADMIN' && permissoes.length === 0) {
      throw new BadRequestException(
        'O perfil ADMIN não pode ficar sem permissões',
      );
    }

    await this.perfilRepo.manager.transaction(async (manager) => {
      await manager.query(
        'DELETE FROM seg_perfil_permissao WHERE cod_perfil = $1',
        [codPerfil],
      );

      for (const p of permissoes) {
        await manager.query(
          'INSERT INTO seg_perfil_permissao (cod_perfil, cod_permissao) VALUES ($1, $2)',
          [codPerfil, p.codPermissao],
        );
      }
    });

    return this.obterPorId(codPerfil);
  }
}