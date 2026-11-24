import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('seg_auditoria')
export class Auditoria {
  @PrimaryGeneratedColumn({ name: 'cod_auditoria', type: 'bigint' })
  codAuditoria!: string;

  @Column({ name: 'cod_usuario', type: 'int', nullable: true })
  codUsuario!: number | null;

  @Column({ name: 'des_login', type: 'varchar', length: 60, nullable: true })
  desLogin!: string | null;

  @Column({ name: 'des_acao', type: 'varchar', length: 20 })
  desAcao!: string;

  @Column({ name: 'des_recurso', type: 'varchar', length: 120 })
  desRecurso!: string;

  @Column({ name: 'des_metodo', type: 'varchar', length: 10 })
  desMetodo!: string;

  @Column({ name: 'des_rota', type: 'varchar', length: 255 })
  desRota!: string;

  @Column({ name: 'des_ip', type: 'varchar', length: 45, nullable: true })
  desIp!: string | null;

  @Column({ name: 'des_user_agent', type: 'varchar', length: 255, nullable: true })
  desUserAgent!: string | null;

  @Column({ name: 'des_payload', type: 'jsonb', nullable: true })
  desPayload!: any;

  @Column({ name: 'num_status', type: 'int', nullable: true })
  numStatus!: number | null;

  @CreateDateColumn({ name: 'dat_evento', type: 'timestamp' })
  datEvento!: Date;
}