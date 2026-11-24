sql_script
-- =========================================================
-- PIACENTINI API
-- Modulo: Seguranca / Autenticacao / Auditoria
-- Script de criacao completa do schema (PostgreSQL 12+)
-- Data: 2025
-- Observacao: script de criacao completo - tabelas, indices,
-- chaves estrangeiras, dados iniciais (seed) e scripts uteis.
-- =========================================================

-- ---------------------------------------------------------
-- SECAO 1 - TABELAS DO MODULO DE SEGURANCA
-- (ordem respeitando as foreign keys: perfil e permissao
-- primeiro, depois usuario, tabelas de ligacao e auditoria)
-- ---------------------------------------------------------

-- 1) Perfis de acesso (ex.: ADMIN, OPERADOR)
CREATE TABLE IF NOT EXISTS seg_perfil (
    cod_perfil    serial       PRIMARY KEY,
    den_perfil    varchar(60)  NOT NULL UNIQUE,
    des_perfil    varchar(200) NULL,
    ind_ativo     char(1)      NOT NULL DEFAULT 'S'
                  CHECK (ind_ativo IN ('S','N')),
    dat_criacao   timestamp    NOT NULL DEFAULT now(),
    dat_alteracao timestamp    NULL
);

-- 2) Permissoes granulares do sistema (ex.: novo_usuario, listar_auditoria)
CREATE TABLE IF NOT EXISTS seg_permissao (
    cod_permissao serial       PRIMARY KEY,
    des_permissao varchar(80)  NOT NULL UNIQUE,
    des_descricao varchar(200) NULL,
    nom_modulo    varchar(60)  NULL,
    ind_ativo     char(1)      NOT NULL DEFAULT 'S'
                  CHECK (ind_ativo IN ('S','N'))
);

-- 3) Usuarios do sistema
CREATE TABLE IF NOT EXISTS seg_usuario (
    cod_usuario     serial       PRIMARY KEY,
    nom_usuario     varchar(120) NOT NULL,
    des_login       varchar(60)  NOT NULL UNIQUE,
    des_email       varchar(150) NULL,
    des_senha_hash  varchar(255) NOT NULL,
    ind_ativo       char(1)      NOT NULL DEFAULT 'S'
                    CHECK (ind_ativo IN ('S','N')),
    ind_troca_senha char(1)      NOT NULL DEFAULT 'S'
                    CHECK (ind_troca_senha IN ('S','N')),
    num_tentativas  integer      NOT NULL DEFAULT 0,
    dat_bloqueio    timestamp    NULL,
    dat_criacao     timestamp    NOT NULL DEFAULT now(),
    dat_alteracao   timestamp    NULL
);

-- 4) Ligacao N:N usuario-perfil
CREATE TABLE IF NOT EXISTS seg_usuario_perfil (
    cod_usuario integer NOT NULL,
    cod_perfil  integer NOT NULL,
    CONSTRAINT pk_seg_usuario_perfil PRIMARY KEY (cod_usuario, cod_perfil),
    CONSTRAINT fk_usu_per_usuario FOREIGN KEY (cod_usuario)
        REFERENCES seg_usuario (cod_usuario) ON DELETE CASCADE,
    CONSTRAINT fk_usu_per_perfil FOREIGN KEY (cod_perfil)
        REFERENCES seg_perfil (cod_perfil) ON DELETE CASCADE
);

-- 5) Ligacao N:N perfil-permissao
CREATE TABLE IF NOT EXISTS seg_perfil_permissao (
    cod_perfil    integer NOT NULL,
    cod_permissao integer NOT NULL,
    CONSTRAINT pk_seg_perfil_permissao PRIMARY KEY (cod_perfil, cod_permissao),
    CONSTRAINT fk_per_per_perfil FOREIGN KEY (cod_perfil)
        REFERENCES seg_perfil (cod_perfil) ON DELETE CASCADE,
    CONSTRAINT fk_per_per_permissao FOREIGN KEY (cod_permissao)
        REFERENCES seg_permissao (cod_permissao) ON DELETE CASCADE
);

-- 6) Auditoria de acessos e acoes
CREATE TABLE IF NOT EXISTS seg_auditoria (
    cod_auditoria bigserial     PRIMARY KEY,
    cod_usuario   integer       NULL,
    des_login     varchar(60)   NULL,
    des_acao      varchar(20)   NOT NULL,
    des_recurso   varchar(120)  NOT NULL,
    des_metodo    varchar(10)   NOT NULL,
    des_rota      varchar(255)  NOT NULL,
    des_ip        varchar(45)   NULL,
    des_user_agent varchar(255) NULL,
    des_payload   jsonb         NULL,
    num_status    integer       NULL,
    dat_evento    timestamp     NOT NULL DEFAULT now(),
    CONSTRAINT fk_aud_usuario FOREIGN KEY (cod_usuario)
        REFERENCES seg_usuario (cod_usuario) ON DELETE SET NULL
);

-- ---------------------------------------------------------
-- Indices
-- ---------------------------------------------------------
CREATE INDEX IF NOT EXISTS ix_aud_data     ON seg_auditoria (dat_evento DESC);
CREATE INDEX IF NOT EXISTS ix_aud_usuario  ON seg_auditoria (cod_usuario);
CREATE INDEX IF NOT EXISTS ix_aud_recurso  ON seg_auditoria (des_recurso);
CREATE INDEX IF NOT EXISTS ix_usuario_login ON seg_usuario (des_login);
CREATE INDEX IF NOT EXISTS ix_usuario_ativo ON seg_usuario (ind_ativo);
CREATE INDEX IF NOT EXISTS ix_perfil_den   ON seg_perfil (den_perfil);

