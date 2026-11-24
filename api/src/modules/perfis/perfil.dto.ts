import {
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CriarPerfilDto {
  @IsString()
  @MaxLength(60)
  denPerfil!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  desPerfil?: string;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  codPermissoes?: number[];
}

export class AtualizarPerfilDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  denPerfil?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  desPerfil?: string;

  @IsOptional()
  @IsString()
  indAtivo?: string;
}

export class DefinirPermissoesDto {
  @IsArray()
  @IsInt({ each: true })
  codPermissoes!: number[];
}