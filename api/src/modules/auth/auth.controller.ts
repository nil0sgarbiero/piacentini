import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
} from '@nestjs/common';
import { IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { Permissoes } from '../../common/decorators/permissoes.decorator.js';
import { TrocarSenhaDto } from './senha.dto.js';

class LoginDto {
  @IsString()
  desLogin!: string;

  @IsString()
  @MinLength(4)
  senha!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.desLogin, dto.senha);
  }

  @Post('trocar-senha')
  trocarSenha(@Req() req: any, @Body() dto: TrocarSenhaDto) {
    return this.authService.trocarSenha(req.user.codUsuario, dto);
  }

  @Post('reset-senha/:id')
  @Permissoes('editar_usuario')
  resetarSenha(@Param('id', ParseIntPipe) id: number) {
    return this.authService.resetarSenha(id);
  }
  @Get('me')
  me(@Req() req: any) {
    return this.authService.me(req.user.codUsuario);
  }
}