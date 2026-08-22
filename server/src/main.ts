import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT', 3000);

  // Normalises all HTTP errors to a consistent { statusCode, message, path, timestamp } shape
  app.useGlobalFilters(new HttpExceptionFilter());

  // Allows the frontend origin to call this API (required for browser cross-origin requests)
  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL', 'http://localhost:5173'),
    credentials: true,
  });

  // Activates class-validator decorators globally and strips unknown request fields
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(port);
}
bootstrap();

