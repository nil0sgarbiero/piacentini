import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { DatabaseModule } from './config/database.module.js';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SegurancaModule } from './modules/seguranca/seguranca.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { UsuariosModule } from './modules/usuarios/usuarios.module.js';
import { PerfisModule } from './modules/perfis/perfis.module.js';
import { AuditoriaModule } from './modules/auditoria/auditoria.module.js';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard.js';
import { PermissoesGuard } from './common/guards/permissoes.guard.js';
import { AuditoriaInterceptor } from './modules/auditoria/auditoria.interceptor.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    DatabaseModule,
    SegurancaModule,
    AuthModule,
    UsuariosModule,
    PerfisModule,
    AuditoriaModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: PermissoesGuard },
    { provide: APP_INTERCEPTOR, useClass: AuditoriaInterceptor },
  ],
})
export class AppModule {}