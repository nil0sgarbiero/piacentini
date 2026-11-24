import { Component, computed, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, NavigationEnd } from '@angular/router';
import { PoModule } from '@po-ui/ng-components';
import { filter, map } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { MODULOS, ModuloConfig } from '../../core/permissions/permissions.config';

@Component({
  selector: 'app-painel',
  imports: [PoModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './painel.component.html',
  styleUrls: ['./painel.component.css'],
})
export class PainelComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  readonly usuario = this.auth.usuario;

  private readonly dataHoje = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date());

  // Tótulo do toolbar: "Piacentini - 09/11/2026"
  readonly tituloToolbar = computed(() => {
    const data = this.dataHoje;
    return `Piacentini - ${data.charAt(0).toUpperCase()}${data.slice(1)}`;
  });

  // Perfil: title = "Olá", subtitle = nome do usuário
  readonly perfil = computed<{ title: string; subtitle: string; avatar: string }>(() => ({
    title: 'Olá',
    subtitle: this.usuario()?.login ?? '',
    avatar: '',
  }));

  readonly acoesPerfil: { label: string; icon: string; action: () => void }[] = [
    { label: 'Meu perfil', icon: 'an an-user-circle', action: () => this.abrirPerfil() },
    { label: 'Sair', icon: 'an an-sign-out', action: () => this.auth.logout() },
  ];

  // Notificações
  readonly notificacoes = computed(() => 0);

  readonly acoesNotificacao: { label: string; icon: string; action: () => void }[] = [
    { label: 'Nenhuma notificação', icon: 'an an-bell', action: () => {} },
  ];

  private readonly urlAtual = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  readonly modulos = computed<Array<ModuloConfig>>(() => {
    const isAdmin = this.auth.hasPerfil('ADMIN');
    return MODULOS.filter(
      (m) => isAdmin || this.auth.hasPermissao(m.permissao)
    );
  });

  readonly tituloPagina = computed(() => {
    const chave = this.urlAtual().split('/').filter(Boolean)[0] ?? '';
    const mapa: Record<string, string> = {
      '': 'Painel de Informações',
      pcp: 'PCP',
      engenharia: 'Engenharia',
      financeiro: 'Financeiro',
      suprimentos: 'Suprimentos',
      vendas: 'Vendas',
      manutencao: 'Manutenção',
    };
    return mapa[chave] ?? 'Painel de Informações';
  });

  readonly breadcrumb = computed(() => {
    const titulo = this.tituloPagina();
    return titulo === 'Painel de Informações'
      ? { items: [{ label: 'Painel' }] }
      : { items: [{ label: 'Painel', link: '/' }, { label: titulo }] };
  });

  readonly menus = computed(() => [
    { label: 'Painel', icon: 'an an-house', link: '/' },
    { label: 'PCP', icon: 'an an-calendar-check', link: '/pcp' },
    { label: 'Engenharia', icon: 'an an-wrench', link: '/engenharia' },
    { label: 'Financeiro', icon: 'an an-currency-dollar', link: '/financeiro' },
    { label: 'Suprimentos', icon: 'an an-package', link: '/suprimentos' },
    { label: 'Vendas', icon: 'an an-shopping-cart', link: '/vendas' },
    { label: 'Manutenção', icon: 'an an-gear', link: '/manutencao' },
  ]);

  abrirPerfil(): void {
    // navegar para /perfil ou abrir modal
  }

  abrir(modulo: ModuloConfig): void {
    this.router.navigate([modulo.route]);
  }
}