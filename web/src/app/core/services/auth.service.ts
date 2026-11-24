import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginResponse, Usuario } from '../models/usuario.model';

const TOKEN_KEY = 'piacentini_token';

interface JwtPayload extends Usuario {
  exp: number;
  permissoes?: string[];
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private _token = signal<string | null>(localStorage.getItem(TOKEN_KEY));
  private _usuario = signal<JwtPayload | null>(
    this.decodeToken(localStorage.getItem(TOKEN_KEY))
  );

  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly perfis = computed(() => this._usuario()?.perfis ?? []);

  readonly isLoggedIn = computed(() => {
    const u = this._usuario();
    return !!this._token() && !!u && Date.now() < u.exp * 1000;
  });

  login(desLogin: string, senha: string) {
    return this.http
      .post<LoginResponse>('/api/auth/login', { desLogin, senha })
      .pipe(
        tap((res) => {
          localStorage.setItem(TOKEN_KEY, res.access_token);
          this._token.set(res.access_token);
          this._usuario.set(this.decodeToken(res.access_token));
        })
      );
  }

  logout() {
    localStorage.removeItem(TOKEN_KEY);
    this._token.set(null);
    this._usuario.set(null);
    this.router.navigate(['/login']);
  }

  hasPerfil(perfil: string): boolean {
    const alvo = perfil.toUpperCase();
    return this.perfis().some((p) => p.toUpperCase() === alvo);
  }

  hasPermissao(permissao: string): boolean {
    if (this.hasPerfil('ADMIN')) return true;

    const u = this._usuario() as any;
    const permissoes: string[] = u?.permissoes ?? [];

    // Rede de segurança: enquanto o backend não enviar permissões no token,
    // libera tudo para não deixar o menu vazio.
    if (permissoes.length === 0) return true;

    return permissoes.includes(permissao);
  }

  private decodeToken(token: string | null): JwtPayload | null {
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        login: payload.login,
        perfis: payload.perfis ?? [],
        permissoes: payload.permissoes ?? [],
        exp: payload.exp,
      };
    } catch {
      return null;
    }
  }
}
