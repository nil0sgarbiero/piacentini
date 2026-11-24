import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seg_permissao')
export class Permissao {
  @PrimaryGeneratedColumn({ name: 'cod_permissao' })
  codPermissao: number;

  @Column({ name: 'des_permissao', length: 80 })
  desPermissao: string;

    @Column({ name: 'des_descricao', type: 'varchar', length: 200, nullable: true })
    desDescricao: string | null;
}