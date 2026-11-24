import {
  IsArray,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CriarUsuarioDto {
  @IsString()
  @MaxLength(120)
  nomUsuario!: string;

  @IsString()
  @MaxLength(60)
  desLogin!: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  desEmail?: string;

  @IsString()
  @MinLength(6)
  senha!: string;

  @IsArray()
  @IsInt({ each: true })
  codPerfis!: number[];
}

export class AtualizarUsuarioDto {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  nomUsuario?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  desLogin?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  desEmail?: string;

  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  codPerfis?: number[];

  @IsOptional()
  @IsString()
  indAtivo?: string;
}