import { Component, computed, inject, ElementRef, PLATFORM_ID, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import {
  PoBreadcrumb,
  PoBreadcrumbItem,
  PoMenuModule,
  PoToolbarModule,
  PoPageModule,
  PoToolbarAction,
  PoToolbarProfile,
  PoThemeService,
  PoThemeTypeEnum,
} from '@po-ui/ng-components';
import { piacentiniTheme } from '../core/theme/piacentini-theme';
import { AuthService } from '../core/services/auth.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-layout',
  imports: [RouterOutlet, PoToolbarModule, PoMenuModule, PoPageModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent {
  private router = inject(Router);
  private auth = inject(AuthService);
  private theme = inject(PoThemeService);
  private platformId = inject(PLATFORM_ID);

  readonly usuario = this.auth.usuario;
  readonly menuColapsado = signal(false);
  private get isMobile(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return window.innerWidth <= 768;
    }
    return false;
  };

  private readonly dataHoje = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  // Título do toolbar: "Piacentina - 09/11/2026" (mobile) ou completo (desktop)
  readonly tituloToolbar = computed(() => {
    const data = new Date();
    if (this.isMobile) {
      // Formato mobile: dd/mm/yyyy
      return `Piacentini - ${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
    }
    // Formato desktop: completo (weekday + day + month + year)
    const dataFormatada = this.dataHoje;
    return `Piacentini — ${dataFormatada.charAt(0).toUpperCase()}${dataFormatada.slice(1)}`;
  });

  // Perfil: title = "Olá", subtitle = nome do usuário
  readonly perfil = computed<PoToolbarProfile>(() => ({
    title: 'Olá',
    subtitle: this.usuario()?.login ?? '',
    avatar: '',
  }));

  readonly acoesPerfil: PoToolbarAction[] = [
    { label: 'Meu perfil', icon: 'an an-user-circle', action: () => this.abrirPerfil() },
    {
      label: 'Tema',
      icon: 'an an-moon-stars',
      action: () => this.toggleTheme(),
    },
    {
      label: 'Painel Administrativo',
      icon: 'an an-shield',
      action: () => {
        if (this.auth.hasPerfil('ADMIN')) {
          this.router.navigate(['/admin']);
        }
      },
      // Este item só será habilitado/visível para admins
      // O próprio action verifica a permissão antes de navegar
    },
    { label: 'Sair', icon: 'an an-sign-out', action: () => this.auth.logout() },
  ];

  // Notificações
  readonly notificacoes = computed(() => 0);

  readonly acoesNotificacao: PoToolbarAction[] = [
    { label: 'Nenhuma notificação', icon: 'an an-bell', action: () => {} },
  ];

  private readonly urlAtual = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  private static readonly ROTULOS: Record<string, string> = {
    '': 'Painel de Informações',
    pcp: 'PCP',
    engenharia: 'Engenharia',
    financeiro: 'Financeiro',
    suprimentos: 'Suprimentos',
    vendas: 'Vendas',
    manutencao: 'Manutenção',
    admin: 'Painel Administrativo',
    permissoes: 'Permissões',
    modulos: 'Módulos',
    usuarios: 'Usuários',
  };

  readonly breadcrumb = computed<PoBreadcrumb>(() => {
    const segmentos = this.urlAtual().split('?')[0].split('/').filter(Boolean);

    if (segmentos.length === 0) {
      return { items: [{ label: 'Painel' }] };
    }

    const itens: PoBreadcrumbItem[] = [{ label: 'Painel', link: '/' }];
    let caminho = '';

    segmentos.forEach((segmento, indice) => {
      caminho += `/${segmento}`;
      itens.push({
        label: LayoutComponent.ROTULOS[segmento] ?? segmento,
        link: indice === segmentos.length - 1 ? undefined : caminho,
      });
    });

    return { items: itens };
  });

  readonly tituloPagina = computed(() => {
    const itens = this.breadcrumb().items;
    return itens.length <= 1 ? 'Painel de Informações' : itens[itens.length - 1].label;
  });

  readonly menus = computed(() => [
    { label: 'Painel', icon: 'an an-house', shortLabel: 'Painel', link: '/' },
    { label: 'PCP', icon: 'an an-calendar-check', shortLabel: 'PCP', link: '/pcp' },
    { label: 'Engenharia', icon: 'an an-wrench', shortLabel: 'Engenharia', link: '/engenharia' },
    { label: 'Financeiro', icon: 'an an-currency-dollar', shortLabel: 'Financeiro', link: '/financeiro' },
    { label: 'Suprimentos', icon: 'an an-package', shortLabel: 'Suprimentos', link: '/suprimentos' },
    { label: 'Vendas', icon: 'an an-shopping-cart', shortLabel: 'Vendas', link: '/vendas' },
    { label: 'Manutenção', icon: 'an an-gear', shortLabel: 'Manutenção', link: '/manutencao' },
  ]);

  abrirPerfil(): void {
    // navegar para /perfil ou abrir modal
  }

  toggleTheme(): void {
    const currentTheme = this.theme.getThemeActive();
    // active pode ser PoThemeTypeEnum (ex: "light") OU PoThemeActive (objeto com .type e .a11y)
    const active = currentTheme?.active;
    // Se for objeto PoThemeActive, pegar .type; se for enum, usar diretamente
    const currentType = typeof active === 'object' && active !== null
      ? (active as { type?: PoThemeTypeEnum }).type ?? PoThemeTypeEnum.light
      : (active ?? PoThemeTypeEnum.light);
    const nextType =
      currentType === PoThemeTypeEnum.light
        ? PoThemeTypeEnum.dark
        : PoThemeTypeEnum.light;

    this.theme.setThemeType(piacentiniTheme, nextType);
  }
}
