import { APP_LAYOUT } from '../theme/app-layout.config';

export const MENU_CONFIG = {
  logo: APP_LAYOUT.logoUrl,
  title: APP_LAYOUT.systemShortName,
  collapsible: APP_LAYOUT.menuCollapsible,
  width: APP_LAYOUT.menuWidth,
  collapsedWidth: APP_LAYOUT.menuCollapsedWidth,
  filter: true,
  filterLabel: 'Pesquisar',
} as const;
