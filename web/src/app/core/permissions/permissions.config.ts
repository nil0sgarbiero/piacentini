export type ModuloKey =
  | 'pcp'
  | 'engenharia'
  | 'financeiro'
  | 'suprimentos'
  | 'vendas'
  | 'manutencao';

export interface ModuloConfig {
  key: ModuloKey;
  label: string;
  icon: string;
  route: string;
  /** Permissão necessária para ver o módulo. ADMIN sempre vê tudo. */
  permissao: string;
}

export const MODULOS: ModuloConfig[] = [
  { key: 'pcp',         label: 'PCP',         icon: 'an an-calendar-check',   route: '/pcp',         permissao: 'pcp.acessar' },
  { key: 'engenharia',  label: 'Engenharia',  icon: 'an an-wrench',      route: '/engenharia',  permissao: 'engenharia.acessar' },
  { key: 'financeiro',  label: 'Financeiro',  icon: 'an an-currency-dollar', route: '/financeiro', permissao: 'financeiro.acessar' },
  { key: 'suprimentos', label: 'Suprimentos', icon: 'an an-package', route: '/suprimentos', permissao: 'suprimentos.acessar' },
  { key: 'vendas',      label: 'Vendas',      icon: 'an an-shopping-cart',        route: '/vendas',      permissao: 'vendas.acessar' },
  { key: 'manutencao',  label: 'Manutenção',  icon: 'an an-gear',     route: '/manutencao',  permissao: 'manutencao.acessar' },
];

/** Sub-itens por módulo. Vazio = módulo sem filhos. */
export const SUBMODULOS: Record<ModuloKey, Array<{ label: string; route: string; permissao: string }>> = {
  pcp: [],
  engenharia: [],
  financeiro: [],
  suprimentos: [
    { label: 'Controle de Contratos', route: '/suprimentos/contratos', permissao: 'suprimentos.contratos' },
  ],
  vendas: [],
  manutencao: [],
};
