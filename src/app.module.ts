import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserIdentityModule } from './modules/user-identity/user-identity.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from './config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HeaderResolver, I18nModule } from 'nestjs-i18n';
import { join } from 'path';
import { RoleModule } from './modules/role/role.module';
import { PermissionModule } from './modules/permission/permission.module';
import { AuthModule } from './modules/auth/auth.module';
import { EventsModule } from './modules/events/events.module';
import { TicketsModule } from './modules/tickets/tickets.module';
import { SearchModule } from './modules/search/search.module';
import { OrdersModule } from './modules/orders/orders.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import elasticsearchConfig from './config/elasticsearch.config';
import { CacheModule } from '@nestjs/cache-manager';
import { AuditLogModule } from './modules/audit-log/audit-log.module';
import rabbitmqConfig from './config/rabbitmq.config';
import { AuditInterceptor } from './modules/audit-log/audit.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  imports: [
    CacheModule.register({
      host: '127.0.0.1',
      port: 6379,
      db: 0,
      ttl: 100000,
    }),
    I18nModule.forRootAsync({
      useFactory: () => ({
        fallbackLanguage: 'ar',
        loaderOptions: {
          path: join(__dirname, '/i18n/'),
          watch: true,
        },
        typesOutputPath: join(__dirname, '../src/generated/i18n.generated.ts'),
      }),
      resolvers: [new HeaderResolver(['accept-language'])],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, elasticsearchConfig, rabbitmqConfig],
    }),

    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) =>
        configService.get('database'),
    }),

    // ElasticsearchModule.registerAsync({
    //   useFactory: () => ({
    //     node: 'http://127.0.0.1:9200',
    //     maxRetries: 10,
    //     requestTimeout: 60000,
    //     pingTimeout: 60000,
    //     sniffOnStart: true,
    //     auth: {
    //       username: 'elastic',
    //       password: 'YourNewPassword',
    //     },
    //   }),
    // }),
    UserIdentityModule,
    RoleModule,
    PermissionModule,
    AuthModule,
    EventsModule,
    TicketsModule,
    SearchModule,
    OrdersModule,
    NotificationsModule,
    AuditLogModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
