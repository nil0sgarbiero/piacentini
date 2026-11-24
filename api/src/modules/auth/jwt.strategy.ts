import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from '../seguranca/usuario.entity.js';

export interface JwtPayload {
  sub: number;
  login: string;
  perfis: string[];
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    config: ConfigService,
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: JwtPayload) {
    const usuario = await this.usuarioRepo.findOne({
      where: { codUsuario: payload.sub, indAtivo: 'S' },
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuário inativo ou inexistente');
    }

    return {
      codUsuario: usuario.codUsuario,
      login: usuario.desLogin,
      perfis: payload.perfis,
    };
  }
}