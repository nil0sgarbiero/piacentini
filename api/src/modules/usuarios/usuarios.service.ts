import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../seguranca/usuario.entity.js';
import { Perfil } from '../seguranca/perfil.entity.js';
import { CriarUsuarioDto, AtualizarUsuarioDto } from './usuario.dto.js';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    @InjectRepository(Perfil)
    private readonly perfilRepo: Repository<Perfil>,
  ) {}

  async listar(): Promise<Omit<Usuario, 'desSenhaHash'>[]> {
    const usuarios = await this.usuarioRepo.find({
      relations: { perfis: true },
      order: { codUsuario: 'ASC' },
    });
    return usuarios.map(({ desSenhaHash, ...resto }) => resto);
  }

  async obterPorId(codUsuario: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { codUsuario },
      relations: { perfis: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const { desSenhaHash, ...resto } = usuario;
    return resto;
  }

  async criar(dto: CriarUsuarioDto) {
    const existe = await this.usuarioRepo.findOne({
      where: { desLogin: dto.desLogin },
    });

    if (existe) {
      throw new ConflictException('Login já cadastrado');
    }

    const perfis = await this.perfilRepo.find({
      where: { codPerfil: In(dto.codPerfis) },
    });

    if (perfis.length !== dto.codPerfis.length) {
      throw new BadRequestException('Perfil inválido informado');
    }

    const usuario = this.usuarioRepo.create({
      nomUsuario: dto.nomUsuario,
      desLogin: dto.desLogin,
      desEmail: dto.desEmail ?? null,
      desSenhaHash: await bcrypt.hash(dto.senha, 10),
      indAtivo: 'S',
      indTrocaSenha: 'S',
      perfis,
    });

    const salvo = await this.usuarioRepo.save(usuario);
    const { desSenhaHash, ...resto } = salvo;
    return resto;
  }

  async atualizar(codUsuario: number, dto: AtualizarUsuarioDto) {
    const usuario = await this.usuarioRepo.findOne({
      where: { codUsuario },
      relations: { perfis: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (dto.nomUsuario !== undefined) usuario.nomUsuario = dto.nomUsuario;
    if (dto.desLogin !== undefined) usuario.desLogin = dto.desLogin;
    if (dto.desEmail !== undefined) usuario.desEmail = dto.desEmail;
    if (dto.indAtivo !== undefined) usuario.indAtivo = dto.indAtivo;

    if (dto.senha) {
      usuario.desSenhaHash = await bcrypt.hash(dto.senha, 10);
      usuario.indTrocaSenha = 'S';
    }

    if (dto.codPerfis) {
      const perfis = await this.perfilRepo.find({
        where: { codPerfil: In(dto.codPerfis) },
      });

      if (perfis.length !== dto.codPerfis.length) {
        throw new BadRequestException('Perfil inválido informado');
      }

      usuario.perfis = perfis;
    }

    const salvo = await this.usuarioRepo.save(usuario);
    const { desSenhaHash, ...resto } = salvo;
    return resto;
  }

  async remover(codUsuario: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { codUsuario },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    if (usuario.desLogin === 'admin') {
      throw new BadRequestException('Não é possível excluir o usuário admin');
    }

    await this.usuarioRepo.remove(usuario);
    return { mensagem: 'Usuário excluído' };
  }

}