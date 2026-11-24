import { PoSelectOption } from '@po-ui/ng-components';

export interface UsuarioView {
  id: number;
  nome: string;
  login: string;
  perfil: string;
  ativo: boolean;
}

export type UsuarioPayload = Omit<UsuarioView, 'id'>;

export const PERFIS_USUARIO: PoSelectOption[] = [
  { label: 'Administrador', value: 'ADMIN' },
  { label: 'Usuário', value: 'USER' },
];

export const SITUACOES_USUARIO: PoSelectOption[] = [
  { label: 'Todos', value: '' },
  { label: 'Ativo', value: 'ativo' },
  { label: 'Inativo', value: 'inativo' },
];
