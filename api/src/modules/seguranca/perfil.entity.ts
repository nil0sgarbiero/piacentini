import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seg_perfil')
export class Perfil {
  @PrimaryGeneratedColumn({ name: 'cod_perfil' })
  codPerfil: number;

  @Column({ name: 'den_perfil', type: 'varchar', length: 60 })
  denPerfil: string;

  @Column({ name: 'des_perfil', type: 'varchar', length: 200, nullable: true })
  desPerfil: string | null;

  @Column({ name: 'ind_ativo', type: 'char', length: 1, default: 'S' })
  indAtivo: string;

  @CreateDateColumn({ name: 'dat_criacao', type: 'timestamptz' })
  datCriacao: Date;
}