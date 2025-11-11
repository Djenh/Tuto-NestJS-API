import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';
import { ServicesModule } from './services/services.module';
import { PicturesModule } from './pictures/pictures.module';
import configuration from 'config/configuration';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    AuthModule,
    PrismaModule,
    UsersModule,
    ServicesModule,
    PicturesModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      // .exclude('services')
      // .forRoutes({ path: 'users', method: RequestMethod.GET });
      .forRoutes('*');
      // .forRoutes(UsersController);
  }
}
