import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Perfil } from './perfil.entity.js';

@Entity('seg_usuario')
export class Usuario {
  @PrimaryGeneratedColumn({ name: 'cod_usuario' })
  codUsuario: number;

  @Column({ name: 'nom_usuario', length: 120 })
  nomUsuario: string;

  @Column({ name: 'des_login', length: 60 })
  desLogin: string;

  @Column({ name: 'des_email', type: 'varchar', length: 150, nullable: true })
desEmail: string | null;

  @Column({ name: 'des_senha_hash', length: 255, select: false })
  desSenhaHash: string;

  @Column({ name: 'ind_ativo', type: 'char', length: 1, default: 'S' })
  indAtivo: string;

  @Column({ name: 'ind_troca_senha', type: 'char', length: 1, default: 'S' })
  indTrocaSenha: string;

  @Column({ name: 'num_tentativas', type: 'smallint', default: 0 })
  numTentativas: number;

  @Column({ name: 'dat_bloqueio', type: 'timestamptz', nullable: true })
datBloqueio: Date | null;

  @Column({ name: 'dat_ultimo_acesso', type: 'timestamptz', nullable: true })
datUltimoAcesso: Date | null;

  @CreateDateColumn({ name: 'dat_criacao', type: 'timestamptz' })
  datCriacao: Date;

  @Column({ name: 'dat_alteracao', type: 'timestamptz', nullable: true })
datAlteracao: Date | null;

  @ManyToMany(() => Perfil, { eager: false })
  @JoinTable({
    name: 'seg_usuario_perfil',
    joinColumn: { name: 'cod_usuario' },
    inverseJoinColumn: { name: 'cod_perfil' },
  })
  perfis: Perfil[];
}