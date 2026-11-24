import { PoSelectOption } from '@po-ui/ng-components';

export interface PermissaoView {
  id: number;
  nome: string;
  modulo: string;
  ativo: boolean;
  descricao?: string;
}

export type PermissaoPayload = Omit<PermissaoView, 'id'>;

export const SITUACOES_PERMISSAO: PoSelectOption[] = [
  { label: 'Todos', value: '' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
];