-- ---------------------------------------------------------
-- SECAO 2 - DADOS INICIAIS (SEED)
-- ---------------------------------------------------------

-- Perfil administrador
INSERT INTO seg_perfil (den_perfil, des_perfil, ind_ativo)
VALUES ('ADMIN', 'Administrador do sistema', 'S')
ON CONFLICT (den_perfil) DO NOTHING;

-- Permissoes (modulo Usuarios)
INSERT INTO seg_permissao (des_permissao, des_descricao, nom_modulo) VALUES
    ('listar_usuario',  'Listar usuarios cadastrados',            'Usuarios'),
    ('novo_usuario',    'Cadastrar novo usuario',                 'Usuarios'),
    ('editar_usuario',  'Editar dados de um usuario',             'Usuarios'),
    ('deletar_usuario', 'Excluir usuario do sistema',             'Usuarios')
ON CONFLICT (des_permissao) DO NOTHING;

-- Permissoes (modulo Perfis)
INSERT INTO seg_permissao (des_permissao, des_descricao, nom_modulo) VALUES
    ('listar_perfil',  'Listar perfis de acesso',                'Perfis'),
    ('novo_perfil',    'Cadastrar novo perfil de acesso',        'Perfis'),
    ('editar_perfil',  'Editar perfil de acesso',                'Perfis'),
    ('deletar_perfil', 'Excluir perfil de acesso',               'Perfis')
ON CONFLICT (des_permissao) DO NOTHING;

-- Permissoes (modulo Auditoria)
INSERT INTO seg_permissao (des_permissao, des_descricao, nom_modulo) VALUES
    ('listar_auditoria', 'Consultar registros de auditoria',     'Auditoria')
ON CONFLICT (des_permissao) DO NOTHING;

-- Vincula TODAS as permissoes ao perfil ADMIN
INSERT INTO seg_perfil_permissao (cod_perfil, cod_permissao)
SELECT p.cod_perfil, m.cod_permissao
FROM seg_perfil p
CROSS JOIN seg_permissao m
WHERE p.den_perfil = 'ADMIN'
ON CONFLICT DO NOTHING;

-- Usuario administrador padrao (senha inicial: admin - hash bcrypt)
INSERT INTO seg_usuario (nom_usuario, des_login, des_email, des_senha_hash, ind_ativo, ind_troca_senha, num_tentativas)
VALUES ('Administrador', 'admin', NULL,
        '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
        'S', 'S', 0)
ON CONFLICT (des_login) DO NOTHING;

-- Vincula o usuario admin ao perfil ADMIN
INSERT INTO seg_usuario_perfil (cod_usuario, cod_perfil)
SELECT u.cod_usuario, p.cod_perfil
FROM seg_usuario u
CROSS JOIN seg_perfil p
WHERE u.des_login = 'admin'
  AND p.den_perfil = 'ADMIN'
ON CONFLICT DO NOTHING;

-- ---------------------------------------------------------
-- SECAO 3 - SCRIPTS UTEIS DE MANUTENCAO (comentados)
-- ---------------------------------------------------------

-- Lista usuarios com seus perfis
-- SELECT u.cod_usuario, u.nom_usuario, u.des_login, u.ind_ativo,
--        p.den_perfil
-- FROM seg_usuario u
-- JOIN seg_usuario_perfil up ON up.cod_usuario = u.cod_usuario
-- JOIN seg_perfil p          ON p.cod_perfil   = up.cod_perfil
-- ORDER BY u.nom_usuario;

-- Lista permissoes por perfil
-- SELECT p.den_perfil, m.des_permissao, m.des_descricao, m.nom_modulo
-- FROM seg_perfil p
-- JOIN seg_perfil_permissao pp ON pp.cod_perfil    = p.cod_perfil
-- JOIN seg_permissao m         ON m.cod_permissao  = pp.cod_permissao
-- ORDER BY p.den_perfil, m.nom_modulo, m.des_permissao;

-- Ultimas 50 acoes registradas na auditoria
-- SELECT a.dat_evento, a.des_login, a.des_acao, a.des_recurso,
--        a.des_metodo, a.des_rota, a.des_ip, a.num_status
-- FROM seg_auditoria a
-- ORDER BY a.dat_evento DESC
-- LIMIT 50;

-- Reseta a senha de um usuario para uma senha provisoria
"-- (hash bcrypt de exemplo: senha provisoria ""trocar123"")"
-- UPDATE seg_usuario
-- SET des_senha_hash   = '$2b$10$Q9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWz',
--     ind_troca_senha  = 'S',
--     num_tentativas   = 0,
--     dat_bloqueio     = NULL,
--     dat_alteracao    = now()
-- WHERE des_login = 'admin';

-- Limpa registros de auditoria com mais de 90 dias
-- DELETE FROM seg_auditoria
-- WHERE dat_evento < now() - interval '90 days';

-- ---------------------------------------------------------
-- SECAO 4 - DROP (para recriar o schema do zero)
-- ATENCAO: execute apenas em ambiente de desenvolvimento!
-- ---------------------------------------------------------
-- DROP TABLE IF EXISTS seg_auditoria            CASCADE;
-- DROP TABLE IF EXISTS seg_usuario_perfil       CASCADE;
-- DROP TABLE IF EXISTS seg_perfil_permissao     CASCADE;
-- DROP TABLE IF EXISTS seg_usuario              CASCADE;
-- DROP TABLE IF EXISTS seg_permissao            CASCADE;
-- DROP TABLE IF EXISTS seg_perfil               CASCADE;