import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { BookingsModule } from './bookings/bookings.module';
import { ManifestsModule } from './manifests/manifests.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    ShipmentsModule,
    BookingsModule,
    ManifestsModule,
  ],
})
export class AppModule {}
