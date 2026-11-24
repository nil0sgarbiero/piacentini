import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { PainelComponent } from './pages/painel/painel.component';
import { LoginComponent } from './pages/login/login.component';
import { authGuard, permissionGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', component: PainelComponent },
      {
        path: 'pcp',
        loadComponent: () =>
          import('./pages/pcp/pcp.component').then((m) => m.PcpComponent),
      },
      {
        path: 'engenharia',
        loadComponent: () =>
          import('./pages/engenharia/engenharia.component').then(
            (m) => m.EngenhariaComponent
          ),
      },
      {
        path: 'financeiro',
        loadComponent: () =>
          import('./pages/financeiro/financeiro.component').then(
            (m) => m.FinanceiroComponent
          ),
      },
      {
        path: 'suprimentos',
        loadComponent: () =>
          import('./pages/suprimentos/suprimentos.component').then(
            (m) => m.SuprimentosComponent
          ),
      },
      {
        path: 'vendas',
        loadComponent: () =>
          import('./pages/vendas/vendas.component').then(
            (m) => m.VendasComponent
          ),
      },
      {
        path: 'manutencao',
        loadComponent: () =>
          import('./pages/manutencao/manutencao.component').then(
            (m) => m.ManutencaoComponent
          ),
      },
      {
        path: 'admin',
        canActivate: [permissionGuard('ADMIN')],
        children: [
          { path: 'permissoes', loadComponent: () => import('./pages/admin/permissoes/permissoes.component').then(m => m.PermissoesComponent) },
          { path: 'modulos', loadComponent: () => import('./pages/admin/modulos/modulos.component').then(m => m.ModulosComponent) },
          { path: 'usuarios', loadComponent: () => import('./pages/admin/usuarios/usuarios.component').then(m => m.UsuariosComponent) },
          { path: '', loadComponent: () => import('./pages/admin/admin.component').then(m => m.AdminComponent) },
        ],
      },
    ],
  },
  { path: '**', redirectTo: '' },
];