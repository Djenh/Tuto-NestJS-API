import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe(
    {
      whitelist: true, // Supprime les champs non définis dans le DTO
      forbidNonWhitelisted: true, // Retourne une erreur si champs non autorisés
      transform: true, // Transforme automatiquement les types
    }
  ));
  app.setGlobalPrefix('api');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
