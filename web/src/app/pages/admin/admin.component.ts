import { Component } from '@angular/core';
import { PoModule } from '@po-ui/ng-components';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  imports: [PoModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  readonly opcoesAdmin = [
    { label: 'Permissões', icon: 'an an-lock-open', route: '/admin/permissoes' },
    { label: 'Módulos', icon: 'an an-book', route: '/admin/modulos' },
    { label: 'Usuários', icon: 'an an-users', route: '/admin/usuarios' },
  ];

  constructor(private router: Router) {}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}