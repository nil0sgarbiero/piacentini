import { IsString, MinLength, MaxLength } from 'class-validator';

export class TrocarSenhaDto {
  @IsString()
  @MinLength(1)
  senhaAtual!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(72)
  novaSenha!: string;
}

export class ResetarSenhaDto {
  // sem campos: a senha provisória é gerada pela API
}