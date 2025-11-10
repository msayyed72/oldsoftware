import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bullmq';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ShipmentsModule } from './shipments/shipments.module';
import { BookingsModule } from './bookings/bookings.module';
import { ManifestsModule } from './manifests/manifests.module';
import { JobsModule } from './jobs/jobs.module';

const bullModuleConfig = process.env.REDIS_HOST ? 
  BullModule.forRoot({
    connection: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT) || 6379,
      maxRetriesPerRequest: 3,
      retryStrategy: (times) => {
        if (times > 3) return null;
        return Math.min(times * 50, 2000);
      },
    },
  }) : 
  null;

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ...(bullModuleConfig ? [bullModuleConfig] : []),
    PrismaModule,
    AuthModule,
    ShipmentsModule,
    BookingsModule,
    ManifestsModule,
    JobsModule,
  ],
})
export class AppModule {}
