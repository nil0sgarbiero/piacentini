import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';
import { JwtAuthGuard } from './modules/auth/jwt-auth.guard.js';
import { PermissoesGuard } from './common/guards/permissoes.guard.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const reflector = app.get(Reflector);
  app.useGlobalGuards(
    new JwtAuthGuard(reflector),
    new PermissoesGuard(reflector, app.get('PerfilRepository')),
  );

  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();