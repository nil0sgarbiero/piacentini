import { PoSelectOption } from '@po-ui/ng-components';

export interface ModuloView {
  id: number;
  nome: string;
  descricao?: string;
  ativo: boolean;
}

export type ModuloPayload = Omit<ModuloView, 'id'>;

export const SITUACOES_MODULO: PoSelectOption[] = [
  { label: 'Todos', value: '' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
];
