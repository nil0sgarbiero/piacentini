INSERT INTO seg_permissao (des_permissao, des_descricao, nom_modulo)
VALUES
  ('listar_auditoria', 'Consultar o log de auditoria', 'Auditoria'),
  ('deletar_auditoria', 'Limpar registros antigos de auditoria', 'Auditoria')
ON CONFLICT (des_permissao) DO NOTHING;

INSERT INTO seg_perfil_permissao (cod_perfil, cod_permissao)
SELECT p.cod_perfil, m.cod_permissao
  FROM seg_perfil p
  CROSS JOIN seg_permissao m
 WHERE p.den_perfil = 'ADMIN'
   AND m.des_permissao IN ('listar_auditoria', 'deletar_auditoria')
ON CONFLICT DO NOTHING;