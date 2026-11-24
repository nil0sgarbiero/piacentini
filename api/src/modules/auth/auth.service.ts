import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomBytes } from 'node:crypto';
import { TrocarSenhaDto } from './senha.dto.js';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Usuario } from '../seguranca/usuario.entity.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
    private readonly jwtService: JwtService,
  ) {}

  async login(desLogin: string, senha: string) {
    const usuario = await this.usuarioRepo
      .createQueryBuilder('u')
      .addSelect('u.desSenhaHash')
      .leftJoinAndSelect('u.perfis', 'p')
      .where('u.desLogin = :login', { login: desLogin })
      .getOne();

    if (!usuario || usuario.indAtivo !== 'S') {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaOk = await bcrypt.compare(senha, usuario.desSenhaHash);
    if (!senhaOk) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const payload = {
      sub: usuario.codUsuario,
      login: usuario.desLogin,
      perfis: usuario.perfis?.map((p) => p.denPerfil) ?? [],
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        codUsuario: usuario.codUsuario,
        nomUsuario: usuario.nomUsuario,
        indTrocaSenha: usuario.indTrocaSenha,
      },
    };
    
  }
  async trocarSenha(codUsuario: number, dto: TrocarSenhaDto) {
    const usuario = await this.usuarioRepo
      .createQueryBuilder('u')
      .addSelect('u.desSenhaHash')
      .where('u.codUsuario = :codUsuario', { codUsuario })
      .getOne();

    if (!usuario) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    const senhaOk = await bcrypt.compare(dto.senhaAtual, usuario.desSenhaHash);
    if (!senhaOk) {
      throw new BadRequestException('Senha atual incorreta');
    }

    if (dto.senhaAtual === dto.novaSenha) {
      throw new BadRequestException(
        'A nova senha deve ser diferente da senha atual',
      );
    }

    usuario.desSenhaHash = await bcrypt.hash(dto.novaSenha, 10);
    usuario.indTrocaSenha = 'N';
    usuario.numTentativas = 0;
    usuario.datBloqueio = null;
    usuario.datAlteracao = new Date();

    await this.usuarioRepo.save(usuario);

    return { mensagem: 'Senha alterada com sucesso' };
  }

  async resetarSenha(codUsuario: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { codUsuario },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const senhaProvisoria = randomBytes(6)
      .toString('base64url')
      .slice(0, 10);

    usuario.desSenhaHash = await bcrypt.hash(senhaProvisoria, 10);
    usuario.indTrocaSenha = 'S';
    usuario.numTentativas = 0;
    usuario.datBloqueio = null;
    usuario.datAlteracao = new Date();

    await this.usuarioRepo.save(usuario);

    return {
      mensagem: 'Senha resetada. Informe a senha provisória ao usuário.',
      desLogin: usuario.desLogin,
      senhaProvisoria,
    };
  }
  async me(codUsuario: number) {
    const usuario = await this.usuarioRepo.findOne({
      where: { codUsuario },
      relations: { perfis: true },
    });

    if (!usuario) {
      throw new NotFoundException('Usuário não encontrado');
    }

    const permissoes = await this.usuarioRepo.manager.query(
      `SELECT DISTINCT m.des_permissao
         FROM seg_usuario_perfil up
         JOIN seg_perfil_permissao pp ON pp.cod_perfil = up.cod_perfil
         JOIN seg_permissao m ON m.cod_permissao = pp.cod_permissao
        WHERE up.cod_usuario = $1
        ORDER BY m.des_permissao`,
      [codUsuario],
    );

    return {
      codUsuario: usuario.codUsuario,
      nomUsuario: usuario.nomUsuario,
      desLogin: usuario.desLogin,
      desEmail: usuario.desEmail,
      indTrocaSenha: usuario.indTrocaSenha,
      perfis: usuario.perfis?.map((p) => p.denPerfil) ?? [],
      permissoes: permissoes.map((p: any) => p.des_permissao),
    };
  }
}