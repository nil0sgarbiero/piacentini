import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const permissionGuard = (perfil: string): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.hasPerfil('ADMIN')) return true;
  if (auth.hasPerfil(perfil)) return true;
  if (auth.hasPermissao(perfil)) return true;

  router.navigate(['/']);
  return false;
};
