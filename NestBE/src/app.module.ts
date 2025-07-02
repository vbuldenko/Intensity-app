import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AbonementsModule } from './modules/abonements/abonements.module';
import { TrainingsModule } from './modules/trainings/trainings.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { ScheduleModule } from './modules/schedule/schedule.module';
import { TokenModule } from './modules/tokens/token.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('database.uri'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    AuthModule,
    AbonementsModule,
    TrainingsModule,
    ReservationsModule,
    ScheduleModule,
    TokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
