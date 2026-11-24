import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PoDialogService } from '@po-ui/ng-components';
import { PoPageLoginModule, PoPageLoginLiterals } from '@po-ui/ng-templates';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  imports: [PoPageLoginModule],
  template: `
    <po-page-login
      [p-literals]="literals"
      [p-loading]="loading()"
      (p-login-submit)="onLogin($event)">
    </po-page-login>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private poDialog = inject(PoDialogService);

  loading = signal(false);

  literals: PoPageLoginLiterals = {
    loginLabel: 'Usuário',
    passwordLabel: 'Senha',
    loginPlaceholder: 'Digite seu usuário',
    passwordPlaceholder: 'Digite sua senha',
    submitLabel: 'Entrar',
    welcome: 'Piacentini & Cia',
  };

  onLogin(event: { login: string; password: string }) {
    this.loading.set(true);

    this.auth.login(event.login, event.password).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.poDialog.alert({
          title: 'Erro',
          message:
            err.status === 401
              ? 'Usuário ou senha inválidos.'
              : 'Erro ao conectar com o servidor.',
          literals: { ok: 'Fechar' },
        });
      },
    });
  }
}
