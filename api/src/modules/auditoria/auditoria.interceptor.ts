import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditoriaService } from './auditoria.service.js';

const METODOS_AUDITADOS = new Set(['POST', 'PATCH', 'PUT', 'DELETE']);

const CAMPOS_SENSIVEIS = new Set([
  'senha',
  'senhaAtual',
  'novaSenha',
  'desSenhaHash',
  'password',
  'token',
  'access_token',
]);

@Injectable()
export class AuditoriaInterceptor implements NestInterceptor {
  constructor(private readonly auditoriaService: AuditoriaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    if (!METODOS_AUDITADOS.has(request.method)) {
      return next.handle();
    }

    const inicio = Date.now();

    return next.handle().pipe(
      tap({
        next: () => this.registrar(request, context, Date.now() - inicio),
        error: (err) =>
          this.registrar(request, context, Date.now() - inicio, err?.status ?? 500),
      }),
    );
  }

  private registrar(
    request: any,
    context: ExecutionContext,
    duracaoMs: number,
    statusErro?: number,
  ) {
    try {
      const response = context.switchToHttp().getResponse();
      const usuario = request.user;

      const rota = request.route?.path
        ? `${request.baseUrl ?? ''}${request.route.path}`
        : request.originalUrl ?? request.url;

      const recurso = (request.baseUrl ?? request.url ?? '')
        .replace(/^\/api\/?/, '')
        .split('/')[0] || 'raiz';

      this.auditoriaService
        .registrar({
          codUsuario: usuario?.codUsuario ?? null,
          desLogin: usuario?.login ?? null,
          desAcao: request.method,
          desRecurso: recurso,
          desMetodo: request.method,
          desRota: rota,
          desIp:
            (request.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
            request.ip ??
            null,
          desUserAgent: request.headers['user-agent'] ?? null,
          desPayload: this.sanitizar(request.body),
          numStatus: statusErro ?? response.statusCode ?? null,
        })
        .catch(() => {
          // auditoria nunca deve derrubar a requisição
        });
    } catch {
      // silencioso por design
    }
  }

  private sanitizar(body: any) {
    if (!body || typeof body !== 'object') return null;

    const copia: Record<string, any> = Array.isArray(body) ? [...body] : { ...body };

    for (const chave of Object.keys(copia)) {
      if (CAMPOS_SENSIVEIS.has(chave)) {
        copia[chave] = '***';
      }
    }

    return copia;
  }
}