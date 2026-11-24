import { PoMenuItem } from '@po-ui/ng-components';

export function buildMenuItems(
  hasPermissao: (p: string) => boolean,
  isAdmin: boolean
): Array<PoMenuItem> {
  if (!isAdmin && !hasPermissao('painel.acessar')) return [];

  return [
    {
      label: 'Painel',
      icon: 'an an-house',
      link: '/',
    },
  ];
}
